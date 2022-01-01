import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { MatImageOverlayComponent, IMAGE_OVERLAY_CONFIG_TOKEN } from './mat-image-overlay.component';

const IMAGES = [
  'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
  'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
  'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
  'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
];

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
        {provide: IMAGE_OVERLAY_CONFIG_TOKEN, useValue: {images: IMAGES, startImageIndex: 0}}
      ]
    });
    fixture = TestBed.createComponent(MatImageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
