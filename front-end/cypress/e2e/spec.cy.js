

const URL = "http://localhost:3000"
const backUrl="http://localhost:6000/recommendations/"

describe('GET /', () => {
  it('Expect to ger returned the last ten recommendations', () => {
      cy.visit(`${URL}/`);

      cy.intercept("GET", backUrl).as("recommendations");

      cy.request("GET",backUrl);

      cy.wait("@recommendations").then(interception => {
          expect(interception.response.body.length).to.be.below(11);
          expect(interception.response.statusCode).eq(200);
      });
  });
});