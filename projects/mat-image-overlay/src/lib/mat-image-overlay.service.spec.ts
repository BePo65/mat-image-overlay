import { OverlayModule } from '@angular/cdk/overlay';
import { inject, TestBed } from '@angular/core/testing';

import { MatImageOverlayService } from './mat-image-overlay.service';

describe('MatImageOverlayService', () => {
  let service: MatImageOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule
      ],
      providers: [
        MatImageOverlayService
      ]
    });
  });

  beforeEach(inject([MatImageOverlayService], (s: MatImageOverlayService) => {
    service = s;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
