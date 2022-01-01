export class MatImageOverlayConfig {
  /** Custom class(es) for the overlay panel. */
  panelClass?: string | string[] = '';

  /** Whether the image overlay has a background. */
  hasBackdrop? = true;

  /** Custom class(es) for the backdrop. */
  backdropClass?: string | undefined = '';

  /** Whether the image overlay can be closed by user interaction. */
  disableClose? = false;

  /** List of images to be displayed. */
  images?: string[] = [];

  /** Index of image to be displayed when initializing image overlay. */
  startImageIndex? = 0;
}
