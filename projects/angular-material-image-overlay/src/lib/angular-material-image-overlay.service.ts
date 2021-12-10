import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { AngularMaterialImageOverlayComponent, IMAGE_OVERLAY_DATA_TOKEN, ImageOverlayData } from './angular-material-image-overlay.component';
import { AngularMaterialImageOverlayModule } from './angular-material-image-overlay.module';

@Injectable({
  providedIn: AngularMaterialImageOverlayModule
})
export class AngularMaterialImageOverlayService {
  imageOverlayComponentRef!: ComponentRef<AngularMaterialImageOverlayComponent>;
  overlayRef!: OverlayRef;
  constructor(
      private injector: Injector,
      private overlay: Overlay) {
  }

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
    const imagePortal = new ComponentPortal(AngularMaterialImageOverlayComponent, null, imagesInjector);

    this.overlayRef = this.overlay.create(this.buildOverlayConfig());

    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

    this.imageOverlayComponentRef = this.overlayRef.attach(imagePortal);
    this.imageOverlayComponentRef.instance.onKeydown.subscribe(keycode => this.onKeydown(keycode));
    this.imageOverlayComponentRef.instance.onClose.subscribe(() => this.overlayRef.dispose());
  }

  private onKeydown(keycode: string): void {
    switch (keycode) {
      case('ArrowRight'):
      case('ArrowDown'):
        this.imageOverlayComponentRef.instance.nextImage();
        break;
      case('ArrowLeft'):
      case('ArrowUp'):
        this.imageOverlayComponentRef.instance.previousImage();
        break;
      case('Escape'):
        this.overlayRef.dispose();
    }
  }
}
