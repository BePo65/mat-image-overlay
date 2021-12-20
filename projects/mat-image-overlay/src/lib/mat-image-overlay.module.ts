import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatImageOverlayComponent } from './mat-image-overlay.component';

@NgModule({
  declarations: [
    MatImageOverlayComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    MatImageOverlayComponent
  ]
})
export class MatImageOverlayModule { }
