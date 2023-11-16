import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatImageOverlayHarness } from '../../testing/src/mat-image-overlay-harness';

import { MatImageDetailsProvider } from './interfaces/mat-image-details-provider.class';
import { ElementDisplayStyle, MatImageOverlayConfig } from './interfaces/mat-image-overlay-config.interface';
import { MatImageOverlay } from './mat-image-overlay';
import { MatImageOverlayModule } from './mat-image-overlay.module';

describe('MatImageOverlay with Harness and string array source', () => {
  const stringImages = [
    'https://picsum.photos/id/30/1024/768',
    'https://picsum.photos/id/201/800/600',
    'https://picsum.photos/id/63/1800/1600',
    'https://picsum.photos/id/525/1440/900'
  ];

  let fixture: ComponentFixture<MatImageOverlayTestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
      descriptionDisplayStyle: ElementDisplayStyle.onHover
    } as MatImageOverlayConfig;

    const imageOverlayRef = fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    expect(imageOverlayRef.numberOfImages).toBe(4);
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is loaded').toBeResolvedTo(true);
  });

  it('should load image overlay without option "ImageDetails"', async () => {
    const config: MatImageOverlayConfig = {
    } as MatImageOverlayConfig;

    const imageOverlayRef = fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    expect(imageOverlayRef.numberOfImages).toBe(0);
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is loaded').toBeResolvedTo(true);
  });

  it('should load image overlay with empty image list', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider([])
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
  });

  it('should throw on opening 2nd image overlay instance', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
    } as MatImageOverlayConfig;

    expect(() => fixture.componentInstance.open(config)).not.toThrow();
    const overlayHarnesses = await loader.getAllHarnesses(MatImageOverlayHarness);

    expect(overlayHarnesses.length).withContext('Number of visible image overlays').toBe(1);

    // Try to open second image overlay instance
    expect(() => fixture.componentInstance.open(config)).toThrow();
  });

  it('should not display buttons on overlayButtonsStyle="never"', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await overlayHarness.close();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should close image overlay by clicking the close button', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await overlayHarness.clickBackdrop();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should display 2 buttons on opening overlay with 1st image', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
      descriptionDisplayStyle: ElementDisplayStyle.never
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.descriptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);
  });

  it('should display description on descriptionDisplayStyle="always"', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.descriptionVisible()).withContext('Image "description" is visible').toBeResolvedTo(true);
  });

  it('should navigate with buttons', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
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
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
    } as MatImageOverlayConfig;

    const overlay = fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();

    // Start with 1st image
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto next image
    overlay.gotoNextImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);

    // Goto last image
    overlay.gotoLastImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[3]);

    // Goto previous image
    overlay.gotoPreviousImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[2]);

    // Goto first image
    overlay.gotoFirstImage();
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto 3rd image
    overlay.gotoImage(2);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[2]);

    // close overlay
    overlay.close();
    await expectAsync(overlayHarness.overlayIsLoaded()).withContext('Image overlay is no more available').toBeResolvedTo(false);
  });

  it('should click 1st image', fakeAsync(async () => {
    const imageGotClickedData: Record<string, unknown>[] = [];
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
    } as MatImageOverlayConfig;

    const imageOverlayRef = fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    imageOverlayRef.imageClicked().subscribe(event => imageGotClickedData.push(event));

    expect(overlayHarness).not.toBeUndefined();

    // Start with 1st image
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Click image
    await overlayHarness.clickImage();
    flush();

    // test, if click handler got called once for the first image
    const imageClickedData = {
      imageIndex: 0,
      url: 'https://picsum.photos/id/30/1024/768'
    };

    expect(imageGotClickedData.length).toBe(1);
    expect(imageGotClickedData[0]).toEqual(imageClickedData);
  }));

  it('should click last image with custom data returned', fakeAsync(async () => {
    const imageGotClickedData: Record<string, unknown>[] = [];
    const imageProvider = new StringSourceImageDetailsProvider(stringImages);
    const config: MatImageOverlayConfig = {
      imageDetails: imageProvider,
      imageClickedAdditionalData: { additionalData: 42 }
    } as MatImageOverlayConfig;

    const imageOverlayRef = fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);
    imageOverlayRef.imageClicked().subscribe(event => imageGotClickedData.push(event));

    expect(overlayHarness).not.toBeUndefined();

    // Goto last image
    imageOverlayRef.gotoLastImage();
    const lastImageIndex = imageOverlayRef.numberOfImages - 1;
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[lastImageIndex]);

    // Click image
    await overlayHarness.clickImage();
    flush();

    const imageClickedData = {
      imageIndex: 3,
      url: 'https://picsum.photos/id/525/1440/900',
      additionalData: 42
    };

    // test, if click handler got called once for the last image
    expect(imageGotClickedData.length).toBe(1);
    expect(imageGotClickedData[0]).toEqual(imageClickedData);
  }));

  it('should send keys', async () => {
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages)
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();

    // Start with 1st image
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[0]);

    // Goto next image
    await overlayHarness.sendKeys(TestKey.RIGHT_ARROW);
    await expectAsync(overlayHarness.imageUrl()).toBeResolvedTo(stringImages[1]);
  });

  it('should set backdrop class', async () => {
    const sampleCssClass = 'sample-class';
    const config: MatImageOverlayConfig = {
      imageDetails: new StringSourceImageDetailsProvider(stringImages),
      backdropClass: sampleCssClass
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.hasBackdropClass(sampleCssClass)).withContext('Image overlay backdrop has class set').toBeResolvedTo(true);
  });
});

describe('MatImageOverlay with Harness and object array source', () => {
  const objectImages: ImageDetailsObject[] = [
    { id: '1000', width: Math.round(1000 / 3635 * 5626), height: 1000, description: 'picture 1' },
    { id: '1014', width: 1000, height: 1000, description: 'picture 2' },
    { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000, description: 'picture 3' },
    { id: '1015', width: Math.round(1000 / 4000 * 6000), height: 1000, description: 'picture 4' }
  ];

  let fixture: ComponentFixture<MatImageOverlayTestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
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

  it('should load image overlay with option baseUrl', async () => {
    const imageProvider = new ObjectSourceImageDetailsProvider(objectImages);
    imageProvider.baseUrl = 'https://picsum.photos/id/';
    const config: MatImageOverlayConfig = {
      imageDetails: imageProvider
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
  });

  it('should display description on descriptionDisplayStyle="onHover"', async () => {
    const imageProvider = new ObjectSourceImageDetailsProvider(objectImages);
    imageProvider.baseUrl = 'https://picsum.photos/id/';
    const config: MatImageOverlayConfig = {
      imageDetails: imageProvider,
      descriptionDisplayStyle: ElementDisplayStyle.onHover
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.descriptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);

    // Hover the img tag
    await overlayHarness.figureHover();
    await expectAsync(overlayHarness.descriptionVisible()).withContext('Image "description" is visible').toBeResolvedTo(true);
  });

  it('should hide description when empty string', async () => {
    const images: ImageDetailsObject[] = [
      { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000, description: '' }
    ];

    const baseUrl = 'https://picsum.photos/id/';
    const imageProvider = new ObjectSourceImageDetailsProvider(images, baseUrl);
    const config: MatImageOverlayConfig = {
      imageDetails: imageProvider,
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.descriptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);
  });

  it('should hide description when undefined', async () => {
    const images: ImageDetailsObject[] = [
        { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000 }
    ];

    const baseUrl = 'https://picsum.photos/id/';
    const imageProvider = new ObjectSourceImageDetailsProvider(images, baseUrl);

    const config: MatImageOverlayConfig = {
      imageDetails: imageProvider,
      descriptionDisplayStyle: ElementDisplayStyle.always
    } as MatImageOverlayConfig;

    fixture.componentInstance.open(config);
    const overlayHarness = await loader.getHarness(MatImageOverlayHarness);

    expect(overlayHarness).not.toBeUndefined();
    await expectAsync(overlayHarness.descriptionVisible()).withContext('Image "description" is not visible').toBeResolvedTo(false);
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

class StringSourceImageDetailsProvider extends MatImageDetailsProvider {
  private images: string[] = [];

  get numberOfImages() {
    return this.images.length;
  }

  constructor(images: string[]) {
    super();
    if (images && Array.isArray(images)) {
      this.images = images;
    } else {
      throw new Error('The parameter "images" must be an array of strings.');
    }
  }

  override urlForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      return this.images[imageIndex];
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override descriptionForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      return `Image '${imageIndex}'`;
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override imageInformation(imageIndex: number): Record<string, unknown> {
    return {
      imageIndex,
      url: this.urlForImage(imageIndex)
    };
  }
}

type ImageDetailsObject = {
  id: string;
  width: number;
  height: number;
  description?: string;
  [otherOptions: string]: unknown;
}

class ObjectSourceImageDetailsProvider extends MatImageDetailsProvider {
  /** Base url to be used by method 'urlForImage' */
  public baseUrl = '';

  private images: ImageDetailsObject[] = [];

  get numberOfImages() {
    return this.images.length;
  }

  constructor(images: ImageDetailsObject[], baseUrl?: string) {
    super();
    if (images && Array.isArray(images)) {
      this.images = images;
    } else {
      throw new Error('The parameter "images" must be an array of objects.');
    }

    if (baseUrl && (typeof baseUrl === 'string')) {
      this.baseUrl = baseUrl;
    }
  }

  override urlForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.images[imageIndex];
      return `${String(this.baseUrl)}${imageData.id}/${String(imageData.width)}/${String(imageData.height)}`;
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override descriptionForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.images[imageIndex];
      return imageData.description || '';
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override imageInformation(imageIndex: number): Record<string, unknown> {
    return {
      imageIndex,
      url: this.urlForImage(imageIndex)
    };
  }
}
