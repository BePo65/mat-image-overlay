import { Component, Inject, InjectionToken, HostListener, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { MatImageOverlayConfig } from './mat-image-overlay-config';
import { CLOSE_ICON, ARROW_FORWARD_ICON, ARROW_BACKWARD_ICON } from './mat-image-overlay.svg';

/** Event that captures the state of the component. */
interface ImageOverlayStateEvent {
  state: 'opened' | 'closed';
}

export const IMAGE_OVERLAY_CONFIG_TOKEN = new InjectionToken<MatImageOverlayConfig>('IMAGE_OVERLAY_CONFIG');

@Component({
  templateUrl: './mat-image-overlay.component.html',
  styleUrls: ['./mat-image-overlay.component.scss']
})
export class MatImageOverlayComponent implements AfterViewInit, OnDestroy {
  // TODO die Eigenschaften müssen "readonly" werden!
  public currentImageUrl: string;
  public firstImage = false;
  public lastImage = false;

  public _stateChanged = new EventEmitter<ImageOverlayStateEvent>();
  public onClose = new Subject<void>();

  private currentImageIndex = 0;
  private images: string[];

  constructor(
    @Inject(IMAGE_OVERLAY_CONFIG_TOKEN) public _config: MatImageOverlayConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.images = _config.images ?? [];
    this.currentImageIndex = _config.startImageIndex ?? 0;
    this.currentImageUrl = this.images[this.currentImageIndex];
    this.updateImageState();

    // Get material icons as svg icons
    this.matIconRegistry.addSvgIconLiteral('close', this.domSanitizer.bypassSecurityTrustHtml(CLOSE_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_back_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_BACKWARD_ICON));
    this.matIconRegistry.addSvgIconLiteral('arrow_forward_ios', this.domSanitizer.bypassSecurityTrustHtml(ARROW_FORWARD_ICON));
  }

  ngAfterViewInit(): void {
    this._stateChanged.emit({ state: 'opened' });
  }

  ngOnDestroy(): void {
    this._stateChanged.emit({ state: 'closed' });
  }

  public closeOverlay(): void {
    this.onClose.next();
  }

  public gotoNextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImageUrl = this.images[this.currentImageIndex];
    }
    this.updateImageState();
  }

  public gotoPreviousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImageUrl = this.images[this.currentImageIndex];
    }
    this.updateImageState();
  }

  public gotoFirstImage(): void {
    this.currentImageIndex = 0;
    this.currentImageUrl = this.images[this.currentImageIndex];
    this.updateImageState();
  }

  public gotoLastImage(): void {
    this.currentImageIndex = this.images.length - 1;
    this.currentImageUrl = this.images[this.currentImageIndex];
    this.updateImageState();
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case('ArrowRight'):
      case('ArrowDown'):
        this.gotoNextImage();
        break;
      case('ArrowLeft'):
      case('ArrowUp'):
        this.gotoPreviousImage();
        break;
      case('Home'):
        this.gotoFirstImage();
        break;
      case('End'):
        this.gotoLastImage();
        break;
      case('Escape'):
        this.closeOverlay();
    }
  }

  /**
   * Update state of flags that show, if current image is first or last
   * in list of images.
   */
  private updateImageState() {
    this.firstImage = (this.currentImageIndex <= 0);
    this.lastImage = (this.currentImageIndex >= (this.images.length - 1));
  }
}
