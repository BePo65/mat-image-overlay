import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ImageDetailsObject, ObjectSourceImageDetailsProvider } from './object-image-details-provider.class';
import { NumericEnumToArrayPipe, StringEnumToArrayPipe } from './shared/enum-to-array.pipe';
import { StringSourceImageDetailsProvider } from './string-image-details-provider.class';

import {
  ElementDisplayPosition,
  ElementDisplayStyle,
  MatImageDetailsProvider,
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
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, NgIf, NumericEnumToArrayPipe, StringEnumToArrayPipe]
})
export class AppComponent {
  protected elementDisplayStyle = ElementDisplayStyle;
  protected elementDisplayPosition = ElementDisplayPosition;
  protected elementBackdropClass = ElementBackdropClass;
  protected thumbnailHeight = 100;

  protected  optionsForm = this.formBuilder.group({
    buttonStyle: [ElementDisplayStyle.onHover, [Validators.required]],
    descriptionStyle: [ElementDisplayStyle.never, [Validators.required]],
    descriptionPosition: [ElementDisplayPosition.bottomRight, [Validators.required]],
    backdropClass: [ElementBackdropClass.none, []]
  });

  protected stringImages = [
    'https://picsum.photos/id/30/1024/768',
    'https://picsum.photos/id/201/800/600',
    'https://picsum.photos/id/63/1800/1600',
    'https://picsum.photos/id/525/1440/900'
  ];

  protected objectImages: ImageDetailsObject[] = [
    { id: '1000', width: Math.round(1000 / 3635 * 5626), height: 1000, description: 'picture 1' },
    { id: '1014', width: 1000, height: 1000, description: 'picture 2' },
    { id: '102', width: Math.round(1000 / 3240 * 4320), height: 1000 },
    {
      id: '1015',
      width: Math.round(1000 / 4000 * 6000), height: 1000,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' }
  ];

  private baseUrlForObjectImages = 'https://picsum.photos/id/';
  private stringSourceImageDetailsProvider = new StringSourceImageDetailsProvider(this.stringImages);
  private objectSourceImageDetailsProvider = new ObjectSourceImageDetailsProvider(this.objectImages, this.baseUrlForObjectImages, this.thumbnailHeight);

  constructor(private imageOverlay: MatImageOverlay, private formBuilder: UntypedFormBuilder) {
    this.imageOverlay.afterOpened.subscribe(() => console.log('MatImageOverlay opened'));
    this.imageOverlay.afterClosed.subscribe(lastImageIndex => console.log(`MatImageOverlay closed; last index=${lastImageIndex || 0}`));
  }

  /**
   * Demo 1 - open the image with the given index.
   * This demo shows most of the functions of MatImageOverlay with a
   * stringSourceImageDetailsProvider.
   * @param imageIndex - index of the first image to be displayed in overlay
   */
  openOverlayDemo1Image(imageIndex?: number): void {
    const imageOverlayRef = this.openOverlayDemo(this.stringSourceImageDetailsProvider, imageIndex);
    imageOverlayRef.imageClicked().subscribe(event => this.clickHandlerForOverlayDemo1(event));
  }

  /**
   * Demo 1 - shows a sequence of images and then closes the overlay.
   * This demo shows most of the functions of MatImageOverlay with a
   * stringSourceImageDetailsProvider.
   */
  startOverlayDemo1Show() {
    const imageOverlayRef = this.openOverlayDemo(this.stringSourceImageDetailsProvider);
    imageOverlayRef.imageClicked().subscribe(event => this.clickHandlerForOverlayDemo1(event));

    // For typecast of timer see https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
    let loopIndex = 1;
    const timerId = setInterval(() => {
      loopIndex = this.switchImages(loopIndex, imageOverlayRef, timerId);
    }, 2000) as unknown as number;

    // Kill loop, when overlay is manually closed (e.g. by clicking the backdrop)
    imageOverlayRef.afterClosed().subscribe(() => clearTimeout(timerId));
  }

  /**
   * Demo 2 - open the image with the given index.
   * This demo shows most of the functions of MatImageOverlay with a
   * objectSourceImageDetailsProvider.
   * @param imageIndex - index of the first image to be displayed in overlay
   */
  openOverlayDemo2Image(imageIndex?: number): void {
    const imageOverlayRef = this.openOverlayDemo(this.objectSourceImageDetailsProvider, imageIndex);
    imageOverlayRef.imageClicked().subscribe(event => {
      const imageId: string = String(event['id']);
      console.log(`Demo 2 image clicked for image '${imageId}' with additional parameter '${String(event['sampleValue'])}'`);
    });
  }

  /**
   * Demo 2 - shows a sequence of images and then closes the overlay.
   * This demo shows most of the functions of MatImageOverlay with a
   * objectSourceImageDetailsProvider.
   * Demo uses anonymous function as overlay image click handler.
   */
  startOverlayDemo2Show(): void {
    const imageOverlayRef = this.openOverlayDemo(this.objectSourceImageDetailsProvider);
    imageOverlayRef.imageClicked().subscribe(event => {
      const imageId: string = String(event['id']);
      console.log(`Demo 2 image clicked for image '${imageId}' with additional parameter '${String(event['sampleValue'])}'`);
    });

    // For typecast of timer see https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
    let loopIndex = 1;
    const timerId = setInterval(() => {
      loopIndex = this.switchImages(loopIndex, imageOverlayRef, timerId);
    }, 2000) as unknown as number;

    // Kill loop, when overlay is manually closed (e.g. by clicking the backdrop)
    imageOverlayRef.afterClosed().subscribe(() => clearTimeout(timerId));
  }

  /**
   * Demo 3 - open the image with the given index.
   * This demo shows most of the functions of MatImageOverlay with a
   * stringSourceImageDetailsProvider and minimal configuration.
   */
  openMinimalConfigImageOverlay(): void {
    const imageOverlayRef = this.openOverlayDemo(this.stringSourceImageDetailsProvider);
    imageOverlayRef.imageClicked().subscribe(event => {
      console.log(`Demo 3 image clicked for image '${String(event['url'])}' with additional parameter '${String(event['sampleValue'])}'`);
    });
  }

  /**
   * Gets url of a preview image for objectImages source from index of image.
   * Function is used in component template.
   * @param imageIndex - index of image to be displayed
   * @returns url of image to be displayed
   */
  urlForObjectImagesPreview(imageIndex: number): string {
    return this.objectSourceImageDetailsProvider.urlForThumbnail(imageIndex);
  }

  /**
   * Het the width of a thumbnail image.
   * This method is used in the component template.
   * @param imageIndex - index of image to be displayed
   * @returns width of a thumbnail image
   */
  protected thumbnailWidth(imageIndex: number): string {
    return this.objectSourceImageDetailsProvider.thumbnailWidth(imageIndex).toString();
  }

  /**
   * TrackBy function for template to get identity of objectImages entry.
   * @param imageIndex - index of row to get identity value for
   * @param imageData - row to get identity value for
   * @returns id column of objectImages entry (identity value)
   */
  protected trackByImageId(imageIndex: number, imageData: ImageDetailsObject): string { return imageData.id; }

  /**
   * Get description of objectImages entry.
   * @param imageIndex - index of row to get description for
   * @returns description of objectImages entry
   */
  protected imageDescription(imageIndex: number): string {
    return this.objectSourceImageDetailsProvider.descriptionForImage(imageIndex);
  }

  /**
   * Open an image overlay with the given configuration.
   * Add common options as defined in the start page and
   * event handlers to show the functionality.
   * @param imageDetailsProvider - ImageDetailProvider to use
   * @param startIndex - index of first image to show (default: 1)
   * @returns MatImageOverlayRef of the opened overlay
   */
  private openOverlayDemo(imageDetailsProvider: MatImageDetailsProvider, startIndex = 0): MatImageOverlayRef {
    const config: MatImageOverlayConfig = {
      imageDetails: imageDetailsProvider,
      startImageIndex: startIndex,
      margin: 72,
      overlayButtonsStyle: this.optionsForm.controls['buttonStyle'].value as ElementDisplayStyle,
      descriptionDisplayStyle: this.optionsForm.controls['descriptionStyle'].value as ElementDisplayStyle,
      descriptionDisplayPosition: this.optionsForm.controls['descriptionPosition'].value as ElementDisplayPosition,
      imageClickedAdditionalData: { sampleValue: 'demo parameter for overlay demo'}
    };
    const backdropClass = this.optionsForm.controls['backdropClass'].value as string;
    if (backdropClass !== '') {
      config.backdropClass = backdropClass;
    }

    const imageOverlayRef = this.imageOverlay.open(config);

    // Demo to show usage of published events
    imageOverlayRef.afterOpened().subscribe(() => console.log('imageOverlayRef: overlay opened'));
    imageOverlayRef.afterClosed().subscribe(lastImageIndex => console.log(`imageOverlayRef: overlay closed; last index=${String(lastImageIndex)}`));
    imageOverlayRef.imageChanged().subscribe(currentImageIndex => console.log(`image changed; new index=${String(currentImageIndex)}`));
    imageOverlayRef.keydownEvents$.subscribe(keyboardEvent => console.log(`button pressed; event.key=${keyboardEvent.key}`));
    return imageOverlayRef;
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
        console.log(`${(new Date()).toLocaleTimeString()} - goto next image (2nd)`);
        imageOverlayRef.gotoNextImage();
        break;
      case 2:
        console.log(`${(new Date()).toLocaleTimeString()} - goto next image (3rd)`);
        imageOverlayRef.gotoNextImage();
        break;
      case 3:
        console.log(`${(new Date()).toLocaleTimeString()} - goto next image (4th)`);
        imageOverlayRef.gotoNextImage();
        break;
      case 4:
        console.log(`${(new Date()).toLocaleTimeString()} - goto previous image (3rd)`);
        imageOverlayRef.gotoPreviousImage();
        break;
      case 5:
        console.log(`${(new Date()).toLocaleTimeString()} - goto 3rd image`);
        imageOverlayRef.gotoImage(2);
        break;
      case 6:
        console.log(`${(new Date()).toLocaleTimeString()} - goto last image (4th)`);
        imageOverlayRef.gotoLastImage();
        break;
      case 7:
        console.log(`${(new Date()).toLocaleTimeString()} - goto 2nd image`);
        imageOverlayRef.gotoImage(1);
        break;
      case 8:
        console.log(`${(new Date()).toLocaleTimeString()} - goto first image`);
        imageOverlayRef.gotoFirstImage();
        break;
      case 9:
        console.log(`${(new Date()).toLocaleTimeString()} - close overlay`);
        imageOverlayRef.close();
        clearInterval(timerId);
        break;
    }

    return ++loopIndex;
  }

  /**
   * Demo for overlay image click event handler using a named function.
   * @param imageData - object with additional image data
   */
  private clickHandlerForOverlayDemo1(imageData: Record<string, unknown>): void {
    console.log(`Demo 1 image clicked for image '${String(imageData['url'])}' with additional parameter '${String(imageData['sampleValue'])}'`);
  }
}
