import {prisma} from "../database.js";
import { Request,Response } from "express";
import { faker } from "@faker-js/faker";

export async function clearRecommendations(req:Request, res:Response){
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    res.sendStatus(200);
}

export async function populateRecommendations(req:Request, res:Response){

    await prisma.recommendation.createMany({
        data:[
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name:faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name:faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random()  * (1000-5)+5)
            },
        ]
    });

    res.sendStatus(200);
}