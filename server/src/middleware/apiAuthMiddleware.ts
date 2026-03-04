import { DBCollectionsEnum, getDocumentByQueryFromDb } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb"; // Import ObjectId
import { User } from "../models/types";

export const apiAuthMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      error:
        "❌  Unauthorized: Missing or invalid Authorization header. Use 'Bearer <API_KEY>'.",
    });
  }

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey) {
    return response.status(401).json({
      error: "❌  Unauthorized: API key is missing.",
    });
  }

  try {
    // Find user by API key nested within subscription.api
    const user = (await getDocumentByQueryFromDb(
      { "subscription.api.apiKey": apiKey },
      DBCollectionsEnum.users
    )) as User | null;

    if (!user) {
      console.warn(
        `⚠️  API Auth Failed: No user found for API key ending in ...${apiKey.slice(
          -4
        )}`
      );
      return response
        .status(401)
        .json({ error: "❌  Unauthorized: Invalid API key." });
    }

    // Ensure _id exists before assigning (should always be true if user found)
    if (!user._id) {
      console.error(
        `❌  API Auth Error: User found for key ...${apiKey.slice(
          -4
        )} but missing _id.`
      );
      return response
        .status(500)
        .json({ error: "❌  Internal server error during authentication." });
    }

    // Attach user to request object for subsequent middleware/controllers
    // We know user and user._id exist here, satisfying the augmented Request type
    request.user = user as User & { _id: ObjectId };
    console.log(
      `✅ API Auth Success: User ${user._id} authenticated via API key.`
    );
    next();

    return;
  } catch (error) {
    console.error("❌ Error during API key authentication:", error);
    // Pass the error to the Express error handling middleware
    next(error);

    return;
  }
};
