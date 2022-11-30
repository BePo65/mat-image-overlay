import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatImageOverlayModule } from 'mat-image-overlay';
import { MatImageOverlayHarness } from 'mat-image-overlay/testing';

import { AppComponent } from './app.component';
import { EnumToArrayPipe } from './shared/enum-to-array.pipe';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        EnumToArrayPipe
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatImageOverlayModule,
        MatFormFieldModule,
        MatSelectModule
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;

    expect(app).not.toBeUndefined();
  });

  it('should render title', () => {
    const dom = fixture.nativeElement as HTMLElement;

    expect(dom.querySelector('.actions')?.textContent?.substring(0, 33)).toContain('Click on one of the images above');
  });

  it('should load image overlay', async () => {
    fixture.componentInstance.openImageOverlay();
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is loaded').toBeResolvedTo(true);
  });
});
