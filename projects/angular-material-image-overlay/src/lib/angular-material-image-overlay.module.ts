import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialImageOverlayComponent } from './angular-material-image-overlay.component';

@NgModule({
  declarations: [
    AngularMaterialImageOverlayComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    AngularMaterialImageOverlayComponent
  ]
})
export class AngularMaterialImageOverlayModule { }
