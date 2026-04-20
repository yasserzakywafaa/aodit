import { AggregationResult, BaseFilters, User } from "../types";
import {
  Collection,
  Db,
  DeleteResult,
  Document,
  Filter,
  MongoClient,
  ObjectId,
  Sort,
  WithId,
} from "mongodb";
import {
  createDocument,
  readDocument,
  readDocumentByField,
  readDocumentByQuery,
  updateDocument,
} from "./crudOperations";

import CONFIG from "../../config";

let dbClient: MongoClient;
let database: Db;
const { IS_DEV, MONGODB_URI_DEV, IS_PROD, MONGODB_URI_PROD, MONGODB_URI } =
  CONFIG;

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

const getMongoDbUri = (): string => {
  if (IS_DEV && MONGODB_URI_DEV) {
    return MONGODB_URI_DEV;
  }

  if (IS_PROD && MONGODB_URI_PROD) {
    return MONGODB_URI_PROD;
  }

  return MONGODB_URI ?? "";
};

const getDatabaseName = (): string => {
  return IS_DEV ? DBNamesEnum.aodit_dev : DBNamesEnum.aodit_prod;
};

const databaseInit = async () => {
  const uri = getMongoDbUri();
  dbClient = new MongoClient(uri);

  try {
    await dbClient.connect();
    // // FOR DEVELOPMENT USE ONLY
    // await copyDocumentsFromDatabaseToAnotherDatabase();
    const dbName = getDatabaseName();
    database = dbClient.db(dbName);

    console.info("✅ Connected to MongoDB Atlas", { dbName });

    await createCollections();
    await createIndexes();
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas", error);
  }
};

const createCollections = async () => {
  const collections = Object.keys(DBCollectionsEnum);

  for (const collectionName of collections) {
    const collection = await database
      .listCollections({ name: collectionName })
      .toArray();
    if (collection.length === 0) {
      await database.createCollection(collectionName);
      console.info(`✅ Collection '${collectionName}' created`);
    } else {
      console.info(`-- ℹ️  Collection '${collectionName}' already exists`);
    }
  }
};

const createIndexes = async () => {
  const collectionsToSearch = [
    DBCollectionsEnum.reports,
    DBCollectionsEnum.scenarios,
    DBCollectionsEnum.reportRuns,
    DBCollectionsEnum.agents,
    DBCollectionsEnum.users,
  ];

  try {
    for (const collectionName of collectionsToSearch) {
      const collection = database.collection(collectionName);
      await collection.createIndex({ _id: 1 });
      await collection.createIndex({ userId: 1 });
      await collection.createIndex({ createdAt: -1 });
    }

    const reports = database.collection(DBCollectionsEnum.reports);
    await reports.createIndex({ userId: 1 });
    await reports.createIndex({ createdAt: -1 });

    const scenarios = database.collection(DBCollectionsEnum.scenarios);
    await scenarios.createIndex({ reportId: 1 });
    await scenarios.createIndex({ createdAt: -1 });

    const reportRuns = database.collection(DBCollectionsEnum.reportRuns);
    await reportRuns.createIndex({ reportId: 1 });
    await reportRuns.createIndex({ createdAt: -1 });

    const scenarioResults = database.collection(DBCollectionsEnum.scenarioResults);
    await scenarioResults.createIndex({ reportRunId: 1 });
    await scenarioResults.createIndex({ reportId: 1 });
    await scenarioResults.createIndex({ createdAt: -1 });

    const users = database.collection(DBCollectionsEnum.users);
    await users.createIndex({ email: 1 });
    await users.createIndex({ createdAt: 1 });
    await users.createIndex({ picture: 1 });
    await users.createIndex({ projectCount: 1 });
    await users.createIndex({ projects: 1 });
    await users.createIndex({ status: 1 });
    await users.createIndex({ role: 1 });
    await users.createIndex({ isPaidUser: 1 });
    await users.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });

    const agents = database.collection(DBCollectionsEnum.agents);
    await agents.createIndex({ userId: 1 });
    await agents.createIndex({ createdAt: -1 });

    const leadSubscribers = database.collection(DBCollectionsEnum.lead_subscribers);
    await leadSubscribers.createIndex({ email: 1 }, { unique: true });
    await leadSubscribers.createIndex({ createdAt: -1 });

    const demoSessions = database.collection(DBCollectionsEnum.demo_sessions);
    await demoSessions.createIndex({ createdAt: -1 });
    await demoSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  } catch (error) {
    console.error("❌ Error creating index:", error);
  }
};

const closeDatabase = async () => {
  if (dbClient) {
    await dbClient.close();
    console.info("✅ Database connection closed");
  }
};

// // Data Handling
const getDocumentFromDb = async (
  docId: any,
  collectionName: DBCollectionsEnum,
) => {
  try {
    const document = await readDocument(docId, collectionName);

    return document;
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

const getDocumentByFieldFromDb = async (
  field: string,
  value: string,
  collectionName: DBCollectionsEnum,
) => {
  try {
    const document = await readDocumentByField(field, value, collectionName);

    return document;
  } catch (error) {
    throw error;
  }
};

const getDocumentByQueryFromDb = async (
  query: Record<string, any>,
  collectionName: DBCollectionsEnum,
) => {
  try {
    const document = await readDocumentByQuery(query, collectionName);

    return document;
  } catch (error) {
    throw error;
  }
};

export const getDocumentsByQueryFromDb = async <T extends Document = Document>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
): Promise<WithId<T>[]> => {
  try {
    const collection: Collection<T> = database.collection<T>(collectionName);
    const documents = await collection.find(query).toArray();

    return documents;
  } catch (error) {
    console.error(
      `❌ Error fetching documents from ${collectionName} with query ${JSON.stringify(
        query,
      )}:`,
      error,
    );
    // Re-throw the error so the calling function's catch block can handle it
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

  // Optional: Add extra logging for debugging (consider sensitive data in queries)
  console.log(
    `Attempting deleteOne in collection "${collectionName}" with query:`,
    JSON.stringify(query),
  );

  try {
    if (!database) {
      throw new Error(
        "❌ Database is not initialized. Call databaseInit() first.",
      );
    }
    const collection: Collection = database.collection(collectionName);
    const result: DeleteResult = await collection.deleteOne(query);

    if (result.deletedCount === 1) {
      console.log(
        `✅ Successfully deleted 1 document from "${collectionName}" matching query.`,
      );
    } else {
      console.log(
        `ℹ️ No document found in "${collectionName}" matching query for deletion.`,
      );
    }

    return result; // Contains { acknowledged: boolean, deletedCount: number }
  } catch (error) {
    console.error(
      `❌ Database error during deleteOne in "${collectionName}" with query ${JSON.stringify(
        query,
      )}:`,
      error,
    );
    // Re-throw the error to be handled by the calling controller
    throw new Error(
      `Failed to delete document from ${collectionName}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

const saveUserDataToDb = async (user: User): Promise<ObjectId | undefined> => {
  try {
    const newUserId = await createDocument(user, DBCollectionsEnum.users);
    console.log("✅ User saved to DB successfully");
    return newUserId;
  } catch (error) {
    throw new Error("❌ Error saving user data to DB", { cause: error });
  }
};

const updateUserInDb = async (
  userDocId: string,
  updatedUserData: Partial<User>,
): Promise<WithId<Document> | undefined> => {
  try {
    const updatedUser = await updateDocument(
      userDocId,
      updatedUserData,
      DBCollectionsEnum.users,
    );

    if (!updatedUser) throw new Error("User not found or update failed");

    console.log("✅ User updated in DB successfully!");
    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user data in DB", error);
    throw new Error("❌ Error updating user data in DB", { cause: error });
  }
};

// Pagination utility function using MongoDB aggregation pipeline
const getPaginatedDocuments = async <T extends Document = Document>(
  query: Filter<T>,
  collectionName: DBCollectionsEnum,
  paginationParams: BaseFilters,
  options?: {
    customPipelineStages?: Record<string, any>[];
    sort?: Sort;
  },
): Promise<AggregationResult<T>> => {
  try {
    const { pageNumber, pageSize } = paginationParams;
    const collection: Collection<T> = database.collection<T>(collectionName);

    // Create sort object - use custom sort if provided, otherwise default to createdAt: -1
    const sort: Sort = options?.sort || { createdAt: -1 };
    const pipeline: Record<string, any>[] = [];
    pipeline.push({ $sort: sort });

    // Add custom pipeline stages before match if provided
    if (options?.customPipelineStages) {
      pipeline.push(...options.customPipelineStages);
    }

    // Match stage
    pipeline.push({ $match: query });

    // Facet stage to get both data and count in one query
    pipeline.push({
      $facet: {
        metadata: [
          { $count: "totalCount" },
          { $addFields: { pageNumber, pageSize } },
        ],
        results: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const aggregatedDocs = await collection.aggregate(pipeline).toArray();
    const { metadata, results } = aggregatedDocs[0] as AggregationResult<T>;
    const totalCount = metadata[0] ? metadata[0].totalCount : 0;
    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    return {
      metadata,
      results,
      paging: {
        pageNumber,
        pageSize,
        totalCount,
        totalPagesCount,
      },
    };
  } catch (error) {
    console.error(
      `❌ Error fetching paginated documents from ${collectionName}:`,
      error,
    );
    throw error;
  }
};

export {
  dbClient,
  database,
  databaseInit,
  getMongoDbUri,
  getDatabaseName,
  closeDatabase,
  getDocumentFromDb,
  getDocumentByFieldFromDb,
  getDocumentByQueryFromDb,
  getPaginatedDocuments,
  saveUserDataToDb,
  updateUserInDb,
};
