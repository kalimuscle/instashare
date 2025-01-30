// cypress/e2e/signup.cy.js
const baseURL = 'http://localhost:5000/api/v1';
describe('Signup Flow', () => {
    const testUser = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!'
    };
  
    beforeEach(() => {
      // Start from homepage and navigate to signup
      cy.visit('http://localhost:3000');
      cy.url().should('eq', 'http://localhost:3000/');
      
      // Navigate to signup page
      cy.visit('http://localhost:3000/signup');
      cy.url().should('include', '/signup');
    });
  
    it('should fill and submit signup form successfully', () => {
      // Check if we're on the signup page
      cy.url().should('include', '/signup');
  
      // Fill out the form
      cy.get('input[name="username"]')
        .should('be.visible')
        .type(testUser.username)
        .should('have.value', testUser.username);
  
      cy.get('input[name="email"]')
        .should('be.visible')
        .type(testUser.email)
        .should('have.value', testUser.email);
  
      cy.get('input[name="password"]')
        .should('be.visible')
        .type(testUser.password)
        .should('have.value', testUser.password);
  
      cy.get('input[name="confirmPassword"]')
        .should('be.visible')
        .type(testUser.confirmPassword)
        .should('have.value', testUser.confirmPassword);
  
      // Submit form
      cy.get('form').submit();

       //Intercepts request
      cy.intercept('POST', `${baseURL}/auth/signup`).as('signupRequest');

    
       // Submit form
      cy.get('form').submit();

      // Wait request return successfully
      cy.wait('@signupRequest').its('response.statusCode').should('eq', 201);

      cy.url().should('eq', 'http://localhost:3000/verify');
    });

  });