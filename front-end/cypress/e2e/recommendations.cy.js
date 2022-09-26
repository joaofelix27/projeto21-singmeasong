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

    const name = "eae fiii";
    const youtubeLink = "https://www.youtube.com/watch?v=37SwqREHRGI";

    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtube"]').type(youtubeLink);

    cy.intercept("POST", backUrl).as("recommendationsPost");

    cy.get('[data-test-id="test-button-create"]').click();

    cy.wait("@recommendationsPost").then((interception) => {
      const statusCode = interception.response.statusCode;
      expect(statusCode).eq(201);
    });
  });

  it("Expect to create a repeated recommendation", () => {
    cy.visit(`${frontUrl}/`);

    const name = "eae fiii";
    const youtubeLink = "https://www.youtube.com/watch?v=37SwqREHRGI";

    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtube"]').type(youtubeLink);

    cy.get('[data-test-id="test-button-create"]').click();

    cy.intercept("POST", backUrl).as("recommendationsPost");

    cy.get('[data-test-id="test-input-name"]').type(name);
    cy.get('[data-test-id="test-input-youtube"]').type(youtubeLink);

    cy.get('[data-test-id="test-button-create"]').click();

    cy.wait("@recommendationsPost").then((interception) => {
      const statusCode = interception.response.statusCode;
      expect(statusCode).eq(409);
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
}); //remember to compare the score between the first one and the lastone

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

describe("GET /:id/upvote", () => {
  it("Expect to upvote the recommendation with the sent id", () => {
    const id = 1;
    cy.visit(`${frontUrl}/top`);
    cy.populate();

    cy.intercept("POST", `${backUrl}/${id}/upvote`).as("upvote");

    cy.get(`[data-test-id="test-upvote-${id}"]`).click();

    cy.request("POST", `${backUrl}/${id}/upvote`);

    cy.wait("@upvote").then((interception) => {
      const statusCode = interception.response.statusCode;
      expect(statusCode).eq(200);
    });
  });
}); //need to do the test when the id doesnt exists

describe("GET /:id/downvote", () => {
  it("Expect to downvote the recommendation with the sent id", () => {
    const id = 1;
    cy.visit(`${frontUrl}/top`);
    cy.populate();

    cy.intercept("POST", `${backUrl}/${id}/downvote`).as("downvote");

    cy.get(`[data-test-id="test-downvote-${id}"]`).click();

    cy.request("POST", `${backUrl}/${id}/downvote`);

    cy.wait("@downvote").then((interception) => {
      const statusCode = interception.response.statusCode;
      expect(statusCode).eq(200);
    });
  });
}); //need to do the test when the id doesnt exists
