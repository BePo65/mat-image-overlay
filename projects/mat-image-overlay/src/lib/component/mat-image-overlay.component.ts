import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Inject, InjectionToken, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ElementDisplayPosition, ElementDisplayStyle, MatImageOverlayConfig } from '../interfaces/mat-image-overlay-config';
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
 * Event that captures the state of the component.
 */
export interface ImageOverlayStateEvent {
  state: ImageOverlayState;
  data?: unknown;
}

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

  public stateChanged = new EventEmitter<ImageOverlayStateEvent>();
  public imageChanged = new EventEmitter<ImageChangedEvent>();

  // These properties are internal only (for use in the template)
  public currentImage: unknown;
  public currentImageDescription = '';
  public currentImageIndex = 0;
  public currentImageUrl: string;
  public firstImage = false;
  public lastImage = false;

  public elementDisplayStyle = ElementDisplayStyle;
  public overlayButtonsStyle: ElementDisplayStyle;
  public descriptionDisplayStyle: ElementDisplayStyle;
  public elementDisplayPosition = ElementDisplayPosition;
  public descriptionDisplayPosition = this.elementDisplayPosition.right;

  // Propery is needed for MatImageOverlayHarness
  public figureHovering = false;

  private images: unknown[];
  private imageClickUnlistener: (() => void) | undefined;

  constructor(
    @Inject(IMAGE_OVERLAY_CONFIG_TOKEN) public _config: MatImageOverlayConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private renderer2: Renderer2
  ) {
    this.images = _config.images ?? [] as string[];
    this.currentImageIndex = _config.startImageIndex ?? 0;
    this.setCurrentImage(this.currentImageIndex);
    this.currentImageUrl = this.urlOfCurrentImage();
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
    if ((this._config.imageClickHandler !== undefined) && (typeof this._config.imageClickHandler === 'function')) {
      this.imageClickUnlistener = this.renderer2.listen(this.overlayImage.nativeElement, 'click', () => {
        if ((this._config.imageClickHandler !== undefined) && (typeof this._config.imageClickHandler === 'function')) {
          this._config.imageClickHandler(this.currentImage, this._config.imageClickHandlerConfiguration);
        }
      });
    }

    this.stateChanged.emit({ state: ImageOverlayState.opened });
  }

  public ngOnDestroy(): void {
    this.stateChanged.emit({ state: ImageOverlayState.closed });

    if(this.imageClickUnlistener) {
      this.imageClickUnlistener();
    }
  }

  public onClose(): void {
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
        this.onClose();
    }

    // Don't send keystroke back to psge containing overlay
    event.preventDefault();
    event.stopPropagation();
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
    this.gotoImage(this.images.length - 1);
  }

  public gotoImage(imageIndex: number): void {
    if ((imageIndex >= 0) && (imageIndex < this.images.length)) {
      this.currentImageIndex = imageIndex;
      this.setCurrentImage(this.currentImageIndex);
      this.currentImageUrl = this.urlOfCurrentImage();
      this.updateImageState();
    }
  }

  /**
   * Is 'text' undefined or an empty string.
   * Used in html template.
   *
   * @param text - element under inspection
   * @returns if 'text'is not a non empty string
   */
  public isUndefinedOrEmpty(text: string | undefined): boolean {
    return (text === undefined) || (text.length === 0);
  }

  private setCurrentImage(imageIdex: number) {
    this.currentImage = this.images[imageIdex];

    if(this._config.descriptionForImage) {
      this.currentImageDescription = this._config.descriptionForImage(this.currentImage, this._config.descriptionForImageConfiguration);
    } else {
      this.currentImageDescription = '';
    }
  }

  /**
   * Gets the url for the current image using the function 'urlForImage'
   * from the configuration.
   * If 'urlForImage' is undefined, return the url of the 'broken image' image.
   *
   * @returns the url for the current image or for the 'brokenImage'
   */
  private urlOfCurrentImage(): string {
    let url = '';

    if(this._config.urlForImage) {
      url = this._config.urlForImage(this.currentImage, this._config.baseUrl);
    } else {
      console.error('Cannot get url for image, because the configuration option "urlForImage" is undefined.');
    }

    return url;
  }

  /**
   * Update state of flags that show, if current image is first or last
   * in list of images.
   */
  private updateImageState() {
    this.firstImage = (this.currentImageIndex <= 0);
    this.lastImage = (this.currentImageIndex >= (this.images.length - 1));
    this.imageChanged.emit({ imageIndex: this.currentImageIndex });
  }
}
