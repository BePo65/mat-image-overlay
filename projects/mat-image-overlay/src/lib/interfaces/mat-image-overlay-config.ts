export enum ElementDisplayStyle {
  never,
  onHover,
  always
}

export enum ElementDisplayPosition {
  left,
  right
}

export interface MatImageOverlayConfig {
  /** List of images to be displayed. */
  images: unknown[];

  /**
   * Get the URL for an image from the given entry of images array.
   * The default configuration expects 'images' to be an array of strings.
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

  /**
   * Get the description for an image from the given entry of images array.
   * The default configuration expects 'images' to be an array of strings.
   * @param imageData - an entry from the 'images' array
   * @param configuration - object containing configuration data for the 'descriptionForImage' function
   * @returns the description of the image
   */
  descriptionForImage?: (imageData: unknown, configuration?: object) => string;

  /**
   * Configuration data for the 'descriptionForImage' function.
   */
  descriptionForImageConfiguration?: object;

  /** How to show the description property in the image overlay. */
  descriptionDisplayStyle?: ElementDisplayStyle;

  /** Where to show the description property in the image overlay when 'onHover'. */
  descriptionDisplayPosition?: ElementDisplayPosition;

  /**
   * EventHandler to be called, when image in overlay is clicked.
   * @param imageData - entry from the 'images' array for the current image
   * @param configuration - object containing configuration data for the 'imageClickHandler'
   */
  imageClickHandler?: (imageData: unknown, configuration?: object) => void;

  /**
   * Configuration data for the imageClickHandler.
   */
  imageClickHandlerConfiguration?: object;
}
