import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlayComponent } from './component/mat-image-overlay.component';
import { MatImageOverlay } from './mat-image-overlay';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    OverlayModule,
    MatImageOverlayComponent
  ],
  providers: [
    MatImageOverlay
  ]
})
export class MatImageOverlayModule { }
