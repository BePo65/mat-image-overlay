import { AsyncFactoryFn, ContentContainerComponentHarness, ModifierKeys, TestElement, TestKey } from '@angular/cdk/testing';

/** Harness for interacting with a standard `MatImageOverlay` in tests. */
export class MatImageOverlayHarness extends ContentContainerComponentHarness {
  /** The selector for the host element of a `MatImageOver` instance. */
  static hostSelector = '.mat-image-overlay-wrapper';

  protected buttonClose: AsyncFactoryFn<TestElement> = this.locatorFor('button.mat-image-overlay-button-close');
  protected buttonPrevious: AsyncFactoryFn<TestElement> = this.locatorFor('button.mat-image-overlay-button-left');
  protected buttonNext: AsyncFactoryFn<TestElement> = this.locatorFor('button.mat-image-overlay-button-right');
  protected figure: AsyncFactoryFn<TestElement> = this.locatorFor('figure');
  protected description: AsyncFactoryFn<TestElement> = this.locatorFor('figcaption');
  protected image: AsyncFactoryFn<TestElement> = this.locatorFor('img');

  /**
   * Closes the image overlay by pressing escape.
   */
  async close(): Promise<void> {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }

  /**
   * Gets a flag that is true, when the 'close' button is visible.
   * @returns true, if 'close' button is visible
   */
  async buttonCloseVisible(): Promise<boolean> {
    const figureIsHovering = await this.figureIsHovering();
    const buttonCloseTestElement = await this.buttonClose();
    const buttonShowAlways = await buttonCloseTestElement.hasClass('show-always');
    const buttonShowOnHover = await buttonCloseTestElement.hasClass('show-on-hover');

    return (buttonShowAlways || (buttonShowOnHover && figureIsHovering));
  }

  /**
   * Gets a flag that is true, when the 'previous' button is visible.
   * @returns true, if 'previous' button is visible
   */
  async buttonPreviousVisible(): Promise<boolean> {
    let result = false;

    try {
      const figureIsHovering = await this.figureIsHovering();
      const buttonPreviousTestElement = await this.buttonPrevious();
      const buttonShowAlways = await buttonPreviousTestElement.hasClass('show-always');
      const buttonShowOnHover = await buttonPreviousTestElement.hasClass('show-on-hover');

      result = (buttonShowAlways || (buttonShowOnHover && figureIsHovering));
    } catch {
      // Promise throws when 'previous' button is hidden by *ngIf -> use default value
    }

    return result;
  }

  /**
   * Gets a flag that is true, when the 'next' button is visible.
   * @returns true, if 'next' button is visible
   */
  async buttonNextVisible(): Promise<boolean> {
    let result = false;

    try {
      const figureIsHovering = await this.figureIsHovering();
      const buttonNextTestElement = await this.buttonNext();
      const buttonShowAlways = await buttonNextTestElement.hasClass('show-always');
      const buttonShowOnHover = await buttonNextTestElement.hasClass('show-on-hover');

      result = (buttonShowAlways || (buttonShowOnHover && figureIsHovering));
    } catch {
      // Promise throws when 'next' button is hidden by *ngIf -> use default value
    }

    return result;
  }

  /**
   * Gets a flag that is true, when the description is visible (tag 'figcaption').
   * @returns true, if description is visible
   */
   async descptionVisible(): Promise<boolean> {
    let result = false;

    try {
      const figureIsHovering = await this.figureIsHovering();
      const descriptionTestElement: TestElement = await this.description();
      const descriptionShowAlways = await descriptionTestElement.hasClass('show-always');
      const descriptionShowOnHover = await descriptionTestElement.hasClass('show-on-hover');

      result = (descriptionShowAlways || (descriptionShowOnHover && figureIsHovering));
    } catch (err) {
      // Promise throws when 'figcaption' is hidden by *ngIf -> use default value
    }

    return result;
  }

  /**
   * Clicks the 'close overlay' button in image overlay.
   * @returns empty promise
   */
  async clickCloseButton(): Promise<void> {
    const button = await this.buttonClose();
    await button.click();
  }

  /**
   * Clicks the 'goto previous image' button in image overlay.
   * @returns empty promise
   */
  async clickPreviousButton(): Promise<void> {
    const button = await this.buttonPrevious();
    await button.click();
  }

  /**
   * Clicks the 'goto next image' button in image overlay.
   * @returns empty promise
   */
  async clickNextButton(): Promise<void> {
    const button = await this.buttonNext();
    await button.click();
  }

  /**
   * Sets the figure tag of the overlay into the hover state.
   * @returns empty promise
   */
  async figureHover(): Promise<void> {
    const figure = await this.host();
    await figure.hover();
  }

  /**
   * Gets the src attribute of the img tag of the overlay (the url of the image).
   * @returns url of the image or empty string
   */
   async imageUrl(): Promise<string> {
    const image = await this.image();
    const url = await image.getAttribute('src');
    return url ?? '';
  }

  /**
   * Send keys to the overlay.
   * @param keys - comma separated list of keys to be sent
   * @returns empty promise
   */
  async sendKeys(...keys: (string | TestKey)[]): Promise<void> {
    const imageOverlay = await this.host();
    await imageOverlay.sendKeys(...keys);
  }

  /**
   * Send keys with modifier key (shift, control, alt, meta) to the overlay.
   * @param modifiers - modifier key (shift, control, alt, meta)
   * @param keys - comma separated list of keys to be sent
   * @returns empty promise
   */
  async sendKeysWithModifiers(modifiers?: ModifierKeys, ...keys: (string | TestKey)[]): Promise<void> {
    const imageOverlay = await this.host();
    if (modifiers) {
      await imageOverlay.sendKeys(modifiers, ...keys);
    } else {
      await imageOverlay.sendKeys(...keys);
    }
  }

  /**
   * Css value 'visibility' of a tag is only set on page load. When using a css rule for e.g. the
   * buttons with figure:hover, harness.getCssValue() does not represent the visibility of the button.
   * Therefore we use a hack with 'figureHovering' in overlay component and events in template.
   * @returns true if the figure tag of the overlay is hovered
   */
  private async figureIsHovering(): Promise<boolean> {
    const figureTestElement = await this.host();
    return await figureTestElement.hasClass('hovering');
  }
}
