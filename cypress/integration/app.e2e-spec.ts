import "cypress-real-events/support";
import { forEach } from "cypress/types/lodash";

describe('Demo page', () => {
  beforeEach(() => {
    // Open page under inspection
    cy.visit('/');
  });

  it('contains all relevant elements', () => {
    cy.get('img').should('have.length', 4);

    cy.get('.actions').contains(/Click on one of the images above or open the overlay here/);
    cy.get('[data-cy=open-overlay]').should('be.visible');
  })

  it('shows image with specific source as first image', () => {
    cy.get('img')
      .first()
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23618-1024x768.jpg');
  })

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

  it('switches to 3rd image in overlay', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // show next 2 images
    cy.get('body').type('{rightarrow}{rightarrow}');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23794-800x600.jpg');
  });

  it('closes overlay with button', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Show next image
    cy.get('body').type('{rightarrow}');
    cy.get('img.mat-image-overlay-image')
      .should('have.attr', 'src')
      .should('include', 'https://www.jpl.nasa.gov/spaceimages/images/wallpaper/PIA23761-800x600.jpg');

    // Hover to image to show buttons and click close button
    cy.get('.mat-image-overlay-close')
      .realHover()
      .should('be.visible')
      .click();
    cy.get('.cdk-overlay-container').should('not.be.visible');
  });

  it('closes overlay with esc character', () => {
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
})
