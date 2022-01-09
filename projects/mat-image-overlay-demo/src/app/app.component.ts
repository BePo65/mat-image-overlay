import { Component } from '@angular/core';
import { MatImageOverlay, MatImageOverlayRef } from 'mat-image-overlay';
import { MatImageOverlayConfig } from 'mat-image-overlay/lib/mat-image-overlay-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  images = [
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
  ];

  constructor(private imageOverlay: MatImageOverlay) {
    this.imageOverlay.afterOpened.subscribe(() => console.log('MatImageOverlay opened'));
    this.imageOverlay.afterClosed.subscribe(lastImageIndex => console.log(`MatImageOverlay closed; last index=${lastImageIndex}`));
  }

  openImageOverlay(image?: string): void {
    const imageIndex = this.urlToImageIndex(this.images, image);
    // Demo to show usage of all 'open' parameters
    const config = {
      images: this.images,
      startImageIndex: imageIndex,
      backdropClass: 'demo-backdrop-class'
    } as MatImageOverlayConfig;
    const imageOverlayRef = this.imageOverlay.open(config);

    // Demo to show usage of published events
    imageOverlayRef.afterOpened().subscribe(() => console.log('imageOverlayRef: overlay opened'));
    imageOverlayRef.afterClosed().subscribe(lastImageIndex => console.log(`imageOverlayRef: overlay closed; last index=${lastImageIndex}`));
    imageOverlayRef.imageChanged().subscribe(currentImageIndex => console.log(`image changed; new index=${currentImageIndex}`));
    imageOverlayRef.keydownEvents().subscribe(keyboardEvent => console.log(`button pressed; event.key=${keyboardEvent.key}`));
  }

  // Demo to show external switching of images
  startImageShow(): void {
    console.log(`${(new Date()).toLocaleTimeString()} - open overlay with 3rd image`);
    const config = {
      images: this.images,
      startImageIndex: 2
    } as MatImageOverlayConfig;
    const imageOverlayRef = this.imageOverlay.open(config);
    let loopIndex = 1;
    // For typecast of timer see https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
    const timerId = setInterval(() => {
      loopIndex = this.switchImages(loopIndex, imageOverlayRef, timerId);
    }, 2000) as unknown as number;
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

  private urlToImageIndex(images: string[], urlToCurrentImage?: string): number {
    if (urlToCurrentImage) {
      return images.indexOf(urlToCurrentImage);
    }
    return 0;
  }
}
