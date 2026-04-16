import { Request, Response, Router } from "express";

import CONFIG from "../config";

const configRouter = Router();

// Public endpoint — no auth required.
// Returns runtime flags the client needs before rendering (e.g. ON_PREM mode).
configRouter.get("/api/config", (_req: Request, res: Response) => {
  res.status(200).json({
    onPrem: CONFIG.ON_PREM,
  });
});

export default configRouter;
