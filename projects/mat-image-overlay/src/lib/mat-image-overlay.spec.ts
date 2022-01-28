import { Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlay } from './mat-image-overlay';
import { MatImageOverlayModule } from './mat-image-overlay.module';
import { ElementDisplayStyle, MatImageOverlayConfig } from './interfaces/mat-image-overlay-config';
import { MatImageOverlayHarness } from '../testing/mat-image-overlay-harness';

describe('MatImageOverlay with Harness', () => {
  const stringImages = [
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
  ];

  const objectImages = [
    { id: '1000', width: Math.round(1000 / 3635 * 5626), height: 1000, description: 'picture 1' },
    { id: '1014', width: 1000, height: 1000, description: 'picture 2' },
    { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000, description: 'picture 3' },
    { id: '1015', width: Math.round(1000 / 4000 * 6000), height: 1000, description: 'picture 4' }
  ];

  let fixture: ComponentFixture<MatImageOverlayTestComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        MatImageOverlayTestComponent
      ],
      imports: [
        NoopAnimationsModule,
        MatImageOverlayModule
      ]
    });

    fixture = TestBed.createComponent(MatImageOverlayTestComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should load image overlay', async () => {
    const config: MatImageOverlayConfig = {
      images: objectImages,
      urlForImage: (imageData: unknown, baseUrl?: string) => {
        const image = imageData as object;
        return `${baseUrl}${image['id' as keyof object]}/${image['width' as keyof object]}/${image['height' as keyof object]}`;
      },
      baseUrl: 'https://picsum.photos/id/',
      descriptionForImage: (imageData: unknown) => {
        return (imageData as object)['description' as keyof object];
      },
      descriptionDisplayStyle: ElementDisplayStyle.onHover
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);

    expect(overlay).not.toBeUndefined();
  });

  it('should load image overlay with empty image list', async () => {
    const config: MatImageOverlayConfig = {
      images: [] as string[]
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);

    expect(overlay).not.toBeUndefined();
  });

  it('should throw on opening 2nd image overlay instance', async () => {
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
    expect(overlay).not.toBeUndefined();

    // Open overlay on first image
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
      images: objectImages,
      urlForImage: (imageData: unknown, baseUrl?: string) => {
        const image = imageData as object;
        return `${baseUrl}${image['id' as keyof object]}/${image['width' as keyof object]}/${image['height' as keyof object]}`;
      },
      baseUrl: 'https://picsum.photos/id/',
      descriptionForImage: (imageData: unknown) => {
        return (imageData as object)['description' as keyof object];
      },
      descriptionDisplayStyle: ElementDisplayStyle.never
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(false);
  });

  it('should display description on descriptionDisplayStyle="always"', async () => {
    const config: MatImageOverlayConfig = {
      images: objectImages,
      urlForImage: (imageData: unknown, baseUrl?: string) => {
        const image = imageData as object;
        return `${baseUrl}${image['id' as keyof object]}/${image['width' as keyof object]}/${image['height' as keyof object]}`;
      },
      baseUrl: 'https://picsum.photos/id/',
      descriptionForImage: (imageData: unknown) => {
        return (imageData as object)['description' as keyof object];
      },
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(true);
  });

  it('should display description on descriptionDisplayStyle="onHover"', async () => {
    const config: MatImageOverlayConfig = {
      images: objectImages,
      urlForImage: (imageData: unknown, baseUrl?: string) => {
        const image = imageData as object;
        return `${baseUrl}${image['id' as keyof object]}/${image['width' as keyof object]}/${image['height' as keyof object]}`;
      },
      baseUrl: 'https://picsum.photos/id/',
      descriptionForImage: (imageData: unknown) => {
        return (imageData as object)['description' as keyof object];
      },
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

  it('should hide description when empty string', async () => {
    const config: MatImageOverlayConfig = {
      images: [
        { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000, description: '' }
      ],
      urlForImage: (imageData: unknown, baseUrl?: string) => {
        const image = imageData as object;
        return `${baseUrl}${image['id' as keyof object]}/${image['width' as keyof object]}/${image['height' as keyof object]}`;
      },
      baseUrl: 'https://picsum.photos/id/',
      descriptionForImage: (imageData: unknown) => {
        return (imageData as object)['description' as keyof object];
      },
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(false);
  });

  it('should hide description when undefined', async () => {
    const config: MatImageOverlayConfig = {
      images: [
        { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000 }
      ],
      urlForImage: (imageData: unknown, baseUrl?: string) => {
        const image = imageData as object;
        return `${baseUrl}${image['id' as keyof object]}/${image['width' as keyof object]}/${image['height' as keyof object]}`;
      },
      baseUrl: 'https://picsum.photos/id/',
      descriptionForImage: (imageData: unknown) => {
        return (imageData as object)['description' as keyof object];
      },
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlay = await loader.getHarness(MatImageOverlayHarness);
    expect(overlay).not.toBeUndefined();

    await expectAsync(overlay.descptionVisible()).toBeResolvedTo(false);
  });

  it('should navigate with buttons', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    // Start with 1st image
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto next image
    await overlayHarness.sendKeys(TestKey.RIGHT_ARROW);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);

    // Goto last image
    await overlayHarness.sendKeys(TestKey.END);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[3]);

    // Goto previous image
    await overlayHarness.sendKeys(TestKey.LEFT_ARROW);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[2]);

    // Goto first image
    await overlayHarness.sendKeys(TestKey.HOME);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto next image with button down
    await overlayHarness.sendKeys(TestKey.DOWN_ARROW);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);

    // Goto previous image with button up
    await overlayHarness.sendKeys(TestKey.UP_ARROW);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // close overlay
    await overlayHarness.sendKeys(TestKey.ESCAPE);
    const overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(0);
  });

  it('should navigate with overlay-ref', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;
    const overlay = fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    // Start with 1st image
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto next image
    await overlay.gotoNextImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);

    // Goto last image
    await overlay.gotoLastImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[3]);

    // Goto previous image
    await overlay.gotoPreviousImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[2]);

    // Goto first image
    await overlay.gotoFirstImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // close overlay
    await overlay.close();
    const overlays = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlays.length).toBe(0);
  });
});

@Component({
  template: '<h1>app page as host for mat-image-overlay tests</h1>'
})
class MatImageOverlayTestComponent {
  constructor(readonly imageOverlay: MatImageOverlay) {}

  open(config: MatImageOverlayConfig) {
    return this.imageOverlay.open(config);
  }
}
