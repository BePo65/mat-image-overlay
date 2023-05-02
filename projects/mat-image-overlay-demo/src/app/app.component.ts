import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { ElementDisplayPosition, ElementDisplayStyle, MatImageOverlay, MatImageOverlayConfig, MatImageOverlayRef } from 'mat-image-overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  elementDisplayStyle = ElementDisplayStyle;
  elementDisplayPosition = ElementDisplayPosition;

  optionsForm = this.formBuilder.group({
    buttonStyle: [ElementDisplayStyle.onHover, [Validators.required]],
    descriptionStyle: [ElementDisplayStyle.never, [Validators.required]],
    descriptionPosition: [ElementDisplayPosition.right, [Validators.required]]
  });

  stringImages = [
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
  ];

  objectImages = [
    { id: '1000', width: Math.round(1000 / 3635 * 5626), height: 1000, description: 'picture 1' },
    { id: '1014', width: 1000, height: 1000, description: 'picture 2' },
    { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000 },
    { id: '1015', width: Math.round(1000 / 4000 * 6000), height: 1000, description: 'picture 4' }
  ];

  private baseUrlForObjectImages = 'https://picsum.photos/id/';

  constructor(private imageOverlay: MatImageOverlay, private formBuilder: UntypedFormBuilder) {
    this.imageOverlay.afterOpened.subscribe(() => console.log('MatImageOverlay opened'));
    this.imageOverlay.afterClosed.subscribe(lastImageIndex => console.log(`MatImageOverlay closed; last index=${lastImageIndex || 0}`));
  }

  /**
   * Demo to show most functions of overlay images.
   * @param imageIndex - index of the first image to be displayed in overlay
   */
  openImageOverlay(imageIndex?: number): void {
    // Demo to show usage of most 'open' parameters and a string array as 'images'
    const config: MatImageOverlayConfig = {
      images: this.stringImages,
      startImageIndex: imageIndex,
      backdropClass: 'demo-backdrop-class',
      overlayButtonsStyle: this.optionsForm.controls['buttonStyle'].value as ElementDisplayStyle,
      descriptionForImage: (imageData: unknown, configuration?: object) => {
        let result = '';
        if (typeof imageData === 'string') {
          if (configuration) {
            result = `${String(configuration['label' as keyof object])}: ${String(imageData)}`;
          } else {
            result = String(imageData);
          }
        }
        return result;
      },
      descriptionForImageConfiguration: {label: 'file name'},
      descriptionDisplayStyle: this.optionsForm.controls['descriptionStyle'].value as ElementDisplayStyle,
      descriptionDisplayPosition: this.optionsForm.controls['descriptionPosition'].value as ElementDisplayPosition,
      imageClickHandlerConfiguration: { sampleValue: 'demo parameter for overlay demo'}
    } as MatImageOverlayConfig;

    const imageOverlayRef = this.imageOverlay.open(config);

    // Demo to show usage of published events
    imageOverlayRef.afterOpened().subscribe(() => console.log('imageOverlayRef: overlay opened'));
    imageOverlayRef.afterClosed().subscribe(lastImageIndex => console.log(`imageOverlayRef: overlay closed; last index=${String(lastImageIndex)}`));
    imageOverlayRef.imageChanged().subscribe(currentImageIndex => console.log(`image changed; new index=${String(currentImageIndex)}`));
    imageOverlayRef.imageClicked().subscribe(event => this.clickHandlerForOverlayDemo(event.imageData, event.configuration));
    imageOverlayRef.keydownEvents().subscribe(keyboardEvent => console.log(`button pressed; event.key=${keyboardEvent.key}`));
  }

  /**
   * Demo to show external switching of images.
   * Demo uses anonymous function as overlay image click handler.
   */
  startImageShow(): void {
    console.log(`${(new Date()).toLocaleTimeString()} - open overlay with 3rd image`);
    const config: MatImageOverlayConfig = {
      images: this.objectImages,
      urlForImage: this.urlForObjectImagesSource,  // eslint-disable-line @typescript-eslint/unbound-method
      baseUrl: this.baseUrlForObjectImages,
      startImageIndex: 2,
      overlayButtonsStyle: this.optionsForm.controls['buttonStyle'].value as ElementDisplayStyle,
      descriptionForImage: (imageData: unknown) => {
        let result = '';
        if (typeof imageData === 'object') {
          result = (imageData as object)['description' as keyof object];
        }
        return result;
      },
      descriptionDisplayStyle: this.optionsForm.controls['descriptionStyle'].value as ElementDisplayStyle,
      descriptionDisplayPosition: this.optionsForm.controls['descriptionPosition'].value as ElementDisplayPosition,
      imageClickHandler: (imageData: unknown, configuration?: object) => {
        let additionalParameter = {};
        if (configuration) {
          additionalParameter = configuration;
        }
        const image = imageData as object;
        const imageId: string = image['id' as keyof object];
        console.log(`Image clicked for image '${imageId}' with additional parameter '${String(additionalParameter['sampleValue' as keyof object])}'`);
      },
      imageClickHandlerConfiguration: { sampleValue: 'demo parameter for image show'}
    } as MatImageOverlayConfig;

    const imageOverlayRef = this.imageOverlay.open(config);

    // For typecast of timer see https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
    let loopIndex = 1;
    const timerId = setInterval(() => {
      loopIndex = this.switchImages(loopIndex, imageOverlayRef, timerId);
    }, 2000) as unknown as number;

    // Kill loop when overlay is manually closed (e.g. by clicking the backdrop)
    imageOverlayRef.afterClosed().subscribe(() => clearTimeout(timerId)
    );

  }

  /**
   * Demo to show overlay images with minimal configuration.
   */
  openMinimalConfigImageOverlay(): void {
    const config: MatImageOverlayConfig = {
      images: this.stringImages
    } as MatImageOverlayConfig;

    this.imageOverlay.open(config);
  }

  /**
   * Gets url of image for stringImages source from index of image.
   * Function is used in component template.
   * @param imageIndex - index of image to be displayed
   * @returns url of image to be displayed
   */
  urlForStringImagesSource(imageIndex: number): string {
    return this.urlForObjectImagesSource(this.objectImages[imageIndex], this.baseUrlForObjectImages);
  }

  /**
   * Definition of the sequence of commands to be executed
   * in the 'image show'.
   * @param loopIndex - index of the step to be executed
   * @param imageOverlayRef - overlay to be used
   * @param timerId - id of the timer used to trigger the commands (used to stop it)
   * @returns loopIndex to be used next time
   */
  private switchImages(loopIndex: number, imageOverlayRef: MatImageOverlayRef, timerId: number): number {
    switch (loopIndex) {
      case 1:
        console.log(`${(new Date()).toLocaleTimeString()} - goto first image`);
        imageOverlayRef.gotoFirstImage();
        break;
      case 2:
        console.log(`${(new Date()).toLocaleTimeString()} - goto next image`);
        imageOverlayRef.gotoNextImage();
        break;
      case 3:
        console.log(`${(new Date()).toLocaleTimeString()} - goto next image`);
        imageOverlayRef.gotoNextImage();
        break;
      case 4:
        console.log(`${(new Date()).toLocaleTimeString()} - goto previous image`);
        imageOverlayRef.gotoPreviousImage();
        break;
      case 5:
        console.log(`${(new Date()).toLocaleTimeString()} - goto last image`);
        imageOverlayRef.gotoLastImage();
        break;
      case 6:
        console.log(`${(new Date()).toLocaleTimeString()} - goto 2nd image`);
        imageOverlayRef.gotoImage(1);
        break;
      case 7:
        console.log(`${(new Date()).toLocaleTimeString()} - close overlay`);
        imageOverlayRef.close();
        clearInterval(timerId);
        break;
    }

    return ++loopIndex;
  }

  /**
   * Gets url of image for objectImages source from index of image and optional baseUrl.
   * Function is used for configuration parameter 'urlForImage'.
   * @param imageData - object with image data
   * @param baseUrl - baseUrl of images
   * @returns url of image to be displayed
   */
  private urlForObjectImagesSource(imageData: unknown, baseUrl?: string): string {
    if (typeof imageData === 'object') {
      const image = imageData as object;
      const imageId: string = image['id' as keyof object];
      return `${String(baseUrl)}${imageId}/${String(image['width' as keyof object])}/${String(image['height' as keyof object])}`;
    } else {
      throw new Error('Configuration element "images" must be an array of objects');
    }
  }

  /**
   * Demo for overlay image click event handler using a named function.
   * @param imageData - object with image data
   * @param configuration - object 'imageClickHandlerConfiguration' from 'config'
   */
  private clickHandlerForOverlayDemo(imageData: unknown, configuration?: object): void {
    let additionalParameter = {};
    if (configuration) {
      additionalParameter = configuration;
    }
    console.log(`Image clicked for image '${String(imageData)}' with additional parameter '${String(additionalParameter['sampleValue' as keyof object])}'`);
  }
}
