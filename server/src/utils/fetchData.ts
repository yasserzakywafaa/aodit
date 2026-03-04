import { DBCollectionsEnum, getDocumentFromDb } from "..//models/mongoDb";

import { ObjectId } from "mongodb";
import { User } from "..//models/types";

export const getUserDataById = async (userId: string): Promise<User> => {
  const userDocument = (await getDocumentFromDb(
    new ObjectId(userId),
    DBCollectionsEnum.users
  )) as User;

  return userDocument;
};
