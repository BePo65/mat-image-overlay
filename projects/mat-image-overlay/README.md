# Mat-Image-Overlay
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE)

An image overlay based on [Angular Material](https://material.angular.io/). Try out the [demo page](https://rafasantos.github.io/mat-image-overlay/)

![Screenshot](https://raw.githubusercontent.com/rafasantos/mat-image-overlay/master/src/assets/screenshot.jpg "Screenshot from demo page")

## Quick Start
Install the package:

```
npm install mat-image-overlay
```

Configure your angular application module (e.g: `app.module.ts`):
```
...
import { MatImageOverlayModule, MatImageOverlayComponent } from 'mat-image-overlay';

@NgModule({
  ...
  imports: [
    ...
    MatImageOverlayModule
  ]
})
export class AppModule { }
```

Open the images via `MatImageOverlayService.open(images: string[])`
```
images = [
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg',
    'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23214-1440x900.jpg'
];

constructor(private imageOverlayService: MatImageOverlayService) {
}

openImageOverlay(): void {
  this.imageOverlayService.open(this.images);
}
```

## Mat-Image-Overlay Demo
Demo project to show case how `mat-image-overlay` works.

```
git clone https://github.com/rafasantos/mat-image-overlay.git
cd mat-image-overlay
npm start
```

Navigate to http://localhost:4200

## Development
`${APP_ROOT_FOLDER}` references the root folder of the application typically the git repository root folder.

This command builds the project and override the local `mat-image-overlay` installation.
The built package is located at `${APP_ROOT_FOLDER} dist/mat-image-overlay`
```
npm run build-dev
```

Use these commands if you wish to install a development version manually into a different project without `npm install`. This is only recommended for prototyping.
```
cd ${APP_ROOT_FOLDER}
cp -r dist/mat-image-overlay/ ${YOUR_APP}/node_modules/
```

Use these commands if you wish to deploy the demo application to git hub pages:
```
npm run demo
git commit -a -m "Deploying to github pages"
```

Follow this steps when publishing:
```
cd ${APP_ROOT_FOLDER}
cd projects/mat-image-overlay/
npm version patch
cd ../../
npm run build-dev
npm version patch --no-git-tag-version
git commit -a -m "Version up to xxxx
cd dist/mat-image-overlay
npm publish
```

## License
Code released under the [MIT license](LICENSE)
