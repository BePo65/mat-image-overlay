import { NgIf, NgStyle, NgClass } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subject, asyncScheduler, takeUntil, throttleTime } from 'rxjs';

import { MatImageDetailsProvider } from '../interfaces/mat-image-details-provider.class';
import { ElementDisplayPosition, ElementDisplayStyle, MatImageOverlayConfig } from '../interfaces/mat-image-overlay-config.interface';
import { ThumbnailProvider } from '../interfaces/mat-image-overlay-thumbnail.interface';
import { ARROW_BACKWARD_ICON, ARROW_FORWARD_ICON, CLOSE_ICON } from '../mat-image-overlay.svg';
import { Dimensions } from '../types/image-dimensions.type';

/**
 * States of the component.
 */
export enum ImageOverlayState {
  opened,
  closingRequested,
  closed
}

/**
 * Properties of the event that captures the state of the component.
 *
 * state: new state of the overlay
 * data: number of image or undefined (state open or closed)
 */
export interface ImageOverlayStateEvent {
  state: ImageOverlayState;
  data?: unknown;
}

/**
 * Properties of the event that triggers, when a new image gets shown.
 *
 * imageIndex: index of the new image
 */
export interface ImageChangedEvent {
  imageIndex: number;
}

export const IMAGE_OVERLAY_CONFIG_TOKEN = new InjectionToken<MatImageOverlayConfig>('IMAGE_OVERLAY_CONFIG');

/** Maximum dimensions styles for an image - resulting variables used in the template */
type ImageMaxDimensionsStyle = {
  'max-width.px'?: number,
  'max-height.px'?: number
}

/** Dimensions style for an thumbnail - resulting variables used in the template */
type ThumbnailDimensionsStyle = {
  'height.px'?: number,
  height?: 'auto',
  'width.px'?: number,
  width?: 'auto',
  'max-width.px'?: number,
  'max-height.px'?: number
}

@Component({
    templateUrl: './mat-image-overlay.component.html',
    styleUrls: ['./mat-image-overlay.component.scss'],
    standalone: true,
    imports: [NgIf, NgStyle, NgClass, MatIconModule]
})
export class MatImageOverlayComponent implements AfterContentInit, AfterViewInit, OnDestroy {
  @ViewChild('overlayWrapper') overlayWrapper!: ElementRef;
  @ViewChild('plainImage') overlayImage!: ElementRef;
  @ViewChild('thumbnailImage') thumbnailMiddle!: ElementRef;
  @ViewChild('mainImage') imageMiddle!: ElementRef;
  @Output() newItemEvent = new EventEmitter<KeyboardEvent>();

  public stateChanged = new EventEmitter<ImageOverlayStateEvent>();
  public imageChanged = new EventEmitter<ImageChangedEvent>();
  public imageClicked = new EventEmitter<Record<string, unknown>>();
  public keyDown = new EventEmitter<KeyboardEvent>();
  public currentImageIndex = 0;

  // Property is needed for MatImageOverlayHarness
  public figureHovering = false;

  // These properties are internal only (for use in the template)
  protected currentImageDescription = '';
  protected currentImageUrl = '';
  protected currentThumbnailUrl = '';
  protected firstImage = false;
  protected lastImage = false;

  protected elementDisplayStyle = ElementDisplayStyle;
  protected overlayButtonsStyle: ElementDisplayStyle;
  protected descriptionClasses: string[] = [];
  protected providerWithThumbnails = false;
  protected thumbnailDimensionStyle: ThumbnailDimensionsStyle = {
    'width.px': 0,
    height: 'auto',
    'max-height.px': 0,
    'max-width.px': 0
  };
  protected mainImageMaxDimensionStyle: ImageMaxDimensionsStyle = {
    'max-height.px': 0,
    'max-width.px': 0
  };
  protected plainImageMaxDimensionStyle: ImageMaxDimensionsStyle = {
    'max-height.px': 0,
    'max-width.px': 0
  };
  protected imageMargin: number;

  private imageDetails: MatImageDetailsProvider;
  private imagedClickedAdditionalData: Record<string, unknown> = {};
  private cdkOverlayWrapper: HTMLDivElement | undefined;
  private resizeEvent: ResizeObserver | undefined;
  private resizedDimensions$ = new BehaviorSubject<Dimensions>({height:0, width:0});
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(IMAGE_OVERLAY_CONFIG_TOKEN) public _config: MatImageOverlayConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private renderer2: Renderer2,
    private host: ElementRef,
    private zone: NgZone
  ) {
    if (_config.imageDetails && (typeof _config.imageDetails === 'object')) {
      this.imageDetails = _config.imageDetails;
    } else {
      throw new Error('The configuration for MatImageOverlay must contain a field named "imageDetails');
    }

    this.providerWithThumbnails = this.isThumbnailProvider(this.imageDetails);
    this.currentImageIndex = _config.startImageIndex ?? 0;
    this.imageMargin = _config.margin || 0;
    this.imagedClickedAdditionalData = _config.imageClickedAdditionalData ?? {};
    this.updateImageState();
    this.overlayButtonsStyle = _config.overlayButtonsStyle ?? ElementDisplayStyle.onHover;
    this.imageDescriptionClasses(_config);
    this.getIcons();
  }

  public ngAfterContentInit(): void {
    const nativeHost = (this.host as ElementRef<HTMLElement>).nativeElement;
    const cdkOverlayPane = this.renderer2.parentNode(nativeHost) as HTMLDivElement;
    this.cdkOverlayWrapper = this.renderer2.parentNode(cdkOverlayPane) as HTMLDivElement;

    // Set initial dimensions of image
    const clientRect = this.cdkOverlayWrapper.getBoundingClientRect();
    this.updateResizeDimensions(clientRect.width, clientRect.height);
    this.setThumbnailMaxDimensions(clientRect.width, clientRect.height);
    this.setMainImageMaxDimensions(clientRect.width, clientRect.height);
    this.setPlainImageMaxDimensions(clientRect.width, clientRect.height);

    if (this.imageDetails.numberOfImages > 0) {
      this.currentImageDescription = this.imageDetails.descriptionForImage(this.currentImageIndex);
      this.setThumbnailDimensions();
      this.updateImageUrls();
    }
  }

  public ngAfterViewInit(): void {
    // Watch for resize events to adjust the image dimensions
    this.createObserveWrapperResize();

    this.stateChanged.emit({ state: ImageOverlayState.opened });
  }

  public ngOnDestroy(): void {
    this.stateChanged.emit({ state: ImageOverlayState.closed });

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public get numberOfImages(): number {
    return this.imageDetails.numberOfImages;
  }

  public closeOverlay(): void {
    this.stateChanged.emit({ state: ImageOverlayState.closingRequested, data: this.currentImageIndex });
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case('ArrowRight'):
      case('ArrowDown'):
        this.gotoNextImage();
        break;
      case('ArrowLeft'):
      case('ArrowUp'):
        this.gotoPreviousImage();
        break;
      case('Home'):
        this.gotoFirstImage();
        break;
      case('End'):
        this.gotoLastImage();
        break;
      case('Escape'):
        this.closeOverlay();
        break;
      default:
        this.keyDown.emit(event);
    }

    // Don't send keystroke back to page containing overlay
    return false;
  }

  public gotoNextImage(): void {
    this.gotoImage(this.currentImageIndex + 1);
  }

  public gotoPreviousImage(): void {
    this.gotoImage(this.currentImageIndex - 1);
  }

  public gotoFirstImage(): void {
    this.gotoImage(0);
  }

  public gotoLastImage(): void {
    this.gotoImage(this.imageDetails.numberOfImages - 1);
  }

  /**
   * Go to image with the given image (0-based).
   * @param imageIndex - index of the image to go to (0-based)
   */
  public gotoImage(imageIndex: number): void {
    if ((imageIndex >= 0) && (imageIndex < this.imageDetails.numberOfImages) && (this.currentImageIndex !== imageIndex)) {
      this.currentImageIndex = imageIndex;
      this.currentImageDescription = this.imageDetails.descriptionForImage(imageIndex);
      this.resetIsLoaded();
      this.updateImageUrls();
      this.setThumbnailDimensions();
      this.updateImageState();
    }
  }

  /**
   * Is 'text' undefined or an empty string.
   * Used in html template.
   * @param text - element under inspection
   * @returns if 'text'is not a non empty string
   */
  protected isUndefinedOrEmpty(text: string | undefined): boolean {
    return (text === undefined) || (text.length === 0);
  }

  protected btnNextImage() {
    this.gotoNextImage();
    return false;
  }

  protected btnPreviousImage() {
    this.gotoPreviousImage();
    return false;
  }

  protected btnClose() {
    this.closeOverlay();
    return false;
  }

  /**
   * Handle click event of image.
   * Emit image detail information + additionalData.
   */
  protected onImageClicked() {
    const result = this.mergeRecords(this.imageDetails.imageInformation(this.currentImageIndex), this.imagedClickedAdditionalData || {});
    this.imageClicked.emit(result);
}

  /**
   * Handle onload event of thumbnail image.
   * Make thumbnail image visible, when finished loading.
   */
  protected thumbnailIsLoaded() {
    this.renderer2.setAttribute(this.thumbnailMiddle.nativeElement, 'data-loaded', 'true');
  }

  /**
   * Handle onload event of the main image.
   * Make image visible, when finished loading.
   */
  protected mainImageIsLoaded() {
    this.renderer2.setAttribute(this.imageMiddle.nativeElement, 'data-loaded', 'true');
  }

  /**
   * Handle onload event of image without thumbnail.
   * Make image visible, when finished loading.
   */
  protected plainImageIsLoaded() {
    this.renderer2.setAttribute(this.overlayImage.nativeElement, 'data-loaded', 'true');
  }

  /**
   * Get array with classes used to display the image description.
   * @param _config - configuration object for the overlay
   */
  private imageDescriptionClasses(_config: MatImageOverlayConfig) {
    const descriptionDisplayStyle = _config.descriptionDisplayStyle ?? ElementDisplayStyle.onHover;
    const descriptionDisplayPosition = _config.descriptionDisplayPosition ?? ElementDisplayPosition.bottomRight;
    this.descriptionClasses = [];
    if (descriptionDisplayStyle === ElementDisplayStyle.onHover) {
      this.descriptionClasses.push('show-on-hover');
    }
    if (descriptionDisplayStyle === ElementDisplayStyle.always) {
      this.descriptionClasses.push('show-always');
    }
    switch (descriptionDisplayPosition) {
      case ElementDisplayPosition.bottomLeft:
        this.descriptionClasses.push('show-bottom');
        this.descriptionClasses.push('show-left');
        break;
      case ElementDisplayPosition.topLeft:
        this.descriptionClasses.push('show-top');
        this.descriptionClasses.push('show-left');
        break;
      case ElementDisplayPosition.bottomCenter:
        this.descriptionClasses.push('show-bottom');
        this.descriptionClasses.push('show-center');
        break;
      case ElementDisplayPosition.topCenter:
        this.descriptionClasses.push('show-top');
        this.descriptionClasses.push('show-center');
        break;
      case ElementDisplayPosition.bottomRight:
        this.descriptionClasses.push('show-bottom');
        this.descriptionClasses.push('show-right');
        break;
      case ElementDisplayPosition.topRight:
        this.descriptionClasses.push('show-top');
        this.descriptionClasses.push('show-right');
        break;
    }
  }

  /**
   * Get material icons as svg icons.
   */
  private getIcons() {
    this.matIconRegistry.addSvgIconLiteral('close', this.domSanitizer.bypassSecurityTrustHtml(CLOSE_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_back_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_BACKWARD_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_forward_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_FORWARD_ICON));
  }

  /**
   * Create observer for this.cdkOverlayWrapper to update the
   * PlainImageDimensions.
   */
  private createObserveWrapperResize() {
    this.resizeEvent = new ResizeObserver(entries => {
      this.zone.run(() => {
        const newDimensions: Dimensions = {
          height: entries[0].contentRect.height,
          width: entries[0].contentRect.width
        };
        this.resizedDimensions$.next(newDimensions);
      });
    });
    this.cdkOverlayWrapper && this.resizeEvent.observe(this.cdkOverlayWrapper);

    this.resizedDimensions$
    .pipe(
      takeUntil(this.unsubscribe$),
      throttleTime(150, asyncScheduler, { leading: true, trailing: true })
    )
    .subscribe((newDimensions: Dimensions) => {
      this.setThumbnailMaxDimensions(newDimensions.width, newDimensions.height);
      this.setMainImageMaxDimensions(newDimensions.width, newDimensions.height);
      this.setPlainImageMaxDimensions(newDimensions.width, newDimensions.height);
    });
  }

  /**
   * Update state of flags that show, if current image is first or last
   * in list of images.
   */
  private updateImageState() {
    this.firstImage = (this.currentImageIndex <= 0);
    this.lastImage = (this.currentImageIndex >= (this.imageDetails.numberOfImages - 1));
    this.imageChanged.emit({ imageIndex: this.currentImageIndex });
  }

  /**
   * Merge 2 Records into a new Record.
   * The merge makes shallow copies of the original data.
   * @param record1 - first Record to be copied
   * @param record2 - Record to be merged into copy of record1
   * @returns new Record with record2 merged into copy of record1
   */
  private mergeRecords(record1: Record<string, unknown>, record2: Record<string, unknown>): Record<string, unknown> {
    let result: Record<string, unknown> = {};
    result = Object.assign(result, record1);
    result = Object.assign(result, record2);
    return result;
  }

  /**
   * Reset data-loaded attribute of images to make images invisible again.
   */
  private resetIsLoaded() {
    if (this.providerWithThumbnails) {
      this.renderer2.setAttribute(this.thumbnailMiddle.nativeElement, 'data-loaded', 'false');
      this.renderer2.setAttribute(this.imageMiddle.nativeElement, 'data-loaded', 'false');
    } else {
      this.renderer2.setAttribute(this.overlayImage.nativeElement, 'data-loaded', 'false');
    }
  }

  /**
   * Update the url and the thumbnail url for current image.
   */
  private updateImageUrls() {
    this.currentImageUrl = this.imageDetails.urlForImage(this.currentImageIndex);
    if (this.providerWithThumbnails) {
      const provider = this.imageDetails as unknown as ThumbnailProvider;
      this.currentThumbnailUrl = provider.urlForThumbnail(this.currentImageIndex);
    } else {
      this.currentThumbnailUrl = '';
    }
  }

  /**
   * Update the style used to set the dimensions of the thumbnail image.
   */
  private setThumbnailDimensions() {
    const newDimensions = this.mergeRecords({}, this.getThumbnailMaxDimensions()) as ThumbnailDimensionsStyle;

    if (this.providerWithThumbnails) {
      const provider = this.imageDetails as unknown as ThumbnailProvider;
      const currentDimensions = provider.imageDimensions(this.currentImageIndex);

      // One of the thumbnail dimensions must be 'auto' to keep the aspect ratio of the
      // thumbnail; the aspect ratio of the wrapper decides which one.
      const wrapperDimensions = this.resizedDimensions$.value;
      const aspectRatioWrapper = wrapperDimensions.width / wrapperDimensions.height;
      const aspectRatioThumbnail = currentDimensions.width / currentDimensions.height;

      if (aspectRatioThumbnail > aspectRatioWrapper) {
        newDimensions['width.px'] = currentDimensions.width;
        newDimensions.height = 'auto';
      } else {
        newDimensions['height.px'] = currentDimensions.height;
        newDimensions.width = 'auto';
      }
    }

    this.thumbnailDimensionStyle = newDimensions;
  }

  /**
   * Get the max-x entries of the thumbnailDimensionStyle property of this class.
   * @returns new object with the max-x entries of the thumbnailDimensionStyle
   */
  private getThumbnailMaxDimensions(): ThumbnailDimensionsStyle {
    const maxDimensions: ThumbnailDimensionsStyle = {};
    if (this.thumbnailDimensionStyle['max-height.px']) {
      maxDimensions['max-height.px'] = this.thumbnailDimensionStyle['max-height.px'];
    }
    if (this.thumbnailDimensionStyle['max-width.px']) {
      maxDimensions['max-width.px'] = this.thumbnailDimensionStyle['max-width.px'];
    }
    return maxDimensions;
  }

  /**
   * Set the max-width and max-height of the thumbnailDimensionStyle object
   * to the size of the container of this component without the margin.
   * @param width - width of the container element
   * @param height - height of the container element
   */
  private setThumbnailMaxDimensions(width: number, height: number) {
    const newDimensions = this.mergeRecords({}, this.getThumbnailDimensions()) as ThumbnailDimensionsStyle;
    newDimensions['max-height.px'] = Math.max(height - (2 * this.imageMargin), 0);
    newDimensions['max-width.px'] = Math.max(width - (2 * this.imageMargin), 0);

    this.thumbnailDimensionStyle = newDimensions;
  }

  /**
   * Get the height and width entries of the thumbnailDimensionStyle property of this class.
   * @returns new object with the height and width entries of the thumbnailDimensionStyle
   */
  private getThumbnailDimensions(): ThumbnailDimensionsStyle {
    const thumbnailDimensions: ThumbnailDimensionsStyle = {};
    if (this.thumbnailDimensionStyle['height.px']) {
      thumbnailDimensions['height.px'] = this.thumbnailDimensionStyle['height.px'];
    }
    if (this.thumbnailDimensionStyle.height) {
      thumbnailDimensions.height = this.thumbnailDimensionStyle.height;
    }
    if (this.thumbnailDimensionStyle['width.px']) {
      thumbnailDimensions['width.px'] = this.thumbnailDimensionStyle['width.px'];
    }
    if (this.thumbnailDimensionStyle.width) {
      thumbnailDimensions.width = this.thumbnailDimensionStyle.width;
    }
    return thumbnailDimensions;
  }

  /**
   * Set the max-width and max-height of the mainImageMaxDimensionStyle object
   * to the size of the container of this component without the margin.
   * @param width - width of the container element
   * @param height - height of the container element
   */
  private setMainImageMaxDimensions(width: number, height: number) {
    this.mainImageMaxDimensionStyle = {
      'max-height.px': Math.max(height - (2 * this.imageMargin), 0),
      'max-width.px': Math.max(width - (2 * this.imageMargin), 0)
    } as ImageMaxDimensionsStyle;
  }

  /**
   * Set the max-width and max-height of the plainImageMaxDimensionStyle object
   * to the size of the container of this component without the margin.
   * @param width - width of the container element
   * @param height - height of the container element
   */
  private setPlainImageMaxDimensions(width: number, height: number) {
    this.plainImageMaxDimensionStyle = {
      'max-height.px': Math.max(height - (2 * this.imageMargin), 0),
      'max-width.px': Math.max(width - (2 * this.imageMargin), 0)
    } as ImageMaxDimensionsStyle;
  }

  /**
   * Emit the dimensions of the overlay wrapper with resizedDimensions$.
   * @param width - width of the container element
   * @param height - height of the container element
   */
  private updateResizeDimensions(width: number, height: number) {
    const newDimensions: Dimensions = {
      height: height,
      width: width
    };

    this.resizedDimensions$.next(newDimensions);
}

  /**
   * Check if a provider implements the ThumbnailProvider interface.
   * @param value - object under inspection
   * @returns true, if value is ThumbnailProvider
   */
  private isThumbnailProvider(value: unknown): value is ThumbnailProvider {
    const typedValue = value as ThumbnailProvider;
    return (!!typedValue?.thumbnailHeight) && !!typedValue?.urlForThumbnail;
  }
}
