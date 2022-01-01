import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

import { MatImageOverlayComponent, IMAGE_OVERLAY_CONFIG_TOKEN } from '../mat-image-overlay.component';
import { MatImageOverlayRef } from '../mat-image-overlay-ref';
import { MatImageOverlayConfig } from '../mat-image-overlay-config';

@Injectable()
export class MatImageOverlay {
  public imageOverlayComponentRef!: ComponentRef<MatImageOverlayComponent>;
  public overlayRef!: OverlayRef;

  /** Stream that emits when fhe image overlay has been opened. */
  private readonly _afterOpened = new Subject<MatImageOverlayRef>();
  get afterOpened(): Subject<MatImageOverlayRef> {
    return this._afterOpened;
  }

  /** Stream that emits when fhe image overlay has been closed. */
  private readonly _afterClosed = new Subject<number>();
  get afterClosed(): Subject<number> {
    return this._afterClosed;
  }

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  private buildInjector(images: string[], currentImage?: string): Injector {
    const conf = {images, startImageIndex: this.urlToImageIndex(images, currentImage)};
    const activeConfig = this._applyConfigDefaults(conf, new MatImageOverlayConfig());
    return Injector.create({
      providers: [{provide: IMAGE_OVERLAY_CONFIG_TOKEN, useValue: activeConfig}],
      parent: this.injector
    });
  }

  private buildOverlayConfig(): OverlayConfig {
    const result = new OverlayConfig();
    result.hasBackdrop = true;
    result.positionStrategy = this.overlay.position().global().centerVertically().centerHorizontally();
    return result;
  }

  public open(images: string[], currentImage?: string): MatImageOverlayRef {
    const imagesInjector = this.buildInjector(images, currentImage);
    const imagePortal = new ComponentPortal(MatImageOverlayComponent, null, imagesInjector);

    // Connect overlay to this service
    this.overlayRef = this.overlay.create(this.buildOverlayConfig());
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

    // Connect component to this service
    this.imageOverlayComponentRef = this.overlayRef.attach(imagePortal);
    this.imageOverlayComponentRef.instance.onClose.subscribe(() => this.overlayRef.dispose());

    const imageOverlayRef = new MatImageOverlayRef(this.overlayRef, this.imageOverlayComponentRef.instance);

    return imageOverlayRef;
  }

  /**
   * Applies default options to the image overlay config.
   * @param config - Config to be modified.
   * @param defaultOptions - Default options provided.
   * @returns The new configuration object.
   */
  private _applyConfigDefaults(config?: MatImageOverlayConfig, defaultOptions?: MatImageOverlayConfig): MatImageOverlayConfig {
    return {...defaultOptions, ...config};
  }

  // HACK url in Index umrechen (solange wir die url als parameter bekommen)
    private urlToImageIndex(images: string[], urlToCurrentImage?: string): number {
    if (urlToCurrentImage) {
      return images.indexOf(urlToCurrentImage);
    }
    return 0;
  }

}
