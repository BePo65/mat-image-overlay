export enum ElementDisplayStyle {
  never,
  onHover,
  always
}

export class MatImageOverlayConfig {
  /** List of images to be displayed. */
  images: unknown[] = [] as string[];

  /**
   * Get the URL for an image from the given entry of images array.
   * This is the default implementation that expects images to be an
   * array of strings.
   * @param imageData - an entry from the 'images' array
   * @param baseUrl - optional url fragment to be used for building the image url
   * @returns the URL of the image
   */
   urlForImage(imageData: unknown, baseUrl?: string): string {
    if (typeof imageData === 'string') {
      let url = '';
      if (baseUrl) {
        url = `${baseUrl}${String(imageData)}`;
      } else {
        url = String(imageData);
      }
      return url;
    } else {
      throw new Error('Configuration element "images" must be an array of strings');
    }
  }

  /** Base url to be used by method 'urlForImage' */
   baseUrl?: string;

  /** Index of image to be displayed when initializing image overlay. */
  startImageIndex?: number;

  /**
   * Custom class(es) for the backdrop.
   * Class definition must be placed in global styles.scss
   * because of angular view encapsulation
   */
   backdropClass?: string;

  /** How to show the navigational buttons in image overlay. */
  overlayButtonsStyle?: ElementDisplayStyle;
}
