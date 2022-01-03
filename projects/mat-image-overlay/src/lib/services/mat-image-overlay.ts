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

  /** Stream that emits when the image overlay has been opened. */
  private readonly _afterOpened = new Subject<MatImageOverlayRef>();
  get afterOpened(): Subject<MatImageOverlayRef> {
    return this._afterOpened;
  }

  /** Stream that emits when the image overlay has been closed. */
  private readonly _afterClosed = new Subject<number>();
  get afterClosed(): Subject<number> {
    return this._afterClosed;
  }

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  private buildInjector(config: MatImageOverlayConfig): Injector {
    return Injector.create({
      providers: [
        {provide: IMAGE_OVERLAY_CONFIG_TOKEN, useValue: config}
      ],
      parent: this.injector
    });
  }

  private buildOverlayConfig(config: MatImageOverlayConfig): OverlayConfig {
    const result = new OverlayConfig();
    result.positionStrategy = this.overlay.position().global().centerVertically().centerHorizontally();
    result.hasBackdrop = true;
    if (config.backdropClass) {
      result.backdropClass = config.backdropClass;
    }

    return result;
  }

  public open(images: string[], firstImageIndex = 0, backdropClass?: string): MatImageOverlayRef {
    // TODO make sure that always only 1 overlay is open

    const activeConfig = this.currentConfig(images, firstImageIndex, backdropClass);

    const imagesInjector = this.buildInjector(activeConfig);
    const imagePortal = new ComponentPortal(MatImageOverlayComponent, null, imagesInjector);

    // Connect overlay to this service
    this.overlayRef = this.overlay.create(this.buildOverlayConfig(activeConfig));

    // Connect component to this service
    this.imageOverlayComponentRef = this.overlayRef.attach(imagePortal);

    const imageOverlayRef = new MatImageOverlayRef(this.overlayRef, this.imageOverlayComponentRef.instance);
    imageOverlayRef.afterClosed().subscribe(lastImageIndex => this.afterClosed.next(lastImageIndex))
    this.afterOpened.next(imageOverlayRef);

    return imageOverlayRef;
  }

  private currentConfig(images: string[], firstImageIndex?: number, backdropClass?: string): MatImageOverlayConfig {
    const activeConfig = new MatImageOverlayConfig();
    activeConfig.images = images;
    if (firstImageIndex) {
      activeConfig.startImageIndex = firstImageIndex;
    }

    if (backdropClass) {
      activeConfig.backdropClass = backdropClass;
    }

    return activeConfig;
  }
}
