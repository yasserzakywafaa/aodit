import { DBCollectionsEnum, database } from ".";

import { ObjectId } from "mongodb";

// Create a new document
export const createDocument = async (
  data: any,
  collectionName: DBCollectionsEnum,
) => {
  const collection = database.collection(collectionName);
  const result = await collection.insertOne(data);

  return result.insertedId;
};

// Read a document by ID
export const readDocument = async (
  docId: any,
  collectionName: DBCollectionsEnum,
) => {
  const documents = database.collection(collectionName);
  const document = await documents.findOne({ _id: docId });

  return document;
};

// Read a document by ID
export const readDocumentByField = async (
  field: string,
  value: string,
  collectionName: DBCollectionsEnum,
) => {
  try {
    const documents = database.collection(collectionName);
    const document = await documents.findOne({ [field]: value });

    return document;
  } catch (error) {
    throw new Error("❌ Failed to get document by field!", { cause: error });
  }
};

// Read a document by query
export const readDocumentByQuery = async (
  query: Record<string, any>,
  collectionName: DBCollectionsEnum,
) => {
  try {
    const documents = database.collection(collectionName);
    const document = await documents.findOne(query, {
      sort: { createdAt: -1 },
    });

    return document;
  } catch (error) {
    throw new Error("❌ Failed to get document by query!", { cause: error });
  }
};

// Update a document by ID
export const updateDocument = async <T>(
  docId: string,
  fieldsToUpdate: Partial<T>,
  collectionName: DBCollectionsEnum,
) => {
  try {
    const documents = database.collection(collectionName);
    const results = await documents.findOneAndUpdate(
      { _id: new ObjectId(docId) },
      { $set: fieldsToUpdate },
      { returnDocument: "after" },
    );
    console.log(`✅ Document updated in collection: ${collectionName}.`);

    return results;
  } catch (error) {
    console.error(`❌ Error updating document:`, error);
    throw new Error("❌ Failed to update document!", { cause: error });
  }
};

// Delete a document by ID
export const deleteDocument = async (
  docId: string,
  collectionName: DBCollectionsEnum,
) => {
  const documents = database.collection(collectionName);
  try {
    const result = await documents.deleteOne({ _id: new ObjectId(docId) });
    console.log(
      `✅ Document deleted successfully in collection: ${collectionName}.`,
    );

    return result.deletedCount === 1;
  } catch (error) {
    throw new Error("❌ Failed to delete document!", {
      cause: error,
    });
  }
};

// Create new bulk documents
export const createBulkDocuments = async (
  documents: any[],
  collectionName: DBCollectionsEnum,
) => {
  try {
    const collection = database.collection(collectionName);
    const results = await collection.insertMany(documents);

    return results;
  } catch (error) {
    throw new Error("❌ Error saving documents in bulk:", { cause: error });
  }
};
