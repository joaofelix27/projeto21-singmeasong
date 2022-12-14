import { recommendationRepository } from "../repositories/recommendationRepository.js";
import { notFoundError } from "../utils/errorUtils.js";

export async function getByScore(scoreFilter: "gt" | "lte") {
  const recommendations = await recommendationRepository.findAll({
    score: 10,
    scoreFilter,
  });
  if (recommendations.length > 0) {
    return recommendations;
  }

  return recommendationRepository.findAll();
} 

export function getScoreFilter(random: number): any {
  if (random < 0.7) {
    return "gt";
  }

  return "lte";
} 

async function getByIdOrFail(id: number) {
  const recommendation = await recommendationRepository.find(id);
  if (!recommendation) throw notFoundError();

  return recommendation;
} 

export const recommendationService2 = {
  getByScore,
  getScoreFilter,
  getById: getByIdOrFail,
};
