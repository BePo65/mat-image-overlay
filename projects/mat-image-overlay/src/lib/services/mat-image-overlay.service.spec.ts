import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
