import 'cypress-real-events/support';

describe('Demo page - base page', () => {
  beforeEach(() => {
    // Open page under inspection
    cy.visit('/');
  });

  it('contains all relevant elements', () => {
    cy.get('h1').contains('Demo project for mat-image-overlay');

    cy.get('img[height="100"]').should('have.length', 9);
    cy.get('img.image-link').should('have.length', 9);

    cy.get('[data-cy=demo-1]').should('be.visible');
    cy.get('[data-cy=demo-1-action]').should('be.visible');
    cy.get('[data-cy=open-demo-1-show]')
      .should('be.visible')
      .contains('show external navigation');

    cy.get('[data-cy=demo-2]').should('be.visible');
    cy.get('[data-cy=demo-2-action]').should('be.visible');
    cy.get('[data-cy=open-demo-2-show]')
      .should('be.visible')
      .contains('show external navigation');

    cy.get('[data-cy=open-min-config]').should('be.visible');
    cy.get('[data-cy=demo-3-action]').should('be.visible');
    cy.get('[data-cy=open-demo-3]')
      .should('be.visible')
      .contains('Open first image in overlay');

    cy.get('.form-field').should('have.length', 4);
  });

  it('shows image with specific source as first image for demo 1', () => {
    cy.get('div[data-cy=demo-1] img')
      .first()
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/30/1024/768');
  });

  it('shows image with specific source as second image for demo 2', () => {
    cy.get('div[data-cy=demo-2] img:nth-child(2)')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/1014/100/100');
  });
});

describe('Demo page - demo 1', () => {
  beforeEach(() => {
    // Open page under inspection
    cy.visit('/');
  });

  it('shows overlay clicking on first image', () => {
    // Show first image of demo 1 as overlay
    cy.get('div[data-cy=demo-1] img:first-child').click();
    cy.get('.cdk-overlay-container').should('be.visible');

    cy.get('img.plain-image[data-loaded="true"]')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/30/1024/768');
  });

  it('shows overlay clicking on third image', () => {
    // Show third image of demo 1 as overlay
    cy.get('div[data-cy=demo-1] img:nth-child(3)').click();
    cy.get('.cdk-overlay-container').should('be.visible');

    cy.get('img.plain-image[data-loaded="true"]')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/63/1800/1600');
  });

  it('shows overlay clicking on link below the images', () => {
    // Show first image as overlay
    cy.get('[data-cy=open-demo-1-show]').click();
    cy.get('.cdk-overlay-container').should('be.visible');

    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/30/1024/768');
  });

  it('switches to 3rd image in overlay with arrow keys', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // show next image
    cy.get('body').type('{rightarrow}');
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/201/800/600');

    // show next image
    cy.get('body').type('{rightarrow}');
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/63/1800/1600');
  });

  it('switches to 3rd image in overlay with buttons', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Hover to image to show buttons
    cy.get('img.overlay-image.plain-image')
      .realHover();
    cy.get('.overlay-button.overlay-button-right').should('be.visible');

    // Click 'next' button twice
    cy.get('.overlay-button.overlay-button-right').click();
    cy.get('.overlay-button.overlay-button-right').click();

    // Correct image should be visible
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/63/1800/1600');
  });

  it('closes overlay with close button', () => {
    // Open overlay
    cy.get('img').first().click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Hover to image to show buttons
    cy.get('img.overlay-image.plain-image')
      .realHover();

    // click 'close' button to hide overlay
    cy.get('.overlay-button.overlay-button-close')
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
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/201/800/600');

    // Type esc character
    cy.get('body').type('{esc}');
    cy.get('.cdk-overlay-container').should('not.be.visible');
  });
});

describe('Demo page - demo 2', () => {
  it('shows first image when clicking on first image', () => {
    // Open page under inspection
    cy.visit('/');

    // Show first image of demo 1 as overlay
    cy.get('div[data-cy=demo-2] img:first-child').click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Show thumbnail
    cy.get('img.thumbnail-image[data-loaded="true"]')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/1000/155/100');

    // Show main image
    cy.get('img.main-image[data-loaded="true"]')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/1000/1548/1000');
  });

  it('shows external navigation in overlay clicking on link below the images', () => {
    let spy: Cypress.Omit<sinon.SinonSpy<Console[], Console>, 'withArgs'> & Cypress.SinonSpyAgent<sinon.SinonSpy<Console[], Console>> & sinon.SinonSpy<Console[], Console>;

    Cypress.on('window:before:load', (win) => {
      spy = cy.spy(win.console, 'log');
    });

    // Open page under inspection
    cy.visit('/');

    // Show first image as overlay
    cy.get('[data-cy=open-demo-2-show]').click();
    cy.get('.cdk-overlay-container').should('be.visible');

    // Wait for overlay to close
    cy.get('.cdk-overlay-container', {timeout: 20000}).should('not.be.visible');

    // Check console output
    cy.then(() => {
      const calls = spy.getCalls();
      expect(calls.length).to.eq(22);
      expect(calls[1].args).to.deep.eq(['MatImageOverlay opened']);

      // Extract the strings logged by 'image changed' events
      const imageChangeLogs = calls
        .map(sinonEntry => String(sinonEntry.lastArg))
        .filter(stringEntry => stringEntry.startsWith('image changed;') || stringEntry.startsWith('MatImageOverlay closed;'));
      expect(imageChangeLogs.length).to.eq(9);
      expect(imageChangeLogs).to.eql(demo2ExpectedExternalNavigationLogs);
    });
  });
});

describe('Demo page - demo 3', () => {
  beforeEach(() => {
    // Open page under inspection
    cy.visit('/');
  });

  it('shows first image when clicking demo 3 image', () => {
    cy.get('img[src="assets/minimalConfigDemo.jpg"]')
      .click();

    // Show first image as overlay
    cy.get('.cdk-overlay-container').should('be.visible');
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/30/1024/768');
  });

  it('shows overlay clicking on link below demo 3 image', () => {
    cy.get('[data-cy=open-demo-3]').click();

    // Show first image as overlay
    cy.get('.cdk-overlay-container').should('be.visible');
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/30/1024/768');
  });

  it('switches to 3rd image in overlay', () => {
    // Open overlay
    cy.get('[data-cy=open-demo-3]').click();

    // Goto next image with navigation key
    cy.get('body').type('{rightarrow}');
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/201/800/600');

    // Hover to image to show buttons
    cy.get('img.overlay-image.plain-image')
      .realHover();
    cy.get('.overlay-button.overlay-button-right').should('be.visible');

    // Click 'next' button
    cy.get('.overlay-button.overlay-button-right').click();

    // Correct image should be visible
    cy.get('img.overlay-image.plain-image')
      .should('have.attr', 'src')
      .should('include', 'https://picsum.photos/id/63/1800/1600');
  });

  it('closes overlay with esc key', () => {
    // Open overlay
    cy.get('[data-cy=open-demo-3]').click();

    // Type esc character
    cy.get('body').type('{esc}');
    cy.get('.cdk-overlay-container').should('not.be.visible');
  });
});

const demo2ExpectedExternalNavigationLogs = [
  'image changed; new index=0',
  'image changed; new index=1',
  'image changed; new index=2',
  'image changed; new index=3',
  'image changed; new index=2',
  'image changed; new index=3',
  'image changed; new index=1',
  'image changed; new index=0',
  'MatImageOverlay closed; last index=0'
];
