import { Component, Inject, InjectionToken, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

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
  public onKeydown = new Subject<string>();
  public onClose = new Subject<void>();

  private currentImageIndex = 0;
  private images: string[];

  constructor(@Inject(IMAGE_OVERLAY_DATA_TOKEN) public imageOverlayData: ImageOverlayData) {
    this.images = imageOverlayData.images;
    this.currentImageIndex = this.obtainCurrentImageIndex(imageOverlayData.currentImage as string);
    this.currentImage = this.images[this.currentImageIndex];
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
  }
}
