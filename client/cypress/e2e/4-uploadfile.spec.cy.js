const baseURL = 'http://localhost:5000/api/v1';
describe('Upload file Form Test', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'TestPass123!',
      };
    
      beforeEach(async() => {
        cy.log(baseURL)
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

        cy.log("sign in successful")

        // cy.url().should('eq', 'http://localhost:3000/authorized');

        cy.visit('http://localhost:3000/authorized');
        
      });
  
    it('opens the modal, fills the form, and submits it', () => {
      cy.get("#shareFileBtn").should('exist').and('be.visible');
  
      // Check button edit exist and visible
      cy.get("#shareFileBtn").click();
  
      // Check is open modal
      cy.get('#staticModal').should('be.visible');
  
      //Fill form
      cy.get('input[name="name"]').type('Rome, the history');
      
      cy.get('input[type="file"]').should('exist');
      const fileName = 'example.txt';
      cy.fixture(fileName).then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: fileName,
          mimeType: 'text/plain',
        });
      });

      //Intercepts request
      cy.intercept('POST', `${baseURL}/files/upload`).as('fileUploadRequest');
  
      // Submit form
      cy.get('form').submit();

       // Wait request return successfully
       cy.wait('@fileUploadRequest').its('response.statusCode').should('eq', 201);

       cy.get("#modal-close-btn").should('exist').and('be.visible');
  
       // Close modal
       cy.get("#modal-close-btn").click();
    });
  });