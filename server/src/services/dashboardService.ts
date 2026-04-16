import {
  DBCollectionsEnum,
  database,
  getDocumentByFieldFromDb,
  getDocumentsByQueryFromDb,
  getPaginatedDocuments,
  saveUserDataToDb,
  updateUserInDb,
} from "../models/mongoDb";
import {
  AuthProviderEnum,
  User,
  UserRole,
  UserStatus,
  getInitialUserData,
} from "../models/types";
import { deleteDocument, readDocument } from "../models/mongoDb/crudOperations";

import { randomUUID } from "crypto";

import { ObjectId } from "mongodb";

const getUsersCount = async () => {
  const collection = database.collection(DBCollectionsEnum.users);
  const total = await collection.countDocuments();
  const active = await collection.countDocuments({ status: UserStatus.active });
  const blocked = await collection.countDocuments({
    status: UserStatus.blocked,
  });

  return { total, active, blocked };
};

const getAllUsers = async (pageNumber: number, pageSize: number) => {
  const { results, paging } = await getPaginatedDocuments<User>(
    {},
    DBCollectionsEnum.users,
    { pageNumber, pageSize },
    {
      sort: { createdAt: -1 },
    },
  );
  return {
    results,
    paging,
  };
};

const getUserById = async (userId: string) => {
  try {
    if (ObjectId.isValid(userId)) {
      return await readDocument(new ObjectId(userId), DBCollectionsEnum.users);
    } else {
      // Fallback to searching by userId field
      const users = await getDocumentsByQueryFromDb(
        { userId: userId } as any,
        DBCollectionsEnum.users,
      );
      return users[0];
    }
  } catch (e) {
    throw new Error("User not found");
  }
};

const updateUserInfo = async (userId: string, data: any) => {
  return await updateUserInDb(userId, data);
};

const blockUser = async (userId: string) => {
  return await updateUserInDb(userId, { status: UserStatus.blocked });
};

const unblockUser = async (userId: string) => {
  return await updateUserInDb(userId, { status: UserStatus.active });
};

const deleteUser = async (userId: string) => {
  return await deleteDocument(userId, DBCollectionsEnum.users);
};

interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

const createUser = async (input: CreateUserInput): Promise<User> => {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = (await getDocumentByFieldFromDb(
    "email",
    normalizedEmail,
    DBCollectionsEnum.users,
  )) as User | null;

  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const newUser: User = {
    ...getInitialUserData(),
    userId: `email-${randomUUID()}`,
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    name: {
      givenName: input.firstName.trim(),
      familyName: input.lastName.trim(),
    },
    picture: "",
    role: input.role,
    provider: AuthProviderEnum.email,
    verified: true,
    lastLogin: new Date(),
  };

  const newUserId = await saveUserDataToDb(newUser);
  if (!newUserId) {
    throw new Error("Failed to create user.");
  }

  return { ...newUser, _id: newUserId };
};

const DashboardServices = {
  getUsersCount,
  getAllUsers,
  getUserById,
  updateUserInfo,
  blockUser,
  unblockUser,
  deleteUser,
  createUser,
};

export default DashboardServices;
