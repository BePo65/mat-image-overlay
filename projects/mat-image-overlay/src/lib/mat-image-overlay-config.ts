export class MatImageOverlayConfig {
  /** Custom class(es) for the overlay panel. */
  panelClass?: string | string[] = '';

  /** Custom class(es) for the backdrop. */
  backdropClass?: string | undefined = '';

  /** List of images to be displayed. */
  images?: string[] = [];

  /** Index of image to be displayed when initializing image overlay. */
  startImageIndex? = 0;
}
