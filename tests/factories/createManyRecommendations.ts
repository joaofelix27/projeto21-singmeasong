import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database";

export  async function createManyScoreMixedRecommedations() {
  for (let i = 0; i < 100; i++) { //It does not matter so much the length of the database to test the router random, it does matters how many times the requesition is asked
      let minValue=-5
      let maxValue=10
      if (i>=70){
        minValue=11
        maxValue=10000
      }
    const recommendations = {
      name: faker.lorem.paragraphs(),
      youtubeLink: "https://www.youtube.com/watch?v=iyIqX9W8nVw",
      score: Number(faker.finance.amount(minValue, maxValue, 0)),
    };
    await prisma.recommendation.create({
      data: { ...recommendations },
    });
  }
}

export  async function createManyScoreFixedRecommedations(type) {
    let minValue=-5
    let maxValue=10
    if (type==="greater"){
        minValue=11
        maxValue=10000
    }
    for (let i = 0; i < 100; i++) { //It does not matter so much the length of the database to test the router random, it does matters how many times the requesition is asked
      const recommendations = {
        name: faker.lorem.paragraphs(),
        youtubeLink: "https://www.youtube.com/watch?v=iyIqX9W8nVw",
        score: Number(faker.finance.amount(minValue, maxValue, 0)),
      };
      await prisma.recommendation.create({
        data: { ...recommendations },
      });
    }
  }
