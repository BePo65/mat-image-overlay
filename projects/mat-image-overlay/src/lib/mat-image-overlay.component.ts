import { Component, Inject, InjectionToken, HostListener } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { CLOSE_ICON, ARROW_FORWARD_ICON, ARROW_BACKWARD_ICON } from './mat-image-overlay.svg';

export interface ImageOverlayData {
  images: string[];
  currentImage?: string;
}

export const IMAGE_OVERLAY_DATA_TOKEN = new InjectionToken<ImageOverlayData>('IMAGE_OVERLAY_DATA');

@Component({
  templateUrl: './mat-image-overlay.component.html',
  styleUrls: ['./mat-image-overlay.component.scss']
})
export class MatImageOverlayComponent {
  public currentImage: string;
  public firstImage = false;
  public lastImage = false;
  public onClose = new Subject<void>();

  private currentImageIndex = 0;
  private images: string[];

  constructor(
    @Inject(IMAGE_OVERLAY_DATA_TOKEN) public imageOverlayData: ImageOverlayData,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.images = imageOverlayData.images;
    this.currentImageIndex = this.obtainCurrentImageIndex(imageOverlayData.currentImage as string);
    this.currentImage = this.images[this.currentImageIndex];
    this.updateImageState();

    // Get material icons as svg icons
    this.matIconRegistry.addSvgIconLiteral('close', this.domSanitizer.bypassSecurityTrustHtml(CLOSE_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_back_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_BACKWARD_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_forward_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_FORWARD_ICON));
  }

  public closeOverlay(): void {
    this.onClose.next();
  }

  public gotoNextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.images[this.currentImageIndex];
    }
    this.updateImageState();
  }

  public gotoPreviousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.images[this.currentImageIndex];
    }
    this.updateImageState();
  }

  public gotoFirstImage(): void {
    this.currentImageIndex = 0;
    this.currentImage = this.images[this.currentImageIndex];
    this.updateImageState();
  }

  public gotoLastImage(): void {
    this.currentImageIndex = this.images.length - 1;
    this.currentImage = this.images[this.currentImageIndex];
    this.updateImageState();
  }

  private obtainCurrentImageIndex(dataCurrentImage: string): number {
    if (dataCurrentImage) {
      return this.images.indexOf(dataCurrentImage);
    }
    return 0;
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
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
    }
  }

  /**
   * Update state of flags that show, if current image is first or last
   * in list of images.
   */
  private updateImageState() {
    this.firstImage = (this.currentImageIndex <= 0);
    this.lastImage = (this.currentImageIndex >= (this.images.length - 1));
  }
}
