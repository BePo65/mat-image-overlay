import { MatImageDetailsProvider } from 'mat-image-overlay';

export type ImageDetailsObject = {
  id: string;
  width: number;
  height: number;
  description?: string;
  [otherOptions: string]: unknown;
}

export class ObjectSourceImageDetailsProvider extends MatImageDetailsProvider {
  /** Base url to be used by method 'urlForImage' */
  public baseUrl = '';

  private images: ImageDetailsObject[] = [];

  get numberOfImages() {
    return this.images.length;
  }

  constructor(images: ImageDetailsObject[], baseUrl?: string) {
    super();
    if (images && Array.isArray(images)) {
      this.images = images;
    } else {
      throw new Error('The parameter "images" must be an array of objects.');
    }

    if (baseUrl && (typeof baseUrl === 'string')) {
      this.baseUrl = baseUrl;
    }
  }

  override urlForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.images[imageIndex];
      return `${String(this.baseUrl)}${imageData.id}/${String(imageData.width)}/${String(imageData.height)}`;
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override descriptionForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      const imageData = this.images[imageIndex];
      return imageData.description || '';
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
