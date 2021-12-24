import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlayComponent } from './mat-image-overlay.component';
import { MatImageOverlayService } from './services/mat-image-overlay.service';

@NgModule({
  declarations: [
    MatImageOverlayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    OverlayModule
  ],
  providers: [
    MatImageOverlayService
  ],
  exports: [
    MatImageOverlayComponent
  ]
})
export class MatImageOverlayModule { }
