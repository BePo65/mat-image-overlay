import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ElementDisplayStyle, MatImageOverlay, MatImageOverlayConfig, MatImageOverlayModule } from 'mat-image-overlay';
import { MatImageOverlayHarness } from './mat-image-overlay-harness';

describe('MatImageOverlayHarness', () => {
  let fixture: ComponentFixture<MatImageOverlayHarnessTestComponent>;
  let loader: HarnessLoader;

  const stringImages = [
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MatImageOverlayHarnessTestComponent
      ],
      imports: [
        MatImageOverlayModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatImageOverlayHarnessTestComponent);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should load harness for image overlay with empty image list', async () => {
    const config: MatImageOverlayConfig = {
      images: [] as string[]
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(1);
  });

  it('should load harness for image overlay with filled image list', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(1);
  });

  it('should throw on opening 2nd image overlay', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;

    expect(() => fixture.componentInstance.open(config)).not.toThrow();
    let overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(1);

    // Try to open second image overlay instance
    expect(() => fixture.componentInstance.open(config)).toThrow();
    overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(1);
  });

  it('should not display close button on overlayButtonsStyle="never"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.never
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(false);
  });

  it('should display close button on overlayButtonsStyle="always"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
  });

  it('should display 3 buttons on 2nd image with overlayButtonsStyle="hover"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.onHover,
      startImageIndex: 1
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(false);

    // Hover the img tag
    await overlay.figureHover();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(true);
  });

  it('should display buttons switching images with overlayButtonsStyle="onHover"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.onHover
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(false);

    // Hover the img tag
    await overlay.figureHover();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(true);

    // Switch to next image
    await overlay.clickNextButton();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(true);
  });

  it('should be able to close image overlay from harness', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await overlay.close();
    const overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(0);
  });

  it('should be able to close image overlay clicking close button', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await overlay.clickCloseButton();
    const overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(0);
  });

  it('should display 2 buttons on opening overlay with 1st image', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(true);
  });

  it('should display 3 buttons on switching overlay to 2nd image', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always,
      startImageIndex: 0
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);

    // Open overlay on first image
    expect(overlay).not.toBeUndefined();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(false);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(true);

    // Goto second image
    await overlay.clickNextButton();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(true);
  });

  it('should display 2 buttons on opening overlay with last image', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always,
      startImageIndex: stringImages.length - 1
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();
    await expectAsync(overlay.buttonCloseVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonPreviousVisible()).toBeResolvedTo(true);
    await expectAsync(overlay.buttonNextVisible()).toBeResolvedTo(false);
  });

  it('should not display description on descriptionDisplayStyle="never"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      descriptionDisplayStyle: ElementDisplayStyle.never
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(false);
  });

  it('should display description on descriptionDisplayStyle="always"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(true);
  });

  it('should display description on descriptionDisplayStyle="onHover"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      descriptionDisplayStyle: ElementDisplayStyle.onHover
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(false);

    // Hover the img tag
    await overlay.figureHover();
    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(true);
  });

  @Component({
    template: '<h1>Test page for mat-image-overlay</h1>'
  })
  class MatImageOverlayHarnessTestComponent {
    constructor(readonly imageOverlay: MatImageOverlay) {}

    open(config: MatImageOverlayConfig) {
      return this.imageOverlay.open(config);
    }
  }
});
