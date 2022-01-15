export enum ElementDisplayStyle {
  never,
  onHover,
  always
}

export interface MatImageOverlayConfig {
  /** List of images to be displayed. */
  images: unknown[];

  /**
   * Get the URL for an image from the given entry of images array.
   * The default implementation expects images to be an array of strings.
   * @param imageData - an entry from the 'images' array
   * @param baseUrl - optional url fragment to be used for building the image url
   * @returns the URL of the image
   */
   urlForImage?: (imageData: unknown, baseUrl?: string) => string;

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

  /** How to show the navigational buttons in the image overlay. */
  overlayButtonsStyle?: ElementDisplayStyle;

  /** How to show the description property in the image overlay. */
  descriptionDisplayStyle?: ElementDisplayStyle;
}
