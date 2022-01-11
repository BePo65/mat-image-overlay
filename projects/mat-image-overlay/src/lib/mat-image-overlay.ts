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

  /**
   * Open the image overlay and display the first image.
   * @param config - Object containing all configuration parameters
   * @returns An object as an interface to the created image overlay
   */
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

  /**
   * Has overlay been created and is visible?
   * @returns A flag indicating if image overlay is visible
   */
  public imageOverlayExists(): boolean {
    return (this.imageOverlayRef !== undefined);
  }

  /**
   * Create injector for image overlay configuration object.
   * @param config - Object containing all configuration parameters
   * @returns The new injector instance
   */
  private buildInjector(config: MatImageOverlayConfig): Injector {
    return Injector.create({
      providers: [
        {provide: IMAGE_OVERLAY_CONFIG_TOKEN, useValue: config}
      ],
      parent: this.injector
    });
  }

  /**
   * Build the configuration for the image overlay.
   * The configuration includes common elements and elements from the given config object.
   * @param config - Object containing all configuration parameters (only 'backdropClass' is used)
   * @returns An object with all configuratio parameters for the image overlay
   */
  private buildOverlayConfig(config: MatImageOverlayConfig): OverlayConfig {
    const result = new OverlayConfig();
    result.positionStrategy = this.overlay.position().global().centerVertically().centerHorizontally();
    result.hasBackdrop = true;
    if (config.backdropClass) {
      result.backdropClass = config.backdropClass;
    }

    return result;
  }

  /**
   * Create the configuration object for the image overlay.
   * The method validates the properties of the given config parameter.
   * @param config - Object containing all configuration parameters
   * @returns An object containing all configuration parameters for the image overlay
   */
  private currentConfig(config: MatImageOverlayConfig): MatImageOverlayConfig {
    const activeConfig = new MatImageOverlayConfig();
    if(config.images) {
      activeConfig.images = config.images;
    }

    if (config.urlForImage) {
      activeConfig.urlForImage = config.urlForImage;
    }

    if (config.baseUrl) {
      activeConfig.baseUrl = config.baseUrl;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!this.isNullOrUndefined(config.startImageIndex) && (config.startImageIndex! >= 0)) {
      activeConfig.startImageIndex = config.startImageIndex;
    }

    if (config.backdropClass) {
      activeConfig.backdropClass = config.backdropClass;
    }

    if (!this.isNullOrUndefined(config.overlayButtonsStyle)) {
      activeConfig.overlayButtonsStyle = config.overlayButtonsStyle;
    }

    return activeConfig;
  }

  /**
   * Check if value is null or undefined.
   * @param value - value under inspection
   * @returns true=value is null or undefined
   */
   private isNullOrUndefined(value: any): boolean { // eslint-disable-line @typescript-eslint/no-explicit-any
    return (value === undefined) || (value === null);
  }
}
