import { Component } from '@angular/core';
import { AngularMaterialImageOverlayService } from 'angular-material-image-overlay';

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

  constructor(private imageOverlayService: AngularMaterialImageOverlayService) {
  }

  openImageOverlay(image?: string): void {
    this.imageOverlayService.open(this.images, image);
  }
}
