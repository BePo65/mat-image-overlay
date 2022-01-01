import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { MatImageOverlayComponent } from './mat-image-overlay.component';

/** Possible states of the lifecycle of an image overlay. */
export const enum MatImageOverlayState {
  OPEN,
  CLOSING,
  CLOSED,
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
  private readonly _afterClosed = new Subject<number>();

  /** Subject for notifying the user that the dialog has started closing. */
  private readonly _beforeClosed = new Subject<number>();

  /** Result to be passed to afterClosed. */
  private _result: number | undefined;

  /** Current state of the dialog. */
  private _state = MatImageOverlayState.OPEN;

  constructor(
    private _overlayRef: OverlayRef,
    public _matImageOverlayInstance: MatImageOverlayComponent
  ) {
    this.componentInstance = this._matImageOverlayInstance;

    // Emit when opening animation completes
    _matImageOverlayInstance._stateChanged
      .pipe(
        filter(event => event.state === 'opened'),
        take(1),
      )
      .subscribe(() => {
        this._afterOpened.next();
        this._afterOpened.complete();
      });

    // Dispose overlay when closing animation is complete
    _matImageOverlayInstance._stateChanged
      .pipe(
        filter(event => event.state === 'closed'),
        take(1),
      )
      .subscribe(() => {
        this._finishDialogClose();
      });

    _overlayRef.detachments().subscribe(() => {
      this._beforeClosed.next(this._result);
      this._beforeClosed.complete();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = undefined;
      this._overlayRef.dispose();
    });
  }

  // TODO Close the dialog
  /**
   * Close the dialog.
   * @param dialogResult Optional result to return to the dialog opener.
   */
  close(dialogResult?: number): void {
    this._result = dialogResult;
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClosed(): Observable<number | undefined> {
    return this._afterClosed;
  }

  /**
   * Gets an observable that is notified when the dialog has started closing.
   */
  beforeClosed(): Observable<number | undefined> {
    return this._beforeClosed;
  }

  /**
   * Gets an observable that emits when the overlay's backdrop has been clicked.
   */
  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
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

  /**
   * Finishes the dialog close by updating the state of the dialog
   * and disposing the overlay.
   */
  private _finishDialogClose() {
    this._state = MatImageOverlayState.CLOSED;
    this._overlayRef.dispose();
  }
}
