import { Collection, ObjectId } from "mongodb";
import {
  DBCollectionsEnum,
  database,
  getPaginatedDocuments,
} from "../models/mongoDb";
import {
  createDocument,
  deleteDocument,
  readDocument,
  updateDocument,
} from "../models/mongoDb/crudOperations";

import { Agent } from "src/models/types/agent";

const getAgentsCount = async (): Promise<number> => {
  const collection: Collection<Agent> = database.collection<Agent>(
    DBCollectionsEnum.agents,
  );
  return await collection.countDocuments();
};

const createAgent = async (data: any): Promise<Agent> => {
  const now = new Date().toISOString();
  const payload = {
    ...data,
    status: data.status || "active",
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
  delete payload._id;

  const insertedId = await createDocument(payload, DBCollectionsEnum.agents);
  const agent = await readDocument(
    insertedId as ObjectId,
    DBCollectionsEnum.agents,
  );
  return agent as unknown as Agent;
};

const getAgentById = async (agentId: string) => {
  return await readDocument(new ObjectId(agentId), DBCollectionsEnum.agents);
};

const getUserAgents = async (userId: string, page: number, limit: number) => {
  return await getPaginatedDocuments<Agent>(
    { userId } as any,
    DBCollectionsEnum.agents,
    { pageNumber: page, pageSize: limit },
  );
};

const getUserAgentsCount = async (userId: string): Promise<number> => {
  const collection: Collection<Agent> = database.collection<Agent>(
    DBCollectionsEnum.agents,
  );
  return await collection.countDocuments({ userId } as any);
};

const getAllAgents = async (page: number, limit: number) => {
  return await getPaginatedDocuments<Agent>(
    {} as any,
    DBCollectionsEnum.agents,
    { pageNumber: page, pageSize: limit },
  );
};

const updateAgent = async (
  agentId: string,
  data: Partial<Pick<Agent, "name" | "description" | "intent" | "ownerName" | "agentUrl" | "status">>,
): Promise<Agent | null> => {
  const now = new Date().toISOString();
  const payload = {
    ...data,
    updatedAt: now,
  };
  const updated = await updateDocument<Agent>(
    agentId,
    payload,
    DBCollectionsEnum.agents,
  );
  return updated as unknown as Agent | null;
};

const deleteAgent = async (agentId: string) => {
  return await deleteDocument(agentId, DBCollectionsEnum.agents);
};

const AgentServices = {
  getAgentsCount,
  createAgent,
  getAgentById,
  getUserAgents,
  getUserAgentsCount,
  getAllAgents,
  updateAgent,
  deleteAgent,
};

export default AgentServices;
