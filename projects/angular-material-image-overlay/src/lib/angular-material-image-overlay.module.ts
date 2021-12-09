import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { AngularMaterialImageOverlayComponent } from './angular-material-image-overlay.component';
import { CommonModule } from '@angular/common';

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
