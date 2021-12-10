import { OverlayModule } from '@angular/cdk/overlay';
import { inject, TestBed } from '@angular/core/testing';

import { AngularMaterialImageOverlayService } from './angular-material-image-overlay.service';

describe('AngularMaterialImageOverlayService', () => {
  let service: AngularMaterialImageOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule
      ],
      providers: [
        AngularMaterialImageOverlayService
      ]
    });
  });

  beforeEach(inject([AngularMaterialImageOverlayService], (s: AngularMaterialImageOverlayService) => {
    service = s;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
