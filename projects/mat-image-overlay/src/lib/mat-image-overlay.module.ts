import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MatImageOverlayComponent } from './mat-image-overlay.component';

@NgModule({
  declarations: [
    MatImageOverlayComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    MatIconModule
  ],
  exports: [
    MatImageOverlayComponent
  ]
})
export class MatImageOverlayModule { }
