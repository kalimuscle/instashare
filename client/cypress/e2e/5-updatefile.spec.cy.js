import { faker } from '@faker-js/faker';
const baseURL = 'http://localhost:5000/api/v1';

describe('Update file Form Test', () => {
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

  it('update file , fills the form, and submits it', async() => {
    // Check button edit exist and visible
    cy.get(".edit").should('exist').and('be.visible');

    // Open modal

    cy.get(".edit").click();

    // Check is open modal
    cy.get('#staticModal').should('be.visible');

    //fill form
    cy.get('input[name="name"]').clear();

    cy.get('input[name="name"]').type(faker.lorem.sentence({min: 1, max: 5}));
    
    //Intercepts request
    cy.intercept('PUT', `${baseURL}/files/update/*`).as('fileUpdateRequest');

    // Submit form
    cy.get('form').submit();

     // Wait request return successfully
    cy.wait('@fileUpdateRequest').its('response.statusCode').should('eq', 200);

    cy.get("#modal-close-btn").should('exist').and('be.visible');

     // Close modal
    cy.get("#modal-close-btn").click();
  });
});