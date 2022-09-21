import supertest from "supertest";
import app from "../src/app";
import createRecommedations from "./factories/recommendationFactory";
import { deleteAllData } from "./factories/scenarioFactory";
import { prisma } from "../src/database";

const agent = supertest(app);

beforeEach(async () => {
  deleteAllData();
});

describe("Add a new song recommendation", () => {
  it("Try to POST /recommendations with a repeated recommendation name", async () => {
    const recommendation = await createRecommedations();
    await agent.post("/recommendations").send(recommendation);
    const result = await agent.post("/recommendations").send(recommendation);

    expect(result.status).toBe(409);
  });
  it("Try to POST /recommendations with valid data", async () => {
    const recommendation = await createRecommedations();
    const result = await agent.post("/recommendations").send(recommendation);
    const findCreatedRecommendation = await findRecommendation(
      recommendation.name
    );
    expect(findCreatedRecommendation).not.toBeNull();
    expect(result.status).toBe(201);
  });
}); //Insert

describe("upVote a recommendation", () => {
  it("Try to POST /recommendations/:id/upvote with an unvalid id", async () => {
    const result = await agent.post(`/recommendations/2/upvote`);
    expect(result.status).toBe(404);
  });

  it("Try to POST /recommendations/:id/upvote with a valid id", async () => {
    const recommendation = await createRecommedations();
    await agent.post("/recommendations").send(recommendation);
    const findCreatedRecommendation = await findRecommendation(
      recommendation.name
    );
    const result = await agent.post(
      `/recommendations/${findCreatedRecommendation.id}/upvote`
    );
    const updatedRecommendation = await findRecommendation(recommendation.name);
    expect(updatedRecommendation.score).toEqual(1);
    expect(result.status).toBe(200);
  });
}); //upVote

describe("downVote a recommendation", () => {
  it("Try to POST /recommendations/:id/downvote with an unvalid id", async () => {
    const result = await agent.post(`/recommendations/2/downvote`);
    expect(result.status).toBe(404);
  });

  it("Try to POST /recommendations/:id/upvote with a valid id", async () => {
    const recommendation = await createRecommedations();
    await agent.post("/recommendations").send(recommendation);
    const findCreatedRecommendation = await findRecommendation(
      recommendation.name
    );
    const result = await agent.post(
      `/recommendations/${findCreatedRecommendation.id}/downvote`
    );
    const updatedRecommendation = await findRecommendation(recommendation.name);
    expect(updatedRecommendation.score).toEqual(-1);
    expect(result.status).toBe(200);
  });

  it("Try to POST 6x /recommendations/:id/downvote with a valid id and expect to have the recommendation erased from the database", async () => {
    const recommendation = await createRecommedations();
    await agent.post("/recommendations").send(recommendation);
    const findCreatedRecommendation = await findRecommendation(
      recommendation.name
    );
    for (let i = 0; i <= 5; i++) {
      await agent.post(`/recommendations/${findCreatedRecommendation.id}/downvote`);
    }
    const  result = await findRecommendation(recommendation.name);
    expect(result).toBeNull();
  });
}); //downVote

describe("Get the last ten recommendations", () => {
  it("Try to GET /recommendations", async () => {
    const recommendation = await createRecommedations();
    await agent.post("/recommendations").send(recommendation);
    const result = await agent.get("/recommendations");
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
}); //getAll

describe("Get a recommendation by id", () => {
  it("Try to GET /recommendations/:id with an unvalid id", async () => {
    const result = await agent.get(`/recommendations/2`);
    expect(result.status).toBe(404);
    expect(result.body).toBeInstanceOf(Object);
  });

  it("Try to GET /recommendations/:id with a valid id", async () => {
    const recommendation = await createRecommedations();
    await agent.post("/recommendations").send(recommendation);
    const findCreatedRecommendation = await findRecommendation(
      recommendation.name
    );
    const result = await agent.get(
      `/recommendations/${findCreatedRecommendation.id}`
    );
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });
}); //getById

afterAll(async () => {
  deleteAllData();
  await prisma.$disconnect();
});

async function findRecommendation(name: string) {
  return await prisma.recommendation.findFirst({
    where: {
      name,
    },
  });
}
