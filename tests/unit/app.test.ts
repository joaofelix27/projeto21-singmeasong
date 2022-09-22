import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { deleteAllData } from "../factories/deleteAll";

beforeEach(async () => {
  deleteAllData();
});

describe("Unit test of insert", () => {
  test("Test yo create a recommendation with a repeated name in database", async () => {
    const createRecommendation = {
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
    };
    const alreadyExistedRecommendation = {
      id: 1,
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
      score: 0,
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(alreadyExistedRecommendation);

    jest.spyOn(recommendationRepository, "create");

    const result = recommendationService.insert(createRecommendation);
    expect(result).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
  });

  test("Test to create a recommendation with a not used name", async () => {
    const createRecommendation = {
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);

    jest.spyOn(recommendationRepository, "create");

    await recommendationService.insert(createRecommendation);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });
});

describe("Unit test of getByIdOrFail", () => {
  test("Test to get a recommendation by id with a unvalid id", async () => {
    const id = 1;

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.getById(id);

    expect(result).rejects.toEqual({
      type: "not_found",
      message: "",
    });
  });

  test("Test to get a recommendation by id with a valid id", async () => {
    const id = 1;
    const recommendation = {
      id: id,
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
      score: 0,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);

    const result = await recommendationService.getById(id);
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("youtubeLink");
    expect(result).toHaveProperty("score");
  });
});

describe("Unit test of get", () => {
  test("Test to get all recommendations", async () => {
    const arrayReturned = [
      {
        id: 1,
        name: "SuperBowl50",
        youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
        score: 0,
      },
      {
        id: 2,
        name: "SuperBowl51",
        youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
        score: 0,
      },
    ];

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(arrayReturned);

    const result = await recommendationService.get();
    console.log("EAE", result);

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
  });
});

describe("Unit test of upvote", () => {
  test("Test to upvote a recommendation  with a unvalid id", async () => {
    const id = 1;

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.upvote(id);

    expect(result).rejects.toEqual({
      type: "not_found",
      message: "",
    });
  });
});

describe("Unit test of getTop", () => {
  test("Test to get the recommendations ordered by score", async () => {
    const amount = Math.ceil(Math.random() * (50 - 10) + 10);
    const filledArray = [];
    for(let i=0;i<amount;i++){
      const recommendation = {
        id: Math.ceil(Math.random() * (1000 - 1) + 1),
        name: `SuperBowl${i}`,
        youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
        score: Math.ceil(Math.random() * (1000 - 10) + 10),
      };
      filledArray.push(recommendation)
    }
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce(filledArray);
    const result = await recommendationService.getTop(amount);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
    expect(recommendationRepository.getAmountByScore).toBeCalledTimes(1)
  });
});

describe ("Unit test of getScoreFilter", ()=> {
  test ("Get score when random under 0.7", async () => {
    const random = Math.random() * (0.69);
    console.log("random",random)

    const result= recommendationService.getScoreFilter(random)

    expect(result).toEqual("gt")

  })

  test ("Get score when random above 0.7", async () => {
    const random = Math.random() * (1-0.7) + 0.7;
    console.log("random",random)

    const result= recommendationService.getScoreFilter(random)

    expect(result).toEqual("lte")

  })
})