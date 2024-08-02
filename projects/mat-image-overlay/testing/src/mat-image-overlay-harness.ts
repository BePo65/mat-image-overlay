import { AsyncFactoryFn, ContentContainerComponentHarness, TestElement, TestKey } from '@angular/cdk/testing';

/** Harness for interacting with a standard `MatImageOverlay` in tests. */
export class MatImageOverlayHarness extends ContentContainerComponentHarness {
  /** The selector for the host element of a `MatImageOverlay` instance. */
  static hostSelector = '.mat-image-overlay-container';

  protected buttonClose: AsyncFactoryFn<TestElement> = this.locatorFor('button.overlay-button-close');
  protected buttonPrevious: AsyncFactoryFn<TestElement> = this.locatorFor('button.overlay-button-left');
  protected buttonNext: AsyncFactoryFn<TestElement> = this.locatorFor('button.overlay-button-right');
  protected figure: AsyncFactoryFn<TestElement> = this.locatorFor('figure');
  protected description: AsyncFactoryFn<TestElement> = this.locatorFor('figcaption');
  protected image: AsyncFactoryFn<TestElement> = this.locatorFor('img');
  protected backdrop: AsyncFactoryFn<TestElement> = this.locatorFor('.cdk-overlay-backdrop');
  protected wrapper: AsyncFactoryFn<TestElement> = this.locatorFor('.overlay-wrapper');

  /**
   * Gets a flag that is true, when the image overlay is visible.
   * @returns true, if the image overlay is visible
   */
  async overlayIsLoaded(): Promise<boolean> {
    let result = false;

    try {
      const wrapper = await this.wrapper();
      result = (wrapper !== undefined);
    } catch {
      // Promise throws when 'wrapper' element does not exist; use default value
    }

    return result;
  }

  /**
   * Closes the image overlay by pressing escape.
   * @returns Promise that resolves when the action completes
   */
  async close(): Promise<void> {
    const wrapper = await this.wrapper();
    await wrapper.sendKeys(TestKey.ESCAPE);
  }

  /**
   * Closes the image overlay by clicking the backdrop of the image overlay.
   * @returns Promise that resolves when the action completes
   */
   async clickBackdrop(): Promise<void> {
    const backdrop = await this.backdrop();
    await backdrop.click();
  }

  /**
   * Gets a flag that is true, when the 'close' button is visible.
   * @returns true, if the 'close' button is visible
   */
  async buttonCloseVisible(): Promise<boolean> {
    let result = false;

    try {
      const figureIsHovering = await this.figureIsHovering();
      const buttonCloseTestElement = await this.buttonClose();
      const buttonShowAlways = await buttonCloseTestElement.hasClass('show-always');
      const buttonShowOnHover = await buttonCloseTestElement.hasClass('show-on-hover');
      result = (buttonShowAlways || (buttonShowOnHover && figureIsHovering));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
      // Promise throws when 'wrapper' element does not exist; use default value
    }

    return result;
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
   * Gets a flag that is true, when the description of the image is visible (tag 'figcaption').
   * @returns true, if description is visible
   */
   async descriptionVisible(): Promise<boolean> {
    let result = false;

    try {
      const figureIsHovering = await this.figureIsHovering();
      const descriptionTestElement: TestElement = await this.description();
      const descriptionShowAlways = await descriptionTestElement.hasClass('show-always');
      const descriptionShowOnHover = await descriptionTestElement.hasClass('show-on-hover');

      result = (descriptionShowAlways || (descriptionShowOnHover && figureIsHovering));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
      // Promise throws when 'figcaption' is hidden by *ngIf -> use default value
    }

    return result;
  }

  /**
   * Clicks the 'close overlay' button in image overlay.
   * @returns Promise that resolves when the action completes
   */
  async clickCloseButton(): Promise<void> {
    const button = await this.buttonClose();
    await button.click();
  }

  /**
   * Clicks the 'goto previous image' button in image overlay.
   * @returns Promise that resolves when the action completes
   */
  async clickPreviousButton(): Promise<void> {
    const button = await this.buttonPrevious();
    await button.click();
  }

  /**
   * Clicks the 'goto next image' button in image overlay.
   * @returns Promise that resolves when the action completes
   */
  async clickNextButton(): Promise<void> {
    const button = await this.buttonNext();
    await button.click();
  }

  /**
   * Sets the figure tag of the overlay into the hover state.
   * @returns Promise that resolves when the action completes
   */
  async figureHover(): Promise<void> {
    const figure = await this.figure();
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
   * Clicks the img tag of the overlay (the current image).
   * @returns Promise that resolves when the action completes
   */
   async clickImage(): Promise<void> {
    const image = await this.image();
    await image.click();
  }

  /**
   * Send keys to the overlay.
   * @param keys - comma separated list of keys to be sent
   * @returns Promise that resolves when the action completes
   */
  async sendKeys(...keys: (string | TestKey)[]): Promise<void> {
    const figure = await this.figure();
    await figure.sendKeys(...keys);
  }

  /**
   * Gets a flag that is true, when the backdrop contains the given css class.
   * @param classname - name of the css class to be evaluated
   * @returns true, if backdrop contains the given css class
   */
  async hasBackdropClass(classname: string): Promise<boolean> {
    const backdrop = await this.backdrop();
    return await backdrop.hasClass(classname);
  }

  /**
   * Css value 'visibility' of a tag is only set on page load. When using a css rule for e.g. the
   * buttons with figure:hover, harness.getCssValue() does not represent the visibility of the button.
   * Therefore we use a hack with 'figureHovering' in overlay component and events in template.
   * @returns true if the figure tag of the overlay is hovered
   */
  private async figureIsHovering(): Promise<boolean> {
    const figure = await this.figure();
    return await figure.hasClass('hovering');
  }
}
