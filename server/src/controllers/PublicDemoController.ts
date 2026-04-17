import { NextFunction, Request, Response } from "express";
import {
  createDemoSession,
  runDemoAsync,
} from "../services/reports/publicExecutionEngine";

import { DBCollectionsEnum } from "../models/mongoDb";
import { MODEL_REGISTRY } from "../services/reports/modelRegistry";
import { ObjectId } from "mongodb";
import { database } from "../models/mongoDb";

const VALID_MODEL_IDS = new Set(
  Object.values(MODEL_REGISTRY).map((m) => m.id),
);

const startDemo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { systemPrompt, modelId } = req.body as {
      systemPrompt?: string;
      modelId?: string;
    };

    if (!systemPrompt || typeof systemPrompt !== "string" || systemPrompt.trim().length === 0) {
      res.status(400).json({ error: "systemPrompt is required." });
      return;
    }

    if (systemPrompt.length > 2000) {
      res.status(400).json({ error: "systemPrompt must be 2000 characters or fewer." });
      return;
    }

    if (!modelId || !VALID_MODEL_IDS.has(modelId)) {
      res.status(400).json({
        error: `Invalid modelId. Accepted values: ${[...VALID_MODEL_IDS].join(", ")}`,
      });
      return;
    }

    const sessionId = await createDemoSession(systemPrompt.trim(), modelId);

    // Fire-and-forget — do not await
    runDemoAsync(sessionId, systemPrompt.trim(), modelId).catch((err) => {
      console.error("❌ runDemoAsync unhandled rejection:", err);
    });

    res.status(201).json({ sessionId });
  } catch (err) {
    next(err);
  }
};

const getDemoStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(sessionId);
    } catch {
      res.status(400).json({ error: "Invalid sessionId." });
      return;
    }

    const session = await database
      .collection(DBCollectionsEnum.demo_sessions)
      .findOne({ _id: objectId });

    if (!session) {
      res.status(404).json({ error: "Demo session not found." });
      return;
    }

    res.status(200).json({
      status: session.status,
      currentTurnIndex: session.currentTurnIndex,
      turns: session.turns ?? [],
      rawScore: session.rawScore ?? null,
      error: session.error ?? null,
    });
  } catch (err) {
    next(err);
  }
};

const PublicDemoController = { startDemo, getDemoStatus };
export default PublicDemoController;
