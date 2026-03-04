import { SupportedLanguages } from "src/utils/languages";

export interface BaseDataParams {
  language: SupportedLanguages;
  data: string[];
}

export const getRandomTwoArrayDataItems = (
  baseDataParams: BaseDataParams[]
): BaseDataParams[] => {
  const updatedData = baseDataParams.map((params) => {
    // Ensure there are at least two items in the data array
    if (params.data.length < 2) {
      throw new Error(
        `❌  Not enough items in data array for language: ${params.language}`
      );
    }

    // Select two random items from the data array
    const randomIndex1 = Math.floor(Math.random() * params.data.length);
    let randomIndex2 = Math.floor(Math.random() * params.data.length);
    while (randomIndex2 === randomIndex1) {
      randomIndex2 = Math.floor(Math.random() * params.data.length);
    }

    // Create a new data array with the two selected items
    const newData: string[] = [
      params.data[randomIndex1],
      params.data[randomIndex2],
    ];

    // Return a new BaseDataParams object with the new data array
    return {
      ...params,
      data: newData,
    };
  });

  return updatedData;
};
