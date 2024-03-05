import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NumericEnumToArrayPipe, StringEnumToArrayPipe } from './shared/enum-to-array.pipe';

import { MatImageOverlayModule } from 'mat-image-overlay';
import { MatImageOverlayHarness } from 'mat-image-overlay/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatImageOverlayModule,
        MatFormFieldModule,
        MatSelectModule,
        NumericEnumToArrayPipe,
        StringEnumToArrayPipe,
        AppComponent
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

    expect(dom.querySelector('.actions')?.textContent).toContain('Click on one of the images above to open overlay or here to ');
  });

  it('should load image overlay', async () => {
    fixture.componentInstance.openOverlayDemo1Image();
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is loaded').toBeResolvedTo(true);
  });
});
