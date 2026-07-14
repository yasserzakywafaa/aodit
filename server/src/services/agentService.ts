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
} from "../models/mongoDb";

import { Agent } from "src/models/types/agent";
import CONFIG from "../config";

/**
 * On-prem invariant: every agent must carry its own evaluator endpoint and
 * default evaluator model id. Without them the judge model would silently
 * fall back to CONFIG.OPENROUTER_BASE_URL and leak out of the tenant's
 * network. Cloud mode keeps both fields optional.
 */
const assertOnPremEvaluatorFields = (data: Partial<Agent>): void => {
  if (!CONFIG.ON_PREM) return;

  const url = data.evaluatorUrl?.trim();
  const model = data.evaluatorModel?.trim();

  if (!url) {
    throw new Error(
      "On-prem: Evaluator URL is required on the agent. " +
        "Configure Evaluator (Judge) Endpoint on the Agent page.",
    );
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("invalid protocol");
    }
  } catch {
    throw new Error(
      "On-prem: Evaluator URL must be a valid http(s):// base URL " +
        "(e.g. http://10.0.0.5:1234/v1).",
    );
  }

  if (!model) {
    throw new Error(
      "On-prem: Default evaluator model is required on the agent. " +
        "Set the model id loaded on your evaluator endpoint.",
    );
  }
};

const getAgentsCount = async (): Promise<number> => {
  const collection: Collection<Agent> = database.collection<Agent>(
    DBCollectionsEnum.agents,
  );
  return await collection.countDocuments();
};

const createAgent = async (data: any): Promise<Agent> => {
  assertOnPremEvaluatorFields(data);
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
  data: Partial<
    Pick<
      Agent,
      | "name"
      | "description"
      | "intent"
      | "ownerName"
      | "agentUrl"
      | "evaluatorUrl"
      | "evaluatorApiKey"
      | "evaluatorModel"
      | "status"
    >
  >,
): Promise<Agent | null> => {
  assertOnPremEvaluatorFields(data);
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
