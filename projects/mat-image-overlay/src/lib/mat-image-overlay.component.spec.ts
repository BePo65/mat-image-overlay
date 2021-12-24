import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { MatImageOverlayComponent, IMAGE_OVERLAY_DATA_TOKEN } from './mat-image-overlay.component';
import { MatImageOverlayComponentMockData } from './mat-image-overlay.mockup-data';

describe('MatImageOverlayService', () => {
  let component: MatImageOverlayComponent;
  let fixture: ComponentFixture<MatImageOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MatImageOverlayComponent
      ],
      imports: [
        MatIconModule,
        OverlayModule
      ],
      providers: [
        {provide: IMAGE_OVERLAY_DATA_TOKEN, useValue: MatImageOverlayComponentMockData}
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MatImageOverlayComponent]
      }
    });
    fixture = TestBed.createComponent(MatImageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
