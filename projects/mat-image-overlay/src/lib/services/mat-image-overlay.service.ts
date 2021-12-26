import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { MatImageOverlayComponent, IMAGE_OVERLAY_DATA_TOKEN, ImageOverlayData } from '../mat-image-overlay.component';

@Injectable()
export class MatImageOverlayService {
  imageOverlayComponentRef!: ComponentRef<MatImageOverlayComponent>;
  overlayRef!: OverlayRef;

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  private buildInjector(images: string[], currentImage?: string): Injector {
    const imageOverlayData: ImageOverlayData = {images: images, currentImage: currentImage};
    return Injector.create({
      providers: [{provide: IMAGE_OVERLAY_DATA_TOKEN, useValue: imageOverlayData}],
      parent: this.injector
    });
  }

  private buildOverlayConfig(): OverlayConfig {
    const result = new OverlayConfig();
    result.hasBackdrop = true;
    result.positionStrategy = this.overlay.position().global().centerVertically().centerHorizontally();
    return result;
  }

  open(images: string[], currentImage?: string): void {
    const imagesInjector = this.buildInjector(images, currentImage);
    const imagePortal = new ComponentPortal(MatImageOverlayComponent, null, imagesInjector);

    // Connect overlay to this service
    this.overlayRef = this.overlay.create(this.buildOverlayConfig());
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

    // Connect component to this service
    this.imageOverlayComponentRef = this.overlayRef.attach(imagePortal);
    this.imageOverlayComponentRef.instance.onClose.subscribe(() => this.overlayRef.dispose());
  }
}
