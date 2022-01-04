import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlay } from './mat-image-overlay';

describe('MatImageOverlay', () => {
  let service: MatImageOverlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        OverlayModule
      ],
      providers: [
        MatImageOverlay
      ]
    });
    service = TestBed.inject(MatImageOverlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
