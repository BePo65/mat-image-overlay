import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { ObjectSourceImageDetailsProvider } from './object-image-details-provider.class';
import { StringSourceImageDetailsProvider } from './string-image-details-provider.class';

import {
  ElementDisplayPosition,
  ElementDisplayStyle,
  MatImageOverlay,
  MatImageOverlayConfig,
  MatImageOverlayRef
} from 'mat-image-overlay';

enum ElementBackdropClass {
  none = '',
  red ='backdrop-red',
  blue = 'backdrop-blue',
  green = 'backdrop-green'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected elementDisplayStyle = ElementDisplayStyle;
  protected elementDisplayPosition = ElementDisplayPosition;
  protected elementBackdropClass = ElementBackdropClass;

  protected  optionsForm = this.formBuilder.group({
    buttonStyle: [ElementDisplayStyle.onHover, [Validators.required]],
    descriptionStyle: [ElementDisplayStyle.never, [Validators.required]],
    descriptionPosition: [ElementDisplayPosition.right, [Validators.required]],
    backdropClass: [ElementBackdropClass.none, []]
  });

  protected stringImages = [
    'https://picsum.photos/id/30/1024/768',
    'https://picsum.photos/id/201/800/600',
    'https://picsum.photos/id/63/1800/1600',
    'https://picsum.photos/id/525/1440/900'
  ];

  protected objectImages = [
    { id: '1000', width: Math.round(1000 / 3635 * 5626), height: 1000, description: 'picture 1' },
    { id: '1014', width: 1000, height: 1000, description: 'picture 2' },
    { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000 },
    { id: '1015', width: Math.round(1000 / 4000 * 6000), height: 1000, description: 'picture 4' }
  ];

  private baseUrlForObjectImages = 'https://picsum.photos/id/';
  private stringSourceImageDetailsProvider = new StringSourceImageDetailsProvider(this.stringImages);
  private objectSourceImageDetailsProvider = new ObjectSourceImageDetailsProvider(this.objectImages, this.baseUrlForObjectImages);

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
      imageDetails: this.stringSourceImageDetailsProvider,
      startImageIndex: imageIndex,
      overlayButtonsStyle: this.optionsForm.controls['buttonStyle'].value as ElementDisplayStyle,
      descriptionDisplayStyle: this.optionsForm.controls['descriptionStyle'].value as ElementDisplayStyle,
      descriptionDisplayPosition: this.optionsForm.controls['descriptionPosition'].value as ElementDisplayPosition,
      imageClickedAdditionalData: { sampleValue: 'demo parameter for overlay demo'}
    } as MatImageOverlayConfig;

    const backdropClass = this.optionsForm.controls['backdropClass'].value as string;
    if (backdropClass !== '') {
      config.backdropClass = backdropClass;
    }

    const imageOverlayRef = this.imageOverlay.open(config);

    // Demo to show usage of published events
    imageOverlayRef.afterOpened().subscribe(() => console.log('imageOverlayRef: overlay opened'));
    imageOverlayRef.afterClosed().subscribe(lastImageIndex => console.log(`imageOverlayRef: overlay closed; last index=${String(lastImageIndex)}`));
    imageOverlayRef.imageChanged().subscribe(currentImageIndex => console.log(`image changed; new index=${String(currentImageIndex)}`));
    imageOverlayRef.imageClicked().subscribe(event => this.clickHandlerForOverlayDemo(event));
    imageOverlayRef.keydownEvents().subscribe(keyboardEvent => console.log(`button pressed; event.key=${keyboardEvent.key}`));
  }

  /**
   * Demo to show external switching of images.
   * Demo uses anonymous function as overlay image click handler.
   */
  startImageShow(): void {
    console.log(`${(new Date()).toLocaleTimeString()} - open overlay with 3rd image`);
    const config: MatImageOverlayConfig = {
      imageDetails: this.objectSourceImageDetailsProvider,
      startImageIndex: 2,
      overlayButtonsStyle: this.optionsForm.controls['buttonStyle'].value as ElementDisplayStyle,
      descriptionDisplayStyle: this.optionsForm.controls['descriptionStyle'].value as ElementDisplayStyle,
      descriptionDisplayPosition: this.optionsForm.controls['descriptionPosition'].value as ElementDisplayPosition,
      imageClickedAdditionalData: { sampleValue: 'demo parameter for image show'}
    } as MatImageOverlayConfig;

    const backdropClass = this.optionsForm.controls['backdropClass'].value as string;
    if (backdropClass !== '') {
      config.backdropClass = backdropClass;
    }

    const imageOverlayRef = this.imageOverlay.open(config);
    imageOverlayRef.imageClicked().subscribe(event => {
      const imageId: string = String(event['id']);
      console.log(`Image clicked for image '${imageId}' with additional parameter '${String(event['sampleValue'])}'`);
    });

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
      imageDetails: new StringSourceImageDetailsProvider(this.stringImages)
    } as MatImageOverlayConfig;

    this.imageOverlay.open(config);
  }

  /**
   * Gets url of a preview image for objectImages source from index of image.
   * Function is used in component template.
   * @param imageIndex - index of image to be displayed
   * @returns url of image to be displayed
   */
  urlForObjectImagesPreview(imageIndex: number): string {
    // TODO add thumbnail url getter to provider via interface
    return this.objectSourceImageDetailsProvider.urlForImage(imageIndex);
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
   * Demo for overlay image click event handler using a named function.
   * @param imageData - object with image data
   */
  private clickHandlerForOverlayDemo(imageData: Record<string, unknown>): void {
    console.log(`Image clicked for image '${String(imageData['url'])}' with additional parameter '${String(imageData['sampleValue'])}'`);
  }
}
