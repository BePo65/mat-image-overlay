import 'cypress-real-events/support';

describe('Demo page', () => {
  beforeEach(() => {
    // Open page under inspection
    cy.visit('/');
  });

  it('contains all relevant elements', () => {
    cy.get('img.image-link').should('have.length', 5);

    cy.get('.actions')
    .filter('[data-cy=basic-action]')
    .contains(/Click on one of the images above or open the overlay here/);
    cy.get('[data-cy=open-overlay]').should('be.visible');

    cy.get('img[height="100"]').should('have.length', 9);

    cy.get('.actions')
    .filter('[data-cy=start-show]')
    .contains(/Show external navigation/);
    cy.get('[data-cy=start-auto-mode]').should('be.visible');
  });

  it('shows image with specific source as first image', () => {
    cy.get('img')
      .first()
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg');
  });

  it('shows overlay clicking on first image', () => {
    // Show first image as overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg');
  });

  it('shows overlay clicking on link', () => {
    // Show first image as overlay
    cy.get('[data-cy=open-overlay]').click();
    cy.get('.cdk-overlay-container').should('be.visible');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg');
  });

  it('switches to 3rd image in overlay with arrow keys', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // show next 2 images
    cy.get('body').type('{rightarrow}');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg');

    cy.get('body').type('{rightarrow}');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg');
  });

  it('switches to 3rd image in overlay with buttons', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Hover to image to show buttons
    cy.get('img.mat-image-overlay-image')
      .realHover();
    cy.get('.mat-image-overlay-button-right').should('be.visible');

    // Click 'next' button twice
    cy.get('.mat-image-overlay-button-right').click();
    cy.get('.mat-image-overlay-button-right').click();

    // Correct image should be visible
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg');
  });

  it('closes overlay with close button', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Hover to image to show buttons
    cy.get('img.mat-image-overlay-image')
      .realHover();

    // click 'close' button to hide overlay
    cy.get('.mat-image-overlay-button-close')
      .should('be.visible')
      .click();
    cy.get('.cdk-overlay-container').should('not.be.visible');
  });

  it('closes overlay with esc key', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // show next image
    cy.get('body').type('{rightarrow}');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg');

    // Type esc character
    cy.get('body').type('{esc}');
    cy.get('.cdk-overlay-container').should('not.be.visible');
  });
});
