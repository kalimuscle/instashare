import { faker } from '@faker-js/faker';
const baseURL = 'http://localhost:5000/api/v1';

describe('Download file Form Test', () => {
  const testUser = {
      email: 'test@example.com',
      password: 'TestPass123!',
    };
  
    beforeEach(() => {
      // Start from homepage and navigate to signup
      cy.visit('http://localhost:3000/signin');
      cy.url().should('eq', 'http://localhost:3000/signin');

      cy.url().should('include', '/signin');

      // Fill out the form
  
      cy.get('input[name="email"]')
          .should('be.visible')
          .type(testUser.email)
          .should('have.value', testUser.email);
  
      cy.get('input[name="password"]')
          .should('be.visible')
          .type(testUser.password)
          .should('have.value', testUser.password);

      //Intercepts request
      cy.intercept('POST', `${baseURL}/auth/signin`).as('signinRequest');

      
          // Submit form
      cy.get('form').submit();
          // Wait request return successfully
      cy.wait('@signinRequest').its('response.statusCode').should('eq', 200);

      cy.url().should('eq', 'http://localhost:3000/authorized');

      cy.visit('http://localhost:3000/authorized');
      
    });

  it('download file , fills the form, and submits it', () => {
    // Verifica que el botón para abrir el modal esté presente
    cy.get(".download").should('exist');

    // Haz clic en el botón para abrir el modal

    cy.get(".download").click();
  });
});