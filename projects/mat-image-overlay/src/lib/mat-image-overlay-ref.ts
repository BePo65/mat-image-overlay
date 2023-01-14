import { OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ImageClickedEvent, ImageOverlayState, MatImageOverlayComponent } from './component/mat-image-overlay.component';

/** Possible states of the lifecycle of an image overlay. */
export const enum MatImageOverlayState {
  OPEN,
  CLOSED
}

/**
 * Properties of the event that triggers, when a new image gets clicked.
 *
 * imageData: entry from the 'images' array for the current image
 * configuration: object containing configuration data as defined in config.imageClickedConfiguration
 */
export  { ImageClickedEvent } from './component/mat-image-overlay.component';

/**
 * Reference to an image overlay opened via the MatImageOverlay service.
 */
export class MatImageOverlayRef {
  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<number | undefined>();

  //  Subject for notifying the user that new image has been selected
  private readonly _imageChanged = new BehaviorSubject<number | undefined>(undefined);

  //  Subject for notifying the user that an image has been clicked
  private readonly _imageClicked = new Subject<ImageClickedEvent>();

  /** Index of last image shown to be passed to afterClosed. */
  private _lastImageIndex: number | undefined;

  constructor(
    private _overlayRef: OverlayRef,
    public _componentInstance: MatImageOverlayComponent
  ) {
    // Emit when opening is complete
    _componentInstance.stateChanged
      .pipe(
        filter(event => event.state === ImageOverlayState.opened),
        take(1)
      )
      .subscribe(() => {
        this._afterOpened.next();
        this._afterOpened.complete();
      });

    // Emit when closing is requested
    _componentInstance.stateChanged
      .pipe(
        filter(event => event.state === ImageOverlayState.closingRequested),
        take(1)
      )
      .subscribe(event => {
        this.close(event?.data as number);
      });

    // Emit when overlay is closed and return index of last image
    _componentInstance.stateChanged
      .pipe(
        filter(event => event.state === ImageOverlayState.closed),
        take(1)
      )
      .subscribe(() => {
        this._afterClosed.next(this._lastImageIndex);
        this._afterClosed.complete();
      });

    // Dispose overlay when closing is complete
    _overlayRef.detachments().subscribe(() => {
      this._overlayRef.dispose();
    });

    _overlayRef.backdropClick().subscribe(() => {
      this.close(this._componentInstance?.currentImageIndex);
    });

    // Emit when new image has been selected
    _componentInstance.imageChanged.subscribe(event => {
      this._imageChanged.next(event.imageIndex);
    });

    /**
     * As MatImageOverlayComponent emits the start index before MatImageOverlayRef
     * is initialized, we have to emit this value here again.
     */
    this._imageChanged.next(_componentInstance.currentImageIndex);

    // Emit when an image has been clicked
    _componentInstance.imageClicked.subscribe(event => {
      this._imageClicked.next(event);
    });
  }

  /**
   * Close the image overlay.
   *
   * @param lastImageIndex Optional result to return to the image overlay opener.
   */
  public close(lastImageIndex?: number): void {
    this._lastImageIndex = lastImageIndex;
    this._overlayRef.dispose();
  }

  /**
   * Gets an observable that is notified when the image overlay is finished opening.
   *
   * @returns observable that fires when image overlay is open
   */
  public afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  /**
   * Gets an observable that is notified when the image overlay is finished closing.
   * Observable returns the index of the last image displayed.
   *
   * @returns observable that sends the index of the last image displayed when image overlay is closed
   */
   public afterClosed(): Observable<number | undefined> {
    return this._afterClosed;
  }

  /**
   * Gets an observable that is notified when a new image has been selected.
   *
   * @returns observable that sends the index of the selected image
   */
  public imageChanged(): Observable<number | undefined> {
    return this._imageChanged;
  }

  /**
   * Gets an observable that is notified when an image has been clicked.
   *
   * @returns observable that sends the object of the selected image and the
   * .        imageClickedConfiguration object from the config
   */
  public imageClicked(): Observable<ImageClickedEvent> {
    return this._imageClicked;
  }

  /**
   * Gets an observable that is notified when keydown events are targeted on the overlay.
   *
   * @returns observable that sends Key down events targeted on the overlay
   */
  public keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  public gotoNextImage(): void {
      this._componentInstance?.gotoNextImage();
  }

  public gotoPreviousImage(): void {
    this._componentInstance?.gotoPreviousImage();
  }

  public gotoFirstImage(): void {
    this._componentInstance?.gotoFirstImage();
  }

  public gotoLastImage(): void {
    this._componentInstance?.gotoLastImage();
  }

  public gotoImage(imageIndex: number): void {
    this._componentInstance?.gotoImage(imageIndex);
  }

}
