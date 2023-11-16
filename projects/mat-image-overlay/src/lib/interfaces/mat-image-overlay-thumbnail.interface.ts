/**
 * Interface defining additions to a MatImageDetailsProvider derived class
 * that handles the provisioning of a thumbnail image for an image to be displayed
 * by this project.
 */
export interface ThumbnailProvider {
  /**
   * Height of the thumbnail image in px (must be greater than 0).
   */
  thumbnailHeight: number;

  /**
   * Get the URL for a thumbnail image from a supposed array of images.
   * @param imageIndex - index of the thumbnail to get the url for (0-based)
   * @returns the URL of the thumbnail image
   */
  urlForThumbnail(imageIndex: number): string;
}
