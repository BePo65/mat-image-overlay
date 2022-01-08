import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlayComponent } from './mat-image-overlay.component';
import { SimpleChildComponent } from '../test.assets/simple.child.component';
import { MatImageOverlay } from '../mat-image-overlay';
import { MatImageOverlayConfig } from '../mat-image-overlay-config';

describe('MatImageOverlayComponent', () => {
  let imageOverlay: MatImageOverlay;
  let overlayContainerElement: HTMLElement;

  const images = [
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
  ];

  // dummyContainerFixture is only a workaround to trigger change detection
  let dummyContainerFixture: ComponentFixture<SimpleChildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MatImageOverlayComponent,
        SimpleChildComponent
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        OverlayModule
      ],
      providers: [
        MatImageOverlay
      ]
    });
  });

  beforeEach(inject([MatImageOverlay, OverlayContainer],
    (d: MatImageOverlay, oc: OverlayContainer) => {
      imageOverlay = d;
      overlayContainerElement = oc.getContainerElement();
    }));

  beforeEach(() => {
    // create dummy window, used to trigger change detection
    dummyContainerFixture = TestBed.createComponent(SimpleChildComponent);
  });

  it('should be created', () => {
    expect(imageOverlay).toBeTruthy();
  });

  it('should open an overlay with images', () => {
    const config = {
      images: images
    } as MatImageOverlayConfig;
    const imageOverlayRef = imageOverlay.open(config);
    dummyContainerFixture.detectChanges();

    expect(imageOverlayRef._componentInstance instanceof MatImageOverlayComponent).toBe(true);
    expect(imageOverlay.imageOverlayExists()).toBe(true);

    const closeButton = overlayContainerElement.querySelector('.cdk-overlay-container .mat-image-overlay.mat-image-overlay-close mat-icon');
    if ((closeButton !== undefined) && (closeButton !== null)) {
      expect(closeButton.getAttribute('data-mat-icon-name')).toBe('close');
    } else {
      throw new Error('element \'.mat-image-overlay.mat-image-overlay-close mat-icon\' not found');
    }
  });
});
