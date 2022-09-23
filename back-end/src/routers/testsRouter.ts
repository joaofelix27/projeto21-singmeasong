import { Router } from "express";
import { clearRecommendations,populateRecommendations } from "../controllers/testController.js";

const testRouter = Router();

testRouter.post("/reset-database",clearRecommendations);
testRouter.post("/seed",populateRecommendations);

export default testRouter;