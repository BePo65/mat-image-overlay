export class MatImageOverlayConfig {
  /** List of images to be displayed. */
  images: string[] = [];

  /** Index of image to be displayed when initializing image overlay. */
  startImageIndex?: number;

  /** Custom class(es) for the backdrop.
   * class definition must be placed in global styles.scss
   * because of angular view encapsulation
   */
   backdropClass?: string | undefined;
  }
