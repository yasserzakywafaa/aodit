import { AggregationResult, BaseFilters, User } from "../types";
import {
  Collection,
  Db,
  DeleteResult,
  Document,
  Filter,
  InferIdType,
  InsertManyResult,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  Sort,
  WithId,
} from "mongodb";
import {
  createMongoDatabase,
  MongoClientLike,
  MongoDatabase,
} from "@yasserzakywafaa/server-core";

import CONFIG from "../../config";

export enum DBNamesEnum {
  aodit_dev = "aodit_dev",
  aodit_prod = "aodit_prod",
}

export enum DBCollectionsEnum {
  reports = "reports",
  scenarios = "scenarios",
  reportRuns = "report_runs",
  scenarioResults = "scenario_results",
  agents = "agents",
  users = "users",
  lead_subscribers = "lead_subscribers",
  demo_sessions = "demo_sessions",
}

const { IS_DEV, MONGODB_URI_DEV, IS_PROD, MONGODB_URI_PROD, MONGODB_URI } =
  CONFIG;

export const getMongoDbUri = (): string => {
  if (IS_DEV && MONGODB_URI_DEV) {
    return MONGODB_URI_DEV;
  }
  if (IS_PROD && MONGODB_URI_PROD) {
    return MONGODB_URI_PROD;
  }
  return MONGODB_URI ?? "";
};

export const getDatabaseName = (): DBNamesEnum =>
  IS_DEV ? DBNamesEnum.aodit_dev : DBNamesEnum.aodit_prod;

export let dbClient: MongoClient;
export let database: Db;

const createCollections = async (db: Db): Promise<void> => {
  for (const collectionName of Object.values(DBCollectionsEnum)) {
    const collection = await db
      .listCollections({ name: collectionName })
      .toArray();
    if (collection.length === 0) {
      await db.createCollection(collectionName);
      console.info(`✅ Collection '${collectionName}' created`);
    } else {
      console.info(`-- ℹ️  Collection '${collectionName}' already exists`);
    }
  }
};

const createIndexes = async (db: Db): Promise<void> => {
  const collectionsToSearch = [
    DBCollectionsEnum.reports,
    DBCollectionsEnum.scenarios,
    DBCollectionsEnum.reportRuns,
    DBCollectionsEnum.agents,
    DBCollectionsEnum.users,
  ];

  try {
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName);
      await collection.createIndex({ _id: 1 });
      await collection.createIndex({ userId: 1 });
      await collection.createIndex({ createdAt: -1 });
    }

    await db.collection(DBCollectionsEnum.reports).createIndex({ userId: 1 });
    await db.collection(DBCollectionsEnum.reports).createIndex({ createdAt: -1 });
    await db.collection(DBCollectionsEnum.scenarios).createIndex({ reportId: 1 });
    await db.collection(DBCollectionsEnum.scenarios).createIndex({ createdAt: -1 });
    await db.collection(DBCollectionsEnum.reportRuns).createIndex({ reportId: 1 });
    await db.collection(DBCollectionsEnum.reportRuns).createIndex({ createdAt: -1 });
    await db.collection(DBCollectionsEnum.scenarioResults).createIndex({ reportRunId: 1 });
    await db.collection(DBCollectionsEnum.scenarioResults).createIndex({ reportId: 1 });
    await db.collection(DBCollectionsEnum.scenarioResults).createIndex({ createdAt: -1 });

    const users = db.collection(DBCollectionsEnum.users);
    await users.createIndex({ email: 1 });
    await users.createIndex({ createdAt: 1 });
    await users.createIndex({ picture: 1 });
    await users.createIndex({ projectCount: 1 });
    await users.createIndex({ projects: 1 });
    await users.createIndex({ status: 1 });
    await users.createIndex({ role: 1 });
    await users.createIndex({ isPaidUser: 1 });
    await users.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });

    await db.collection(DBCollectionsEnum.agents).createIndex({ userId: 1 });
    await db.collection(DBCollectionsEnum.agents).createIndex({ createdAt: -1 });
    await db.collection(DBCollectionsEnum.lead_subscribers).createIndex({ email: 1 }, { unique: true });
    await db.collection(DBCollectionsEnum.lead_subscribers).createIndex({ createdAt: -1 });
    await db.collection(DBCollectionsEnum.demo_sessions).createIndex({ createdAt: -1 });
  } catch (error) {
    console.error("❌ Error creating index:", error);
  }
};

let mongoDatabase: MongoDatabase<DBCollectionsEnum> | undefined;

const getMongoDatabase = (): MongoDatabase<DBCollectionsEnum> => {
  mongoDatabase ??= createMongoDatabase<DBCollectionsEnum>({
    uri: getMongoDbUri(),
    dbName: getDatabaseName(),
    onConnected: async ({ db }) => {
      console.info("✅ Connected to MongoDB Atlas", {
        dbName: getDatabaseName(),
      });
      await createCollections(db);
      await createIndexes(db);
    },
  });
  return mongoDatabase;
};

export const databaseInit = async (): Promise<void> => {
  try {
    const coreDatabase = getMongoDatabase();
    database = await coreDatabase.connect();
    dbClient = coreDatabase.getClient() as MongoClientLike as MongoClient;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas", error);
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (mongoDatabase?.isConnected()) {
    await mongoDatabase.close();
    console.info("✅ Database connection closed");
  }
};

export const createDocument = async <T extends Document = Document>(
  data: OptionalUnlessRequiredId<T>,
  collectionName: DBCollectionsEnum,
): Promise<InferIdType<T>> =>
  getMongoDatabase().createDocument<T>(collectionName, data);

export const readDocument = async <T extends Document = Document>(
  docId: InferIdType<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> =>
  getMongoDatabase().readDocument<T>(collectionName, docId);

export const readDocumentByField = async <T extends Document = Document>(
  field: string,
  value: string,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> => {
  try {
    return await getMongoDatabase().readDocumentByQuery<T>(
      collectionName,
      { [field]: value } as Filter<T>,
    );
  } catch (error) {
    throw new Error("❌ Failed to get document by field!", { cause: error });
  }
};

export const readDocumentByQuery = async <T extends Document = Document>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> => {
  try {
    return await getMongoDatabase().readDocumentByQuery<T>(collectionName, query, {
      sort: { createdAt: -1 },
    });
  } catch (error) {
    throw new Error("❌ Failed to get document by query!", { cause: error });
  }
};

export const updateDocument = async <T extends Document = Document>(
  docId: string,
  fieldsToUpdate: Partial<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> => {
  try {
    const result = await getMongoDatabase().updateDocument<T>(
      collectionName,
      new ObjectId(docId) as InferIdType<T>,
      fieldsToUpdate,
    );
    console.log(`✅ Document updated in collection: ${collectionName}.`);
    return result;
  } catch (error) {
    console.error("❌ Error updating document:", error);
    throw new Error("❌ Failed to update document!", { cause: error });
  }
};

export const deleteDocument = async <T extends Document = Document>(
  docId: string,
  collectionName: DBCollectionsEnum,
): Promise<boolean> => {
  try {
    const deleted = await getMongoDatabase().deleteDocument<T>(
      collectionName,
      new ObjectId(docId) as InferIdType<T>,
    );
    console.log("✅ Document deleted successfully.");
    return deleted;
  } catch (error) {
    throw new Error("❌ Failed to delete document!", { cause: error });
  }
};

export const createBulkDocuments = async <T extends Document = Document>(
  documents: OptionalUnlessRequiredId<T>[],
  collectionName: DBCollectionsEnum,
): Promise<InsertManyResult<T>> => {
  try {
    return await getMongoDatabase().createBulkDocuments<T>(
      collectionName,
      documents,
    );
  } catch (error) {
    throw new Error("❌ Error saving documents in bulk:", { cause: error });
  }
};

export const getDocumentFromDb = async <T extends Document = Document>(
  docId: InferIdType<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> => {
  try {
    return await readDocument<T>(docId, collectionName);
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

export const getDocumentByFieldFromDb = async <T extends Document = Document>(
  field: string,
  value: string,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> =>
  readDocumentByField<T>(field, value, collectionName);

export const getDocumentByQueryFromDb = async <T extends Document = Document>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T> | null> =>
  readDocumentByQuery<T>(query, collectionName);

export const getDocumentsByQueryFromDb = async <
  T extends Document = Document,
>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T>[]> => {
  try {
    return await getMongoDatabase().getDocumentsByQuery<T>(
      collectionName,
      query,
    );
  } catch (error) {
    console.error(
      `❌ Error fetching documents from ${collectionName} with query ${JSON.stringify(
        query,
      )}:`,
      error,
    );
    throw new Error(
      `❌ Failed to fetch documents by query from ${collectionName}`,
    );
  }
};

export const deleteDocumentByQuery = async (
  query: Filter<Document>,
  collectionName: DBCollectionsEnum | string,
): Promise<DeleteResult> => {
  if (!query || Object.keys(query).length === 0) {
    throw new Error("❌ Deletion query cannot be empty.");
  }

  console.log(
    `Attempting deleteOne in collection "${collectionName}" with query:`,
    JSON.stringify(query),
  );

  try {
    const result = await getMongoDatabase().deleteDocumentByQuery<Document>(
      collectionName as DBCollectionsEnum,
      query,
    );
    if (result.deletedCount === 1) {
      console.log(
        `✅ Successfully deleted 1 document from "${collectionName}" matching query.`,
      );
    } else {
      console.log(
        `ℹ️ No document found in "${collectionName}" matching query for deletion.`,
      );
    }
    return result;
  } catch (error) {
    console.error(
      `❌ Database error during deleteOne in "${collectionName}" with query ${JSON.stringify(
        query,
      )}:`,
      error,
    );
    throw new Error(
      `Failed to delete document from ${collectionName}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

export const saveUserDataToDb = async (
  user: User,
): Promise<ObjectId | undefined> => {
  try {
    const newUserId = await createDocument(
      user as OptionalUnlessRequiredId<Document>,
      DBCollectionsEnum.users,
    );
    console.log("✅ User saved to DB successfully");
    return newUserId as ObjectId;
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

export const updateUserInDb = async (
  userDocId: string,
  updatedUserData: Partial<User>,
): Promise<WithId<Document> | undefined> => {
  try {
    const updatedUser = await updateDocument(
      userDocId,
      updatedUserData,
      DBCollectionsEnum.users,
    );
    if (!updatedUser) {
      throw new Error("User not found or update failed");
    }
    console.log("✅ User updated in DB successfully!");
    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user data in DB", error);
    throw new Error("❌ Error updating user data in DB", { cause: error });
  }
};

export const getPaginatedDocuments = async <
  T extends Document = Document,
>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
  paginationParams: BaseFilters,
  options?: {
    customPipelineStages?: Record<string, any>[];
    sort?: Sort;
  },
): Promise<AggregationResult<T>> => {
  try {
    const result = await getMongoDatabase().getPaginatedDocuments<T, T>(
      collectionName,
      query,
      paginationParams,
      {
        customPipelineStages: options?.customPipelineStages,
        sort: options?.sort ?? { createdAt: -1 },
      },
    );
    return result;
  } catch (error) {
    console.error(
      `❌ Error fetching paginated documents from ${collectionName}:`,
      error,
    );
    throw error;
  }
};

export const getCollection = <T extends Document = Document>(
  collectionName: DBCollectionsEnum,
): Collection<T> => getMongoDatabase().getCollection<T>(collectionName);
