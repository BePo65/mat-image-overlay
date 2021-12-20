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
  public firstImage = false;
  public lastImage = false;
  public onKeydown = new Subject<string>();
  public onClose = new Subject<void>();

  private currentImageIndex = 0;
  private images: string[];

  constructor(@Inject(IMAGE_OVERLAY_DATA_TOKEN) public imageOverlayData: ImageOverlayData) {
    this.images = imageOverlayData.images;
    this.currentImageIndex = this.obtainCurrentImageIndex(imageOverlayData.currentImage as string);
    this.currentImage = this.images[this.currentImageIndex];
    this.updateImageState();
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

  private obtainCurrentImageIndex(dataCurrentImage: string): number {
    if (dataCurrentImage) {
      return this.images.indexOf(dataCurrentImage);
    }
    return 0;
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
    this.onKeydown.next(event.key);
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
