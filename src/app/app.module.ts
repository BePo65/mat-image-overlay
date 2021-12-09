import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularMaterialImageOverlayModule } from 'angular-material-image-overlay';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialImageOverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
