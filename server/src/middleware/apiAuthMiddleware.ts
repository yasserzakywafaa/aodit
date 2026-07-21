import { DBCollectionsEnum, getDocumentByQueryFromDb } from "../models/mongoDb";
import { RequestHandler } from "express";

import { ObjectId } from "mongodb";
import { User } from "../models/types";
import { createApiKeyAuthMiddleware } from "@yasserzakywafaa/server-core";

class UserMissingIdError extends Error {}

const INTERNAL_API_KEY_HEADER = "x-aodit-api-key-internal";

const coreApiAuthMiddleware = createApiKeyAuthMiddleware<
  User & { _id: ObjectId }
>({
  resolveUser: async (apiKey) => {
    const user = (await getDocumentByQueryFromDb(
      { "subscription.api.apiKey": apiKey },
      DBCollectionsEnum.users,
    )) as User | null;

    if (!user) {
      console.warn(
        `⚠️  API Auth Failed: No user found for API key ending in ...${apiKey.slice(
          -4,
        )}`,
      );
      return null;
    }

    if (!user._id) {
      console.error(
        `❌  API Auth Error: User found for key ...${apiKey.slice(
          -4,
        )} but missing _id.`,
      );
      throw new UserMissingIdError();
    }

    console.log(
      `✅ API Auth Success: User ${user._id} authenticated via API key.`,
    );
    return user as User & { _id: ObjectId };
  },
  messages: {
    invalidKey: "❌  Unauthorized: Invalid API key.",
  },
  headerName: INTERNAL_API_KEY_HEADER,
  scheme: null,
});

export const apiAuthMiddleware: RequestHandler = (
  request,
  response,
  next,
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).json({
      error:
        "❌  Unauthorized: Missing or invalid Authorization header. Use 'Bearer <API_KEY>'.",
    });
    return;
  }

  const apiKey = authHeader.split(" ")[1];
  if (!apiKey) {
    response.status(401).json({
      error: "❌  Unauthorized: API key is missing.",
    });
    return;
  }

  request.headers[INTERNAL_API_KEY_HEADER] = apiKey;
  coreApiAuthMiddleware(request, response, (error?: unknown) => {
    delete request.headers[INTERNAL_API_KEY_HEADER];
    if (error instanceof UserMissingIdError) {
      response
        .status(500)
        .json({ error: "❌  Internal server error during authentication." });
      return;
    }
    if (error) {
      console.error("❌ Error during API key authentication:", error);
      next(error);
      return;
    }

    next();
  });
};
