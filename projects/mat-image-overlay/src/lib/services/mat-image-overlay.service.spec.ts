import { OverlayModule } from '@angular/cdk/overlay';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlayService } from './mat-image-overlay.service';

describe('MatImageOverlayService', () => {
  let service: MatImageOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        OverlayModule
      ],
      providers: [
        MatImageOverlayService
      ]
    });
    service = TestBed.inject(MatImageOverlayService);
  });

  // HACK Original
  // beforeEach(inject([MatImageOverlayService], (s: MatImageOverlayService) => {
  //   service = s;
  // }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
