# Mat-Image-Overlay
![Version](https://img.shields.io/badge/version-15.1.4-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE)

An [Angular Material](https://material.angular.io/) based component that shows images in an overlay.
The component is based on Rafasantos [angular-material-image-overlay](https://github.com/rafasantos/angular-material-image-overlay).

## Demo
 Try out the [demo page](https://bepo65.github.io/mat-image-overlay/).

![Screenshot](assets/screenshot.jpg "Screenshot of the demo page")

## Quick Start
Install the package:

```
npm install mat-image-overlay
```

Configure your angular application module (e.g: `app.module.ts`):
```
...
import { MatImageOverlayModule } from 'mat-image-overlay';

@NgModule({
  ...
  imports: [
    ...
    MatImageOverlayModule
  ]
})
export class AppModule { }
```

Define a class based on MatImageDetailsProvider to get information about the images and create an instance of it in the mat-image-overlay configuration. Examples for classes based on MatImageDetailsProvider can be found in the 'examples/provider' directory of the mat-image-overlay component.
```
images = [
    'https://url/of/first/image.jpg',
    'https://url/of/second/image.jpg',
    'https://url/of/third/image.jpg',
    'https://url/of/fourth/image.jpg'
];

constructor(private imageOverlay: MatImageOverlay) {
}

openImageOverlay(imageIndex?: number): void {
  const config = {
    imageDetails: new StringSourceImageDetailsProvider(this.images),
    startImageIndex: imageIndex,
    backdropClass: 'demo-backdrop-class'
  } as MatImageOverlayConfig;
  const imageOverlayRef = this.imageOverlay.open(config);
}
```

Open the overlay via a clickable element in your html template (e.g. `app.component.html`)
```html
  <p>
    Click <a href="#" (click)="openImageOverlay()">here to open the overlay</a>
  </p>
```
## Navigation
When the overlay is shown, the keyboard can be used to navigate between the images (even when no navigational buttons are displayed on the image). The following keys are available:

| key | function |
|-----|----------|
| Arrow Right | show next image |
| Arrow Down | show next image |
| Arrow Left | show previous image |
| Arrow Up | show previous image |
| Home | show first image |
| End | show last image |
| Escape | close overlay |

## Used assets
The component is based on Angular Material and uses [Google Fonts](https://fonts.google.com/specimen/Roboto) and [Google Material Icons](https://google.github.io/material-design-icons/#icon-font-for-the-web).
Both fonts are part of the project and not fetched via https.

Some special icons are stored in the code as strings representing the icons as svg graphics.

## Mat-Image-Overlay Demo
Demo project to show case how `mat-image-overlay` works.

```
git clone git@github.com:BePo65/mat-image-overlay.git
cd mat-image-overlay
npm start
```

Navigate to http://localhost:4200

# API reference for Mat-Image-Overlay

## Services
### MatImageOverlay
Service to open Mat-Image-Overlay as a modal overlay.

**Properties**
| Name  | Description |
|---|---|
| imageOverlayRef: MatImageOverlayRef &#124; undefined | Reference of the opened image overlay. |
| afterOpened: Subject&lt;MatImageOverlayRef&gt; | Stream that gets notified when the image overlay has been opened. |
| afterClosed: Subject&lt;number&gt; | Stream that gets notified when the image overlay has been closed. |

**Methods**
| open | |
|---|--|
| Opens the image overlay. | |
| *Parameters* | |
| config<br>MatImageOverlayConfig | Extra configuration options. |
| *Returns* | |
| MatImageOverlayRef | Reference to opened image overlay.

| imageOverlayExists | |
|---|--|
| Checks whether the image overlay already exists. | |
| *Returns* | |
| boolean | true = image overlay exists |

## Interfaces
### MatImageOverlayConfig
Configuration for opening a modal image overlay with the MatImageOverlay service.

**Properties**
| Name  | Description |
|---|---|
| imageDetails | Instance of a class derived from MatImageDetailsProvider. |
| startImageIndex | Index of the first image to be displayed (0 based). |
| backdropClass | CSS class to add to the backdrop, replacing the default backdrop css. This CSS class must be in the global styles of the application.<br>Default style is '`background: rgba(0 0 0 / 32%);`'<br>Optional parameter. |
| margin | Minimal margin in px around the loaded image.<br>Default value: 32<br>Optional parameter. |
| overlayButtonsStyle | Style of the buttons in the image overlay (using enum ElementDisplayStyle: never, onHover, always).<br>Default value: ElementDisplayStyle.onHover.<br>Optional parameter. |
| descriptionDisplayStyle | Style of the image description in the image overlay (using enum ElementDisplayStyle: never, onHover, always). Using this option requires a property named 'description' in the data source.<br>Default value: ElementDisplayStyle.never.<br>Optional parameter. |
| descriptionDisplayPosition | Position of the image description in the image overlay (using enum ElementDisplayPosition: bottomLeft, bottomCenter, bottomRight, topLeft, topCenter, topRight). Using this option requires a property named 'description' in the data source.<br>Default value: ElementDisplayPosition.bottomRight.<br>Optional parameter. |
| imageClickedAdditionalData | Object with arbitrary data that will be returned by the imageClicked event (added to the data returned by the 'imageDetails.imageInformation' method).<br>Optional parameter. |

### MatImageDetailsProvider
Abstract base class to be derived by a real image details provider. This class is used to get all the required information about an image.

**Properties**
| Name  | Description |
|---|---|
| numberOfImages | Number of images that can be displayed (this property is readonly). |

**Methods**
| urlForImage | |
|---|--|
| Gets the url for an image. | |
| *Parameters* | |
| imageIndex | Index of the image to be displayed (0 based). |
| *Returns* | |
| string | Url for the image to be displayed. |

| descriptionForImage | |
|---|--|
| Gets the description for an image. | |
| *Parameters* | |
| imageIndex | Index of the image to be displayed (0 based). |
| *Returns* | |
| string | Url for the image to be displayed. |

| imageInformation | |
|---|--|
| Gets a record that contains information about an image. | The returned object is part of the data returned by the imageClicked event. |
| *Parameters* | |
| imageIndex | Index of the clicked image (0 based). |
| *Returns* | |
| Record<string, unknown> | Object with additional data about the image. |

### ThumbnailProvider
Interface to add the handling of thumbnail images to a class derived from MatImageDetailsProvider.

**Properties**
| Name  | Description |
|---|---|
| thumbnailHeight | Height of the thumbnail images in px. |

**Methods**
| urlForThumbnail | |
|---|--|
| Gets the url for a thumbnail image. | |
| *Parameters* | |
| imageIndex | Index of the thumbnail image to be displayed (0 based). |
| *Returns* | |
| string | Url for the thumbnail image to be displayed. |

## Classes
### MatImageOverlayRef
Reference to an image overlay opened via the MatImageOverlay service.

**Properties**
| Name  | Description |
|---|---|
| numberOfImages | number of images that can be displayed. |
| keydownEvents$ | Observable that is notified by keydown events on the overlay. Navigation buttons don't get emitted. |

**Methods**
| afterOpened | |
|---|--|
| Gets an observable that is notified when the image overlay is finished opening. | |
| *Returns* | |
| Observable&lt;void&gt; | Observable that fires, when the overlay has been opened. |

| afterClosed | |
|---|--|
| Gets an observable that is notified when the image overlay is finished closing. | |
| *Returns* | |
| Observable&lt;number&gt; | Observable that returns the index of the last image displayed. |

| imageChanged | |
|---|--|
| Gets an observable that is notified when a new image has been selected. | |
| *Returns* | |
| Observable&lt;number&gt; | Observable that returns the index of the image displayed. |

| imageClicked | |
|---|--|
| Gets an observable that is notified when an image has been clicked. | |
| *Returns* | |
| Observable&lt;ImageClickedEvent&gt; | Observable that returns the object with data of the clicked image and the imageClickedConfiguration object from the config object. |

| gotoNextImage | |
|---|--|
| Display the next image in the datasource. | |

| gotoPreviousImage | |
|---|--|
| Display the previous image in the datasource. | |

| gotoFirstImage | |
|---|--|
| Display the first image in the datasource. | |

| gotoLastImage | |
|---|--|
| Display the last image in the datasource. | |

| gotoImage | |
|---|--|
| Display the image in the datasource selected by the imageIndex. | |
| *Parameters* | |
| imageIndex | Index of the image to be displayed. |

| close | |
|---|--|
| Close the image overlay. | |

# API reference for Mat-Image-Overlay testing

```typescript
import { MatImageOverlayHarness } from 'mat-image-overlay/testing';
```
## Classes
### MatImageOverlayHarness extends ContentContainerComponentHarness
Harness for interacting with a standard MatImageOverlay in tests.

**Properties**
| Name  | Description |
|---|---|
| static hostSelector: '.mat-image-overlay-container' | The selector for the host element of a MatImageOverlay instance. |

**Methods**
| async overlayIsLoaded | |
|---|--|
| Gets a promise that fulfills to true, when the image overlay is visible. | |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise that fulfills to a flag that shows, if the image overlay is visible.

| async close | |
|---|--|
| Closes the image overlay by pressing escape. | |
| *Returns* | |
| Promise&lt;void&gt; | Promise that fulfills, when the action completes.

| async clickBackdrop | |
|---|--|
| Closes the image overlay by clicking the backdrop of the image overlay. | |
| *Returns* | |
| Promise&lt;void&gt; | Promise that fulfills, when the action completes.

| async buttonCloseVisible | |
|---|--|
| Gets a promise that fulfills to true, when the 'close' button is visible. | |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise that fulfills to a flag that shows, if the 'close' button is visible.

| async buttonPreviousVisible | |
|---|--|
| Gets a promise that fulfills to true, when the 'previous' button is visible. | |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise that fulfills to a flag that shows, if the 'previous' button is visible.

| async buttonNextVisible | |
|---|--|
| Gets a promise that fulfills to true, when the 'next' button is visible. | |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise that fulfills to a flag that shows, if the 'next' button is visible.

| async descriptionVisible | |
|---|--|
| Gets a promise that fulfills to true, when the 'description' of the image is visible. | |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise that fulfills to a flag that shows, if the 'description' is visible.

| async clickCloseButton | |
|---|--|
| Clicks the 'close overlay' button of the image overlay. | |
| *Returns* | |
| Promise&lt;void&gt; | Promise that fulfills, when the action completes.

| async clickPreviousButton | |
|---|--|
| Clicks the 'goto previous image' button of the image overlay. | |
| *Returns* | |
| Promise&lt;void&gt; | Promise that fulfills, when the action completes.

| async clickNextButton | |
|---|--|
| Clicks the 'goto next image' button of the image overlay. | |
| *Returns* | |
| Promise&lt;void&gt; | Promise that fulfills, when the action completes.

| async figureHover | |
|---|--|
| Sets the figure tag of the overlay (the content of the overlay) into the hover state. | |
| *Returns* | |
| Promise&lt;void&gt; | Promise that fulfills, when the action completes.

| async imageUrl | |
|---|--|
| Gets a promise that fulfills to the url of the current image in the overlay. | |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise that fulfills to the url of the image or to an empty string.

| async sendKeys | |
|---|--|
| Send keys to the overlay. | |
| *Parameters* | |
| ...keys | Array of 'TestKey' to be sent. Possible values are the arrow keys, the home and the end key. |
| *Returns* | |
| Promise&lt;void&gt; | Promise that resolves when the action completes.

| async hasBackdropClass | |
|---|--|
| Gets a promise that fulfills to true, when the backdrop contains the given css class. | |
| *Parameters* | |
| classname | Name of the css class to be evaluated. |
| *Returns* | |
| Promise&lt;boolean&gt; | Promise fulfills to a flag that shows, if the backdrop contains the given css class.

# Dependencies
* Waiting for a version of `stylelint-config-recommended-scss` that supports `stylelint` v16; as soon as this version is available `stylelint` and `stylelint-config-standard` can be updated to latest versions.

# Development
Build the library and the demo project:
```
npm run build
```

Lint the library,  the demo project with eslint and the scss files with stylelint:
```
npm run lint
npm run lint:scss
```

Test the library and the demo project:
```
npm run test
```

Run component tests for the library project with cypress once (e.g. for CI scenarios):
```
npm run ct
```

Run end to end tests for the demo project with cypress once (e.g. for CI scenarios):
```
npm run e2e
```
The script 'build:ghpages' is used by the github automation to publish the demo to github pages, when the master branch is updated.

# Contributing
## Changelog
The project uses 'standard-version' to create the changelog. To enable this system, commit messages are linted before commits are executed by git.

**The structure of commit messages is**:
```
  <header>
  <BLANK LINE>
  <body>
  <BLANK LINE>
  <footer>
```

**header**
```
  <type>(<scope>): <short summary>
```
  
type and scope
  - build: Changes that affect the build system or external dependencies (example scope: npm)
  - docs: Documentation only changes
  - feat: A new feature
  - fix: A bug fix
  - perf: A code change that improves performance
  - refactor: A code change that neither fixes a bug nor adds a feature
  - test: Adding missing tests or correcting existing tests (example scopes: demo, lib, e2e)

**footer**
```
  BREAKING CHANGE: ... (requires MAJOR in Semantic Versioning)
```

For details of the commit messages format see [Contributing to Angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

# License
The code is released under the [MIT license](LICENSE)
