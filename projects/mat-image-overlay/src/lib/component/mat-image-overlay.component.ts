import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { MatImageDetailsProvider } from '../interfaces/mat-image-details-provider.class';
import { ElementDisplayPosition, ElementDisplayStyle, MatImageOverlayConfig } from '../interfaces/mat-image-overlay-config.interface';
import { ARROW_BACKWARD_ICON, ARROW_FORWARD_ICON, CLOSE_ICON } from '../mat-image-overlay.svg';

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

@Component({
  templateUrl: './mat-image-overlay.component.html',
  styleUrls: ['./mat-image-overlay.component.scss']
})
export class MatImageOverlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('overlayImage') overlayImage!: ElementRef;
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
  protected firstImage = false;
  protected lastImage = false;

  protected elementDisplayStyle = ElementDisplayStyle;
  protected overlayButtonsStyle: ElementDisplayStyle;
  protected descriptionDisplayStyle: ElementDisplayStyle;
  protected elementDisplayPosition = ElementDisplayPosition;
  protected descriptionDisplayPosition = this.elementDisplayPosition.right;

  private imageDetails: MatImageDetailsProvider;
  private imagedClickedAdditionalData: Record<string, unknown> = {};

  constructor(
    @Inject(IMAGE_OVERLAY_CONFIG_TOKEN) public _config: MatImageOverlayConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private renderer2: Renderer2
  ) {
    if (_config.imageDetails && (typeof _config.imageDetails === 'object')) {
      this.imageDetails = _config.imageDetails;
    } else {
      throw new Error('The configuration for MatImageOverlay must contain a field named "imageDetails');
    }

    this.currentImageIndex = _config.startImageIndex ?? 0;
    if (this.imageDetails.numberOfImages > 0) {
      this.currentImageDescription = this.imageDetails.descriptionForImage(this.currentImageIndex);
      this.currentImageUrl = this.imageDetails.urlForImage(this.currentImageIndex);
    }

    this.imagedClickedAdditionalData = _config.imageClickedAdditionalData ?? {};
    this.updateImageState();
    this.overlayButtonsStyle = _config.overlayButtonsStyle ?? ElementDisplayStyle.onHover;
    this.descriptionDisplayStyle = _config.descriptionDisplayStyle ?? ElementDisplayStyle.onHover;
    this.descriptionDisplayPosition = _config.descriptionDisplayPosition ?? ElementDisplayPosition.right;

    // Get material icons as svg icons
    this.matIconRegistry.addSvgIconLiteral('close', this.domSanitizer.bypassSecurityTrustHtml(CLOSE_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_back_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_BACKWARD_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_forward_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_FORWARD_ICON));
  }

  public ngAfterViewInit(): void {
    this.stateChanged.emit({ state: ImageOverlayState.opened });
  }

  public ngOnDestroy(): void {
    this.stateChanged.emit({ state: ImageOverlayState.closed });
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

  public gotoImage(imageIndex: number): void {
    if ((imageIndex >= 0) && (imageIndex < this.imageDetails.numberOfImages)) {
      this.currentImageIndex = imageIndex;
      this.currentImageDescription = this.imageDetails.descriptionForImage(imageIndex);
      this.currentImageUrl = this.imageDetails.urlForImage(imageIndex);
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
}
