// cypress/e2e/signup.cy.js
const baseURL = 'http://localhost:5000/api/v1';

describe('Signin Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'TestPass123!',
    };
  
    beforeEach(() => {
      // Start from homepage and navigate to signin
      cy.visit('http://localhost:3000');
      cy.url().should('eq', 'http://localhost:3000/');
      
      // Navigate to signup page
      cy.visit('http://localhost:3000/signin');
      cy.url().should('include', '/signin');
    });
  
    it('should fill and submit signin form successfully', () => {
      // Check if we're on the signin page
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

      cy.get("#signOut").should("be.visible").and("not.be.disabled").click(); // Por ID

      cy.url().should('eq', 'http://localhost:3000/signin');
 
    });
  
  });