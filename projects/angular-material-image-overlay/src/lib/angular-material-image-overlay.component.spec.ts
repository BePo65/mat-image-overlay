import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMaterialImageOverlayComponent } from './angular-material-image-overlay.component';

describe('AngularMaterialImageOverlayComponent', () => {
  let component: AngularMaterialImageOverlayComponent;
  let fixture: ComponentFixture<AngularMaterialImageOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularMaterialImageOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularMaterialImageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
