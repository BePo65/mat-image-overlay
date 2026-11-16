import { Dimensions, MatImageDetailsProvider, ThumbnailProvider } from 'mat-image-overlay';

export type ImageDetailsObject = {
  id: string;
  width: number
  height: number
  description?: string;
  [otherOptions: string]: unknown;
}

export class ObjectSourceImageDetailsProvider extends MatImageDetailsProvider implements ThumbnailProvider {
  #thumbnailHeight = 30;
  #images: ImageDetailsObject[] = [];
  #baseUrl = '';

  constructor(images: ImageDetailsObject[], baseUrl?: string, thumbnailHeight?: number) {
    super();
    if (images && Array.isArray(images)) {
      this.#images = images;
    } else {
      throw new Error('The parameter "images" must be an array of objects.');
    }

    if (baseUrl && (typeof baseUrl === 'string')) {
      this.baseUrl = baseUrl;
    }

    if (thumbnailHeight && (typeof thumbnailHeight === 'number')) {
      this.#thumbnailHeight = thumbnailHeight;
    }

  }

  // eslint-disable-next-line jsdoc/require-returns
  /** Base url to be used by method 'urlForImage' */
  public get baseUrl(): string {
    return this.#baseUrl;
  }
  public set baseUrl(value: string) {
    // The internal representation of the baseUrl must end with a slash!
    if (value && (typeof value === 'string') && (value.length > 0)) {
      this.#baseUrl = value;
      if (!value.endsWith('/')) {
        this.#baseUrl += '/';
      }
    } else {
      throw new Error(`The baseUrl must be a non-empty string (given value is '${value}')`);
    }
  }

  // 'thumbnailHeight' is readonly!
  public get thumbnailHeight(): number {
    return this.#thumbnailHeight;
  }

  public get numberOfImages(): number {
    return this.#images.length;
  }

  /**
   * Get the width for a thumbnail image from the array of images.
   * @param imageIndex - index of the thumbnail to get the width for (0-based)
   * @returns the width of the thumbnail image
   */
  thumbnailWidth(imageIndex: number): number {
    const imageData = this.#images[imageIndex];
    return Math.round(this.thumbnailHeight / imageData.height * imageData.width);
  }

  /**
   * Get the url for an image from the array of images.
   * This examples uses url for the github pages site of this project:
   * '<baseurl>/<imageId>.jpg'
   * @param imageIndex - index of the image to get the url for (0-based)
   * @returns the url of the image
   */
  override urlForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.#images[imageIndex];
      return `${String(this.baseUrl)}${imageData.id}.jpg`;
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  /**
   * Get the url for a thumbnail image from the array of images.
   * This examples uses url for the github pages site of this project:
   * '<baseurl>/<imageId>_thumb.jpg'
   * @param imageIndex - index of the thumbnail to get the url for (0-based)
   * @returns the url of the thumbnail image
   */
  urlForThumbnail(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.#images[imageIndex];
      return `${String(this.baseUrl)}${imageData.id}_thumb.jpg`;
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  /**
   * Get the description of an image from the array of images.
   * @param imageIndex - index of the image to get the description for (0-based)
   * @returns the description of the image
   */
  override descriptionForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.#images[imageIndex];
      return imageData.description || '';
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  /**
   * Get the dimensions of an image from the array of images.
   * @param imageIndex - index of the image to get the dimensions for (0-based)
   * @returns the dimensions of the image (width and height)
   */
  imageDimensions(imageIndex: number): Dimensions {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.#images[imageIndex];
      const dims: Dimensions = {
        width: imageData.width,
        height: imageData.height
      };
      return dims;
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override imageInformation(imageIndex: number): Record<string, unknown> {
    return {
      imageIndex,
      url: this.urlForImage(imageIndex)
    };
  }
}
