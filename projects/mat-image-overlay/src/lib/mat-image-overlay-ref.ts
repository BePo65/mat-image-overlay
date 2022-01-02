import { OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ImageOverlayState, MatImageOverlayComponent } from './mat-image-overlay.component';

/** Possible states of the lifecycle of an image overlay. */
export const enum MatImageOverlayState {
  OPEN,
  CLOSED
}

/**
 * Reference to an image overlay opened via the MatImageOverlay service.
 */
export class MatImageOverlayRef {
  /** The instance of component opened into the dialog. */
  componentInstance: MatImageOverlayComponent | undefined;

  /** Whether the user is allowed to close the dialog. */
  disableClose: boolean | undefined = this._matImageOverlayInstance._config.disableClose;

  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<number | undefined>();

  //  Subject for notifying the user that new image has been selected
  private readonly _imageChanged = new BehaviorSubject<number | undefined>(undefined);

  /** Result to be passed to afterClosed. */
  private _result: number | undefined;

  /** Current state of the dialog. */
  private _state = MatImageOverlayState.OPEN;

  constructor(
    private _overlayRef: OverlayRef,
    public _matImageOverlayInstance: MatImageOverlayComponent
  ) {
    this.componentInstance = this._matImageOverlayInstance;

    // Emit when opening is complete
    _matImageOverlayInstance.stateChanged
      .pipe(
        filter(event => event.state === ImageOverlayState.opened),
        take(1),
      )
      .subscribe(() => {
        this._afterOpened.next();
        this._afterOpened.complete();
      });

    // Emit when closing is requested
    _matImageOverlayInstance.stateChanged
      .pipe(
        filter(event => event.state === ImageOverlayState.closingRequested),
        take(1),
      )
      .subscribe(event => {
        this.close(event?.data as number);
      });

    // Emit when overlay is closed and return index of last image
    _matImageOverlayInstance.stateChanged
    .pipe(
      filter(event => event.state === ImageOverlayState.closed),
      take(1),
      )
      .subscribe(() => {
        this._afterClosed.next(this._result);
        this._afterClosed.complete();
      });

    // Dispose overlay when closing is complete
    _overlayRef.detachments().subscribe(() => {
      this.componentInstance = undefined;
      this._overlayRef.dispose();
    });

    _overlayRef.backdropClick().subscribe(() => {
      this.close(this.componentInstance?.currentImageIndex);
    });

    // Emit when new image has been selected
    _matImageOverlayInstance.imageChanged.subscribe(event => {
      this._imageChanged.next(event.imageIndex);
    });

    /** As MatImageOverlayComponent emits start index before MatImageOverlayRef
     * is initialized, we have to emit this value here again.
     */
    this._imageChanged.next(this._matImageOverlayInstance.currentImageIndex);
  }

  /**
   * Close the image overlay.
   * @param dialogResult Optional result to return to the image overlay opener.
   */
  close(dialogResult?: number): void {
    this._result = dialogResult;
    this._state = MatImageOverlayState.CLOSED;
    this._overlayRef.dispose();
  }

  /**
   * Gets an observable that is notified when the image overlay is finished opening.
   */
  afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  /**
   * Gets an observable that is notified when a new image has been selected.
   */
   imageChanged(): Observable<number | undefined> {
    return this._imageChanged;
  }

  /**
   * Gets an observable that is notified when the image overlay is finished closing.
   */
  afterClosed(): Observable<number | undefined> {
    return this._afterClosed;
  }

  /**
   * Gets an observable that emits when keydown events are targeted on the overlay.
   */
  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  /**
   * Add a CSS class or an array of classes to the overlay pane.
  */
  addPanelClass(classes: string | string[]): this {
    this._overlayRef.addPanelClass(classes);
    return this;
  }

  /**
   * Remove a CSS class or an array of classes from the overlay pane.
  */
  removePanelClass(classes: string | string[]): this {
    this._overlayRef.removePanelClass(classes);
    return this;
  }

  /**
   * Gets the current state of the dialog's lifecycle.
  */
  getState(): MatImageOverlayState {
    return this._state;
  }
}
