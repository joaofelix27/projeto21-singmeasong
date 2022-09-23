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


  export  async function createBasedOnScoreRanking() {
    let minValue=0
    let maxValue=100
    let lowerScoreName=""
    let greaterScoreName=""
    const amount = Math.ceil(Math.random() * (1000 - 10) + 10);
    for (let i = 1; i <= amount; i++) { 
        const recommendations = {
        name: faker.lorem.paragraphs(),
        youtubeLink: "https://www.youtube.com/watch?v=iyIqX9W8nVw",
        score: Math.ceil(Math.random() * (maxValue - minValue) + minValue)
      };
      if(i===1){
        lowerScoreName=recommendations.name
      } else if (i===amount){
        greaterScoreName=recommendations.name
      }
      await prisma.recommendation.create({
        data: { ...recommendations },
      });
      minValue=maxValue;
      maxValue+=10;
    }
    return {names:[lowerScoreName,greaterScoreName],amount:amount}
  }

  export  async function createOnlyGtrOrLteThan10( scoreFilter:"gt"|"lte") {
    const amount = Math.ceil(Math.random() * (50 - 10) + 10);
    let maxValue=1000
    let minValue=11
    if (scoreFilter==="lte"){
      maxValue=10
      minValue=-5
    }
    const filledArray = [];
    for(let i=0;i<amount;i++){
      const recommendation = {
        id: Math.ceil(Math.random() * (1000 - 1) + 1),
        name: `SuperBowl${i}`,
        youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
        score: Math.ceil(Math.random() * (maxValue -minValue) + minValue),
      };
      filledArray.push(recommendation)
    }
    return filledArray
  }