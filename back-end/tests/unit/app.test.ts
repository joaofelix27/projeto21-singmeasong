import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { createOnlyGtrOrLteThan10 } from "../factories/createManyRecommendationsFactory";
import { deleteAllData } from "../factories/deleteAll";
import {Recommendation} from "@prisma/client";
import { recommendationService2 } from "../../src/services/recommendationService2";
import { notFoundError } from "../../src/utils/errorUtils";

beforeEach(async () => {
  deleteAllData();
  jest.resetAllMocks();
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

    const result = recommendationService2.getById(id);

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

    const result = await recommendationService2.getById(id);
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

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
  });
});

describe("Unit test of upvote", () => {
  test("Test to upvote a recommendation with a unvalid id", async () => {
    const id = Math.ceil(Math.random()*(100-10)+10);

    jest.spyOn(recommendationService2, "getById").mockImplementation(()=>{
      throw notFoundError();}
      );

    const result = recommendationService.upvote(id);
    jest.spyOn(recommendationRepository, "updateScore");

    expect(result).rejects.toEqual({
      type: "not_found",
      message: "",
    });
    expect(recommendationRepository.updateScore).toBeCalledTimes(0)
  });

  test("Test to upvote a recommendation with a valid id", async () => {
    const id = Math.ceil(Math.random()*(100-10)+10);
    const recommendation = {
      id: id,
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
      score: 0,
    };

    jest.spyOn(recommendationService2, "getById").mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, "updateScore")

    const result = await recommendationService.upvote(id);

    expect(recommendationRepository.updateScore).toBeCalledTimes(1)
  });
});

describe("Unit test of downvote", () => {
  test("Test to downvote a recommendation with a unvalid id", async () => {
    const id = Math.ceil(Math.random()*(100-10)+10);

    jest.spyOn(recommendationService2, "getById").mockImplementation(()=>{
      throw notFoundError();}
      );

    const result = recommendationService.downvote(id);
    jest.spyOn(recommendationRepository, "updateScore");
    jest.spyOn(recommendationRepository, "remove")

    expect(result).rejects.toEqual({
      type: "not_found",
      message: "",
    });
    expect(recommendationRepository.updateScore).toBeCalledTimes(0)
    expect(recommendationRepository.remove).toBeCalledTimes(0)
  });

  test("Test to downvote a recommendation with a valid id and score after update gte -5", async () => {
    const id = Math.ceil(Math.random()*(100-10)+10);
    const recommendation = {
      id: id,
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
      score: Math.ceil(Math.random()*(1000+5)-5),
    };

    jest.spyOn(recommendationService2, "getById").mockResolvedValueOnce(recommendation);
    const scoreAfter=recommendation.score-1
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({...recommendation,score:scoreAfter})
    jest.spyOn(recommendationRepository, "remove")
    const result = await recommendationService.downvote(id);

    expect(recommendationRepository.updateScore).toBeCalledTimes(1)
    expect(recommendationRepository.remove).toBeCalledTimes(0)
  });
  test("Test to downvote a recommendation with a valid id and score after update lt -5.And then, check if it was removed", async () => {
    const id = Math.ceil(Math.random()*(100-10)+10);
    const recommendation = {
      id: id,
      name: "SuperBowl50",
      youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
      score: Math.ceil(Math.random()*(-1000+5)-5),
    };

    jest.spyOn(recommendationService2, "getById").mockResolvedValueOnce(recommendation);
    const scoreAfter=recommendation.score-1
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({...recommendation,score:scoreAfter})
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(async () => {})

    const result = await recommendationService.downvote(id);

    expect(recommendationRepository.updateScore).toBeCalledTimes(1)
    expect(recommendationRepository.remove).toBeCalledTimes(1)
  });
});

describe("Unit test of getTop", () => {
  test("Test to get the recommendations ordered by score", async () => {
    const amount = Math.ceil(Math.random() * (50 - 10) + 10);
    const filledArray= await createOnlyGtrOrLteThan10 ("lte")
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

    const result= recommendationService2.getScoreFilter(random)

    expect(result).toEqual("gt")

  })

  test ("Get score when random above 0.7", async () => {
    const random = Math.random() * (1-0.7) + 0.7;

    const result= recommendationService2.getScoreFilter(random)

    expect(result).toEqual("lte")

  })
})

describe ("Unit test of getByScore", ()=> {
  test ("Get score when score filter is gt", async () => {
    const filledArray= await createOnlyGtrOrLteThan10 ("gt")

    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(filledArray)
    const result= await recommendationService2.getByScore("gt")

    const confirmIfAllGreater = await checkIfAllElementsHaveScoreGt10(result);

    expect(confirmIfAllGreater).toBeTruthy()
    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
    expect(recommendationRepository.findAll).toBeCalledTimes(1)

  })

  test ("Get score when score filter is lte", async () => {
    const filledArray= await createOnlyGtrOrLteThan10 ("lte")

    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(filledArray)
    const result= await recommendationService2.getByScore("lte")

    const confirmIfAllGreater = await checkIfAllElementsHaveScoreGt10(result);

    expect(confirmIfAllGreater).toBeFalsy()

    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
    expect(recommendationRepository.findAll).toBeCalledTimes(1)

  })

  test ("Get score when returned array is empty and the score filter is lte", async () => {
    const emptyArray = [];
    const filledArray= await createOnlyGtrOrLteThan10 ("gt")

    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(emptyArray)
    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(filledArray)
    const result= await recommendationService2.getByScore("lte")


    const confirmIfAllGreater = await checkIfAllElementsHaveScoreGt10(result);

    expect(confirmIfAllGreater).toBeTruthy()
    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
    expect(recommendationRepository.findAll).toBeCalledTimes(2)

  })

  test ("Get score when returned array is empty and the score filter is gt", async () => {
    const emptyArray = [];
    const filledArray= await createOnlyGtrOrLteThan10 ("lte")
 
    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(emptyArray)
    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(filledArray)
    const result= await recommendationService2.getByScore("gt")

    const confirmIfAllGreater = await checkIfAllElementsHaveScoreGt10(result);

    expect(confirmIfAllGreater).toBeFalsy()

    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("youtubeLink");
    expect(result[0]).toHaveProperty("score");
    expect(recommendationRepository.findAll).toBeCalledTimes(2)

  })

  test ("Get score when both returned array is empty", async () => {
    const emptyArray = [];
 
    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(emptyArray);
    jest.spyOn(recommendationRepository,'findAll').mockResolvedValueOnce(emptyArray);
    const result= await recommendationService2.getByScore("gt");

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(0);
    expect(recommendationRepository.findAll).toBeCalledTimes(2);

  })
})

describe ("Unit test of getRandom", ()=> {
  test ("Get score when there aren't recommendations on the database", async () => {
    const emptyArray=[]

    jest.spyOn(recommendationService2,'getScoreFilter').mockResolvedValueOnce("gt")
    jest.spyOn(recommendationService2,'getByScore').mockResolvedValueOnce(emptyArray)
    
    const result= recommendationService.getRandom()

    expect(result).rejects.toEqual({
      type: "not_found",
      message: "",
    });

  })
  test ("Get score when there are recommendations on the database", async () => {
    const filledArray= await createOnlyGtrOrLteThan10 ("lte")

    jest.spyOn(recommendationService2,'getScoreFilter').mockResolvedValueOnce("gt")
    jest.spyOn(recommendationService2,'getByScore').mockResolvedValueOnce(filledArray)
    
    const result= await recommendationService.getRandom()

    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("youtubeLink");
    expect(result).toHaveProperty("score");

  })
})


async function checkIfAllElementsHaveScoreGt10 (array:Array<Recommendation>){
  for(let i=0;i<array.length;i++){
    if(array[i].score<=10){
      return false
    }
  }
  return true
}
