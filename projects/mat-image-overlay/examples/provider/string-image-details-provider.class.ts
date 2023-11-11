import { MatImageDetailsProvider } from 'mat-image-overlay';

export class StringSourceImageDetailsProvider extends MatImageDetailsProvider {
  private images: string[] = [];

  get numberOfImages() {
    return this.images.length;
  }

  constructor(images: string[]) {
    super();
    if (images && Array.isArray(images)) {
      this.images = images;
    } else {
      throw new Error('The parameter "images" must be an array of strings.');
    }
  }

  override urlForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      return this.images[imageIndex];
    } else {
      throw new Error(`Index for image ('${imageIndex}') out of range.`);
    }
  }

  override descriptionForImage(imageIndex: number): string {
    if (+imageIndex < this.numberOfImages) {
      return `file name: ${this.images[imageIndex]}`;
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
