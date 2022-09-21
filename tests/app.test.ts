import supertest from "supertest";
import app from "../src/app";
import createRecommedations from "./factories/recommendationFactory";
import { deleteAllData } from "./factories/scenarioFactory";
import { prisma } from "../src/database";
import {createManyScoreFixedRecommedations, createManyScoreMixedRecommedations} from "./factories/createManyRecommendations";

const agent = supertest(app);

jest.setTimeout(30000);


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
      await agent.post(
        `/recommendations/${findCreatedRecommendation.id}/downvote`
      );
    }
    const result = await findRecommendation(recommendation.name);
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

describe("Get a random recommendation", () => {
  it("Try to GET /recommendations/random without any data on the database", async () => {
    let isEmptyObject = false;
    const result = await agent.get("/recommendations/random");
    expect(result.status).toBe(404);
    if (
      Object.keys(result.body).length === 0 &&
      result.body.constructor === Object
    )
      isEmptyObject = true;
    expect(isEmptyObject).toBeTruthy();
  });

  it("Try to GET /recommendations/random having a song recommendation  with score greater than 10 returned 70% of time", async () => {
    const recommendation = await createManyScoreMixedRecommedations();
    const scoreGreaterThan10=[]
    for(let i=0; i<1000;i++){
      const result = await agent.get("/recommendations/random");
      const randomRecommendation= result.body
      if(randomRecommendation.score>10){
        scoreGreaterThan10.push(randomRecommendation)
      }
    }
    console.log("Length",scoreGreaterThan10.length)
    expect(scoreGreaterThan10[0]).toHaveProperty('id');
    expect(scoreGreaterThan10[0]).toHaveProperty('name');
    expect(scoreGreaterThan10[0]).toHaveProperty('youtubeLink');
    expect(scoreGreaterThan10[0]).toHaveProperty('score');
    expect(scoreGreaterThan10.length).toBeGreaterThanOrEqual(670)
    expect(scoreGreaterThan10.length).toBeLessThanOrEqual(730)
  });

  it("Try to GET /recommendations/random having a song recommendation  with score lower than 10 returned 30% of time", async () => {
    const recommendation = await createManyScoreMixedRecommedations();
    const scoreLowerThan10=[]
    for(let i=0; i<1000;i++){
      const result = await agent.get("/recommendations/random");
      const randomRecommendation= result.body
      if(randomRecommendation.score<=10){
        scoreLowerThan10.push(randomRecommendation)
      }
    }
    console.log("Length",scoreLowerThan10.length)
    expect(scoreLowerThan10[0]).toHaveProperty('id');
    expect(scoreLowerThan10[0]).toHaveProperty('name');
    expect(scoreLowerThan10[0]).toHaveProperty('youtubeLink');
    expect(scoreLowerThan10[0]).toHaveProperty('score');
    expect(scoreLowerThan10.length).toBeGreaterThanOrEqual(250)
    expect(scoreLowerThan10.length).toBeLessThanOrEqual(350)
  });


  it("Try to GET /recommendations/random having a random recommendation  when all the song recommendations have a score greater than 10", async () => {
    const recommendation = await createManyScoreFixedRecommedations("greater");
    const scoreGreaterThan10=[]
    for(let i=0; i<1000;i++){
      const result = await agent.get("/recommendations/random");
      const randomRecommendation= result.body
      if(randomRecommendation.score>10){
        scoreGreaterThan10.push(randomRecommendation)
      }
    }
    console.log("Length",scoreGreaterThan10.length)
    expect(scoreGreaterThan10[0]).toHaveProperty('id');
    expect(scoreGreaterThan10[0]).toHaveProperty('name');
    expect(scoreGreaterThan10[0]).toHaveProperty('youtubeLink');
    expect(scoreGreaterThan10[0]).toHaveProperty('score');
    expect(scoreGreaterThan10.length).toEqual(1000)
  });


  it("Try to GET /recommendations/random having a random recommendation  when all the song recommendations have a score lower than 10", async () => {
    const recommendation = await createManyScoreFixedRecommedations("lower");
    const scoreLowerThan10=[]
    for(let i=0; i<1000;i++){
      const result = await agent.get("/recommendations/random");
      const randomRecommendation= result.body
      if(randomRecommendation.score<10){
        scoreLowerThan10.push(randomRecommendation)
      }
    }
    console.log("Length",scoreLowerThan10.length)
    expect(scoreLowerThan10[0]).toHaveProperty('id');
    expect(scoreLowerThan10[0]).toHaveProperty('name');
    expect(scoreLowerThan10[0]).toHaveProperty('youtubeLink');
    expect(scoreLowerThan10[0]).toHaveProperty('score');
    expect(scoreLowerThan10.length).toEqual(1000)
  });
}); //random

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
