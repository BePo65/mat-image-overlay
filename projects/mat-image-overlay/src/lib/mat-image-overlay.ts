import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

import { IMAGE_OVERLAY_CONFIG_TOKEN, MatImageOverlayComponent } from './component/mat-image-overlay.component';
import { MatImageOverlayRef } from './mat-image-overlay-ref';
import { MatImageOverlayConfig } from './mat-image-overlay-config';

@Injectable()
export class MatImageOverlay {
  public imageOverlayRef: MatImageOverlayRef | undefined;

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

  public open(config: MatImageOverlayConfig): MatImageOverlayRef {
    // Make sure that always only 1 overlay is open at a time
    if (!this.imageOverlayExists()) {
      const activeConfig = this.currentConfig(config);

      const imagesInjector = this.buildInjector(activeConfig);
      const imagePortal = new ComponentPortal(MatImageOverlayComponent, null, imagesInjector);

      // Connect overlay to this service
      const overlayRef = this.overlay.create(this.buildOverlayConfig(activeConfig));

      // Connect component to this service
      const imageOverlayComponentRef = overlayRef.attach(imagePortal);

      this.imageOverlayRef = new MatImageOverlayRef(overlayRef, imageOverlayComponentRef.instance);
      this.imageOverlayRef.afterClosed().subscribe(lastImageIndex => {
        this.imageOverlayRef = undefined;
        this.afterClosed.next(lastImageIndex);
      })
      this.afterOpened.next(this.imageOverlayRef);

      return this.imageOverlayRef;
    } else {
      throw new Error('There is already an image overlay open; only 1 is allowed at a time.');
    }
  }

  public imageOverlayExists(): boolean {
    return (this.imageOverlayRef !== undefined);
  }

  private currentConfig(config: MatImageOverlayConfig): MatImageOverlayConfig {
    const activeConfig = new MatImageOverlayConfig();
    if(config.images) {
      activeConfig.images = config.images;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if ((config.startImageIndex) && (config.startImageIndex >= 0)) {
      activeConfig.startImageIndex = config.startImageIndex;
    }

    if (config.backdropClass) {
      activeConfig.backdropClass = config.backdropClass;
    }

    return activeConfig;
  }
}
