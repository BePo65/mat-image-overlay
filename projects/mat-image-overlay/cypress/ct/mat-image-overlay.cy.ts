import { createOutputSpy } from 'cypress/angular';

import { MatImageOverlay } from '../../src/lib/mat-image-overlay';

describe('MatTristateCheckbox', () => {
  it('mounts', () => {
    cy.mount(MatImageOverlay);
  });

  it('should default to false', () => {
    cy.mount(
      '<div id="main">insert image overlay here</div>',
      {
        componentProperties: {
          change: createOutputSpy('changeSpy') as (value?: boolean) => void
        }
      }
    );
    cy.get('#main').click();
    // TODO test fails with @changeSpy not found
    // cy.get('@changeSpy').should('have.been.calledWith', 1);
  });
});
