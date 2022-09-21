import supertest from 'supertest';
import app from '../src/app';
import createRecommedations from './factories/recommendationFactory';
import {
  deleteAllData,
} from './factories/scenarioFactory';
import { prisma } from '../src/database';

const agent = supertest(app);

beforeEach(async () => {
    deleteAllData();
});


describe('Add a new song recommendation', () => {
    it('Try to POST /recommendations with a repeated recommendation name', async () => {
      const recommendation= await createRecommedations();
      await agent.post('/recommendations').send(recommendation);
      const result = await agent.post('/recommendations').send(recommendation);

      expect(result.status).toBe(409);
    });
  it('Try to POST /recommendations with valid data', async () => {
      const recommendation= await createRecommedations();
    const result = await agent.post('/recommendations').send(recommendation);
    expect(result.status).toBe(201);
  });
 
})

afterAll(async () => {
    deleteAllData();
    await prisma.$disconnect();
  });