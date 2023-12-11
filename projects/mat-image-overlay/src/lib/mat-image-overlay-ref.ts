import { OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { ImageOverlayState, MatImageOverlayComponent } from './component/mat-image-overlay.component';

/** Possible states of the lifecycle of an image overlay. */
export const enum MatImageOverlayState {
  OPEN,
  CLOSED
}

/**
 * Reference to an image overlay opened via the MatImageOverlay service.
 */
export class MatImageOverlayRef {
  public keydownEvents$: Observable<KeyboardEvent>;
  private readonly keydownEvents = new Subject<KeyboardEvent>();

  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<number | undefined>();

  //  Subject for notifying the user that new image has been selected
  private readonly _imageChanged = new BehaviorSubject<number | undefined>(undefined);

  //  Subject for notifying the user that an image has been clicked
  private readonly _imageClicked = new Subject<Record<string, unknown>>();

  /** Index of last image shown to be passed to afterClosed. */
  private _lastImageIndex: number | undefined;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private _overlayRef: OverlayRef,
    protected _componentInstance: MatImageOverlayComponent
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
        this.internalClose(event?.data as number);
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
    _overlayRef.detachments()
      .pipe(
        take(1)
      )
      .subscribe(() => {
        this._overlayRef.dispose();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      });

    _overlayRef.backdropClick().subscribe(() => {
      this.internalClose(this._componentInstance?.currentImageIndex);
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
    _componentInstance.imageClicked
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(event => {
        this._imageClicked.next(event);
      });

    // Emit keydown events (except for the navigation buttons)
    this.keydownEvents$ = this.keydownEvents.asObservable();
    _componentInstance.keyDown
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((event) => {
        this.keydownEvents.next(event);
      });
  }

  public get numberOfImages(): number {
    return this._componentInstance?.numberOfImages || 0;
  }

  /**
   * Gets an observable that is notified when the image overlay is finished opening.
   * @returns observable that fires when image overlay is open
   */
  public afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  /**
   * Gets an observable that is notified when the image overlay is finished closing.
   * Observable returns the index of the last image displayed.
   * @returns observable that sends the index of the last image displayed when image overlay is closed
   */
  public afterClosed(): Observable<number | undefined> {
    return this._afterClosed;
  }

  /**
   * Gets an observable that is notified when a new image has been selected.
   * @returns observable that sends the index of the selected image
   */
  public imageChanged(): Observable<number | undefined> {
    return this._imageChanged;
  }

  /**
   * Gets an observable that is notified when an image has been clicked.
   * @returns observable that sends the information about the clicked image
   */
  public imageClicked(): Observable<Record<string, unknown>> {
    return this._imageClicked;
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

  /**
   * Go to image with the given image (0-based).
   * @param imageIndex - index of the image to go to (0-based)
   */
  public gotoImage(imageIndex: number): void {
    this._componentInstance?.gotoImage(imageIndex);
  }

  /**
   * Close the image overlay and return the index of the last image
   * displayed via the afterClosed observable.
   */
  public close(): void {
    this.internalClose(this._componentInstance?.currentImageIndex);
  }

  /**
   * Close the image overlay.
   * Emit the optionally given index of an image via the afterClosed observable.
   * @param lastImageIndex Optional: index of the last image displayed in the overlay.
   */
  private internalClose(lastImageIndex?: number): void {
    this._lastImageIndex = lastImageIndex;
    this._overlayRef.dispose();
  }
}
