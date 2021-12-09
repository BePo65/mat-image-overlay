import { TestBed } from '@angular/core/testing';

import { AngularMaterialImageOverlayService } from './angular-material-image-overlay.service';

describe('AngularMaterialImageOverlayService', () => {
  let service: AngularMaterialImageOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularMaterialImageOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
