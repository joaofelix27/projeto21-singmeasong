import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../repositories/recommendationRepository.js";
import { conflictError, notFoundError } from "../utils/errorUtils.js";
import { recommendationService2 } from "./recommendationService2.js";

export type CreateRecommendationData = Omit<Recommendation, "id" | "score">;



async function insert(createRecommendationData: CreateRecommendationData) {
  const existingRecommendation = await recommendationRepository.findByName(
    createRecommendationData.name
  );
  if (existingRecommendation)
    throw conflictError("Recommendations names must be unique");

  await recommendationRepository.create(createRecommendationData);
} //ok

async function upvote(id: number) {
  await getByIdOrFail(id);

  await recommendationRepository.updateScore(id, "increment");
}

async function downvote(id: number) {
  await getByIdOrFail(id);

  const updatedRecommendation = await recommendationRepository.updateScore(
    id,
    "decrement"
  );

  if (updatedRecommendation.score < -5) {
    await recommendationRepository.remove(id);
  }
}

async function getByIdOrFail(id: number) {
  const recommendation = await recommendationRepository.find(id);
  if (!recommendation) throw notFoundError();

  return recommendation;
} //ok

async function get() {
  return recommendationRepository.findAll();
} //ok

async function getTop(amount: number) {
  return recommendationRepository.getAmountByScore(amount);
}//ok

async function getRandom() {
  const random = Math.random();
  const scoreFilter = await recommendationService2.getScoreFilter(random);

  const recommendations = await recommendationService2.getByScore(scoreFilter);
  if (recommendations.length === 0) {
    throw notFoundError();
  }
  const randomIndex =  Math.floor(Math.random() * recommendations.length);
  return recommendations[randomIndex];
}



export const recommendationService = {
  insert,
  upvote,
  downvote,
  getRandom,
  get,
  getById: getByIdOrFail,
  getTop
};
