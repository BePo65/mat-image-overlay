import { Component, Inject, InjectionToken, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

export interface ImageOverlayData {
  images: string[];
  currentImage?: string;
}

export const IMAGE_OVERLAY_DATA_TOKEN = new InjectionToken<ImageOverlayData>('IMAGE_OVERLAY_DATA');

@Component({
  templateUrl: './angular-material-image-overlay.component.html',
  styleUrls: ['./angular-material-image-overlay.component.scss']
})
export class AngularMaterialImageOverlayComponent {
  private currentImageIndex = 0;
  private images: string[];
  currentImage: string;
  onKeydown = new Subject<string>();
  onClose = new Subject<void>();

  constructor(@Inject(IMAGE_OVERLAY_DATA_TOKEN) public imageOverlayData: ImageOverlayData) {
    this.images = imageOverlayData.images;
    this.currentImageIndex = this.obtainCurrentImageIndex(imageOverlayData.currentImage);
    this.currentImage = this.images[this.currentImageIndex]
  }

  private obtainCurrentImageIndex(dataCurrentImage: string): number {
    if (dataCurrentImage) {
      return this.images.indexOf(dataCurrentImage);
    }
    return 0;
  }

  // TODO: Can we make this private?
  @HostListener('document:keydown', ['$event']) handleKeydown(event: KeyboardEvent) {
    this.onKeydown.next(event.key);
  }

  close(): void {
    this.onClose.next();
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }
}
