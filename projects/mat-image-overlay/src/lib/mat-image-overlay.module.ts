import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

import { MatImageOverlayComponent } from './mat-image-overlay.component';

@NgModule({
  declarations: [
    MatImageOverlayComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    OverlayModule,
    MatIconModule
  ],
  exports: [
    MatImageOverlayComponent
  ]
})
export class MatImageOverlayModule { }
