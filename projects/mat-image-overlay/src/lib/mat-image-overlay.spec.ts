import { Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlay } from './mat-image-overlay';
import { MatImageOverlayModule } from './mat-image-overlay.module';
import { ElementDisplayStyle, MatImageOverlayConfig } from './interfaces/mat-image-overlay-config';
import { MatImageOverlayHarness } from '../../testing/src/mat-image-overlay-harness';

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
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is loaded').toBeResolvedTo(true);
  });

  it('should load image overlay with option baseUrl', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      baseUrl: 'https://picsum.photos/id/'
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
  });

  it('should load image overlay without option "urlForImage"', async () => {
    const config: MatImageOverlayConfig = {
      images: objectImages
    } as MatImageOverlayConfig;

    expect(() => fixture.componentInstance.open(config)).toThrow();
  });

  it('should load image overlay with empty image list', async () => {
    const config: MatImageOverlayConfig = {
      images: [] as string[]
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
  });

  it('should throw on opening 2nd image overlay instance', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;

    expect(() => fixture.componentInstance.open(config)).not.toThrow();
    const overlayHarnesses = await loader.getAllHarnesses(MatImageOverlayHarness);
    expect(overlayHarnesses.length).withContext('Number of visible image overlays').toBe(1);

    // Try to open second image overlay instance
    expect(() => fixture.componentInstance.open(config)).toThrow();
  });

  it('should not display buttons on overlayButtonsStyle="never"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.never
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is not visible').toBeResolvedTo(false);
  });

  it('should display buttons on overlayButtonsStyle="always"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);
  });

  it('should display 3 buttons on 2nd image with overlayButtonsStyle="hover"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.onHover,
      startImageIndex: 1
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is not visible').toBeResolvedTo(false);

    // Hover the img tag
    await overlayHarness.figureHover();
    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);
  });

  it('should display buttons switching images with overlayButtonsStyle="onHover"', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.onHover
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is not visible').toBeResolvedTo(false);

    // Hover the img tag
    await overlayHarness.figureHover();
    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);

    // Switch to next image
    await overlayHarness.clickNextButton();
    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);
  });

  it('should close image overlay from harness', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await overlayHarness.close();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should close image overlay by clicking the close button', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await overlayHarness.clickCloseButton();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should close image overlay by clicking the backdrop', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await overlayHarness.clickBackdrop();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should display 2 buttons on opening overlay with 1st image', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);
  });

  it('should display 3 buttons on switching overlay to 2nd image', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always,
      startImageIndex: 0
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    // Open overlay on first image
    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is not visible').toBeResolvedTo(false);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);

    // Goto second image
    await overlayHarness.clickNextButton();
    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is visible').toBeResolvedTo(true);
  });

  it('should display 2 buttons on opening overlay with last image', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages,
      overlayButtonsStyle: ElementDisplayStyle.always,
      startImageIndex: stringImages.length - 1
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.buttonCloseVisible()).withContext('"Close" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonPreviousVisible()).withContext('"Preview" button is visible').toBeResolvedTo(true);
    await expectAsync(overlayHarness.buttonNextVisible()).withContext('"Next" button is not visible').toBeResolvedTo(false);
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
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.descptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);
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
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.descptionVisible()).withContext('Image "description" is visible').toBeResolvedTo(true);
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
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.descptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);

    // Hover the img tag
    await overlayHarness.figureHover();
    await expectAsync(overlayHarness.descptionVisible()).withContext('Image "description" is visible').toBeResolvedTo(true);
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
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.descptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);
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
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    await expectAsync(overlayHarness.descptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);
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
    await overlayHarness.clickNextButton();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);

    // Goto previous image
    await overlayHarness.clickNextButton();
    await overlayHarness.clickNextButton();
    await overlayHarness.clickPreviousButton();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[2]);
  });

  it('should navigate with keys', async () => {
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
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
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

    // Goto 3rd image
    await overlay.gotoImage(2);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[2]);

    // close overlay
    await overlay.close();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should send keys', async () => {
    const config: MatImageOverlayConfig = {
      images: stringImages
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    // Start with 1st image
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto next image
    await overlayHarness.sendKeysWithModifiers(undefined, TestKey.RIGHT_ARROW);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);

    // Send Shift+LEFT_ARROW (results in no action)
    await overlayHarness.sendKeysWithModifiers({shift: true}, TestKey.LEFT_ARROW);
    await expectAsync(overlayHarness.sendKeysWithModifiers({shift: true}, TestKey.LEFT_ARROW)).toBeResolved();
  });

  it('should set backdrop class', async () => {
    const sampleCssClass = 'sample-class';
    const config: MatImageOverlayConfig = {
      images: stringImages,
      backdropClass: sampleCssClass
    } as MatImageOverlayConfig;
    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    expect(overlayHarness).not.toBeUndefined();

    const result = await overlayHarness.hasBackdropClass(sampleCssClass);
    expect(result).toBeTruthy();
    await expectAsync(overlayHarness.hasBackdropClass(sampleCssClass)).withContext('Image overlay backdrop has class set').toBeResolvedTo(true);
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
