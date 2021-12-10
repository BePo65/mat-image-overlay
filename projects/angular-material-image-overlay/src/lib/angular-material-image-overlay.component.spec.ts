import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { AngularMaterialImageOverlayComponent, IMAGE_OVERLAY_DATA_TOKEN } from './angular-material-image-overlay.component';
import { AngularMaterialImageOverlayComponentMockData } from './angular-material-image-overlay.mockup-data';

describe('AngularMaterialImageOverlayService', () => {
  let component: AngularMaterialImageOverlayComponent;
  let fixture: ComponentFixture<AngularMaterialImageOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AngularMaterialImageOverlayComponent
      ],
      imports: [
        CommonModule,
        OverlayModule
      ],
      providers: [
        {provide: IMAGE_OVERLAY_DATA_TOKEN, useValue: AngularMaterialImageOverlayComponentMockData}
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AngularMaterialImageOverlayComponent]
      }
    });
    fixture = TestBed.createComponent(AngularMaterialImageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
