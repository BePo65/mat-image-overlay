/**
 * Abstract class that provides details about an image to be displayed
 * by this project.
 */
export abstract class MatImageDetailsProvider {
  /**
   * Number of available images.
   */
  abstract readonly numberOfImages: number;

  /**
   * Get the URL for an image from a supposed array of images.
   * @param imageIndex - index of the image to get the url for (0-based)
   * @returns the URL of the image
   */
  abstract urlForImage(imageIndex: number): string;

  /**
   * Get the description for an image from a supposed array of images.
   * @param imageIndex - index of the image to get the url for (0-based)
   * @returns the description of the image
   */
  abstract descriptionForImage(imageIndex: number): string;

  /**
   * Get a record that contains information about the image.
   * The object returned is e.g. part of the data returned by the
   * imageClicked event.
   * @param imageIndex - index of the image to get the url for (0-based)
   * @returns object containing information about the image
   */
  abstract imageInformation(imageIndex: number): Record<string, unknown> ;
}
