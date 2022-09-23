Cypress.Commands.add("resetDatabase", () => {
	cy.request("POST", "http://localhost:5000/recommendations/reset-database");
});
Cypress.Commands.add("populate", () => {
  cy.request("POST", "http://localhost:5000/recommendations/seed");
});

const frontUrl = "http://localhost:3000"
const backUrl="http://localhost:5000/recommendations"

beforeEach(() => {
	cy.resetDatabase();
  
});

describe('GET /', () => {
  it('Expect to ger returned the last ten recommendations', () => {
     cy.populate();
   
  
      cy.visit(`${frontUrl}/`);

      cy.intercept("GET", backUrl).as("recommendations");

      cy.request("GET",backUrl);

      cy.wait("@recommendations").then(interception => {
        const statusCode= interception.response.statusCode
        expect(interception.response.body.length).to.be.below(11);
          expect(statusCode).eq(200);
      });
  });
});