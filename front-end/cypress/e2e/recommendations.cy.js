Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "http://localhost:5000/recommendations/reset-database");
});
Cypress.Commands.add("populate", () => {
  cy.request("POST", "http://localhost:5000/recommendations/seed");
});

const frontUrl = "http://localhost:3000";
const backUrl = "http://localhost:5000/recommendations";

beforeEach(() => {
  cy.resetDatabase();
});

describe("POST /", () => {
  it("Expect to create a recommendation", () => {
    cy.visit(`${frontUrl}/`);

      cy.get('[data-test-id="test-input-name"]').type("eae fiii");
    cy.get('[data-test-id="test-input-youtube"]').type("https://www.youtube.com/watch?v=37SwqREHRGI");

    cy.intercept("POST", backUrl).as("recommendationsPost");

    cy.get('[data-test-id="test-button-create"]').click();

    cy.wait("@recommendationsPost").then((interception) => {
      const statusCode = interception.response.statusCode;
      expect(statusCode).eq(201);
    });
  });
});


describe("GET /", () => {
  it("Expect to return the last ten recommendations", () => {
    cy.populate();

    cy.visit(`${frontUrl}/`);

    cy.intercept("GET", backUrl).as("recommendations");

    

    cy.request("GET", backUrl);

    cy.wait("@recommendations").then((interception) => {
      const statusCode = interception.response.statusCode;
      const body = interception.response.body.length;
      expect(body).to.be.below(11);
      expect(statusCode).eq(200);
    });
  });
});

describe("GET /top", () => {
  it("Expect to return the ten highest score recommendations", () => {
    cy.visit(`${frontUrl}/`);
    cy.populate();

    cy.intercept("GET", `${backUrl}/top/10`).as("top-recommendations");

    cy.get('[data-test-id="test-top-recommendations"]').click();

    cy.request("GET", `${backUrl}/top/10`);

    cy.wait("@top-recommendations").then((interception) => {
      const statusCode = interception.response.statusCode;
      const body = interception.response.body.length;
      expect(body).to.be.below(11);
      expect(statusCode).eq(200);
    });
  });
});

describe("GET /random", () => {
  it("Expect to return the ten highest score recommendations", () => {
    cy.visit(`${frontUrl}/`);
    cy.populate();

    cy.intercept("GET", `${backUrl}/random`).as("random-recommendation");

    cy.get('[data-test-id="test-random-recommendations"]').click();

    cy.request("GET", `${backUrl}/random`);

    cy.wait("@random-recommendation").then((interception) => {
      const statusCode = interception.response.statusCode;
      expect(statusCode).eq(200);
    });
  });
});