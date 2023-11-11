import { MatImageDetailsProvider } from './interfaces/mat-image-details-provider.class';

export class DefaultImageDetailsProvider extends MatImageDetailsProvider {
  override numberOfImages = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override urlForImage(imageIndex: number): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override descriptionForImage(imageIndex: number): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override imageInformation(imageIndex: number): Record<string, unknown> {
    return {};
  }
}
