import { MatImageDetailsProvider } from './mat-image-details-provider.class';

export enum ElementDisplayStyle {
  never,
  onHover,
  always
}

export enum ElementDisplayPosition {
  bottomLeft,
  bottomCenter,
  bottomRight,
  topLeft,
  topCenter,
  topRight
}

export interface MatImageOverlayConfig {
  /** Class instance that provides access to detail information about an image */
  imageDetails: MatImageDetailsProvider;

  /** Index of image to be displayed when initializing image overlay. */
  startImageIndex?: number;

  /**
   * Custom class(es) for the backdrop.
   * Class definition must be placed in global styles.scss
   * because of angular view encapsulation
   */
  backdropClass?: string;

  /** Minimal margin (in px) around image */
  margin?: number;

  /** How to show the navigational buttons in the image overlay. */
  overlayButtonsStyle?: ElementDisplayStyle;

  /** How to show the description property in the image overlay. */
  descriptionDisplayStyle?: ElementDisplayStyle;

  /** Where to show the description property in the image overlay when 'onHover'. */
  descriptionDisplayPosition?: ElementDisplayPosition;

  /**
   * Additional dData returned by the imageClicked event. This data is added
   * to the data returned by the method 'imageDetails.imageInformation'.
   */
  imageClickedAdditionalData?: Record<string, unknown>;
}
