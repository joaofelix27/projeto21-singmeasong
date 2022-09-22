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
      const id=1
        const recommendation = {
          id:id,
          name: "SuperBowl50",
          youtubeLink: "https://www.youtube.com/watch?v=c9cUytejf1k",
          score:0
        };
        jest
          .spyOn(recommendationRepository, "find")
          .mockResolvedValueOnce(recommendation);
    
    
        const result=recommendationService.getById(id);
        expect(result).toBeInstanceOf(Object)
        expect(recommendationRepository.find).toBeCalledTimes(2);
  });

  //  test('Testing with a repeated name in database', async () => {
  //    const createRecommendation ={
  //        name:"SuperBowl50",
  //        youtubeLink:"https://www.youtube.com/watch?v=c9cUytejf1k"
  //    }
  //    const alreadyExistedRecommendation ={
  //        id:1,
  //        name:"SuperBowl50",
  //        youtubeLink:"https://www.youtube.com/watch?v=c9cUytejf1k",
  //        score:0
  //    }
  //    jest
  //      .spyOn(recommendationRepository, 'findByName')
  //      .mockResolvedValueOnce(alreadyExistedRecommendation);

  //      jest.spyOn(recommendationRepository,"create")

  //     const result = recommendationService.insert(createRecommendation)
  //     expect(result).rejects.toEqual({
  //        type: "conflict",
  //        message:"Recommendations names must be unique"
  //    })
  //  });

  //   it('Testa não recebe desconto', async () => {
  //     const value = 90;
  //     const expectedDiscount = 0;
  //     const expectedDiscountValue = __calculateDiscount(value, expectedDiscount);

  //     const { discount, originalPrice, finalPrice } =
  //       voucherService.calculateDiscount(value);

  //     expect(discount).toBe(expectedDiscount);
  //     expect(originalPrice).toBe(value);
  //     expect(finalPrice).toBe(expectedDiscountValue);
  //   });
});
