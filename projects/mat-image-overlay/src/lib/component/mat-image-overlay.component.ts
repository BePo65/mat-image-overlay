import { AfterViewInit, Component, EventEmitter, HostListener, Inject, InjectionToken, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ElementDisplayStyle, MatImageOverlayConfig } from '../interfaces/mat-image-overlay-config';
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
  public stateChanged = new EventEmitter<ImageOverlayStateEvent>();
  public imageChanged = new EventEmitter<ImageChangedEvent>();

  // These properties are internal only (for use in the template)
  public currentImage: unknown;
  public currentImageUrl: string;
  public firstImage = false;
  public lastImage = false;
  public currentImageIndex = 0;

  elementDisplayStyle = ElementDisplayStyle;
  public overlayButtonsStyle: ElementDisplayStyle;
  public descriptionDisplayStyle: ElementDisplayStyle;

  private images: unknown[];

  constructor(
    @Inject(IMAGE_OVERLAY_CONFIG_TOKEN) public _config: MatImageOverlayConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.images = _config.images ?? [] as string[];
    this.currentImageIndex = _config.startImageIndex ?? 0;
    this.setCurrentImage(this.currentImageIndex);
    this.currentImageUrl = this.urlOfCurrentImage();
    this.updateImageState();
    this.overlayButtonsStyle = _config.overlayButtonsStyle ?? ElementDisplayStyle.onHover;
    this.descriptionDisplayStyle = _config.descriptionDisplayStyle ?? ElementDisplayStyle.onHover;

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
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.setCurrentImage(this.currentImageIndex);
      this.currentImageUrl = this.urlOfCurrentImage();
      this.updateImageState();
    }
  }

  public gotoPreviousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.setCurrentImage(this.currentImageIndex);
      this.currentImageUrl = this.urlOfCurrentImage();
      this.updateImageState();
    }
  }

  public gotoFirstImage(): void {
    this.currentImageIndex = 0;
    this.setCurrentImage(this.currentImageIndex);
    this.currentImageUrl = this.urlOfCurrentImage();
    this.updateImageState();
  }

  public gotoLastImage(): void {
    this.currentImageIndex = this.images.length - 1;
    this.setCurrentImage(this.currentImageIndex);
    this.currentImageUrl = this.urlOfCurrentImage();
    this.updateImageState();
  }

  public gotoImage(imageIndex: number): void {
    if ((this.currentImageIndex > 0) && (imageIndex < this.images.length - 1)) {
      this.currentImageIndex = imageIndex;
      this.setCurrentImage(this.currentImageIndex);
      this.currentImageUrl = this.urlOfCurrentImage();
      this.updateImageState();
    }
  }

  /**
   * Get the description property of the current image
   * if descriptionDisplayStyle is 'onHover'.
   * @returns description property of the current image or undefined
   */
  descriptionOnHover(): string | undefined {
    let result: string | undefined;
    if ((this.descriptionDisplayStyle === ElementDisplayStyle.onHover)) {
      result = this.currentImageDescription();
    }

    return result;

  }

  /**
   * Get the description property of the current image.
   * @returns description property of the current image
   */
  descriptionAsString(): string {
    let result = this.currentImageDescription();
    if (result === undefined) {
      result = '';
    }

    return result;
  }

  /**
   * Gets the url for the current image using the function 'urlForImage'
   * from the configuration.
   * If 'urlForImage' is undefined, return the url of the 'broken image' image.
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

  private setCurrentImage(imageIdex: number) {
    this.currentImage = this.images[imageIdex];
  }

  private currentImageDescription(): string | undefined {
    let result: string | undefined;
    if (typeof this.currentImage === 'object') {
      result = (this.currentImage as object)['description' as keyof object];
    }

    return result;
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
