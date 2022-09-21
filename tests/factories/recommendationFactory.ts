import { faker } from '@faker-js/faker';

import { prisma } from '../../src/database';

export default async function createRecommedations(
) {

const recommendations= {
    name: faker.lorem.words(),
      youtubeLink:"https://www.youtube.com/watch?v=iyIqX9W8nVw",
}

  return recommendations;
}
