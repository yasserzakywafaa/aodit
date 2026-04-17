import { Router } from "express";
import PublicDemoController from "../controllers/PublicDemoController";
import rateLimit from "express-rate-limit";

const router = Router();

// Strict limit on demo starts: 5 per IP per 15 minutes
const demoStartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many demo requests. Please try again later." },
});

// Relaxed limit on status polling: 300 per IP per 15 minutes (~1 poll/3s for 15 min)
const demoStatusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: "Too many polling requests. Please try again later." },
});

router.post(
  "/api/v1/public/demo/start",
  demoStartLimiter,
  PublicDemoController.startDemo,
);

router.get(
  "/api/v1/public/demo/:sessionId/status",
  demoStatusLimiter,
  PublicDemoController.getDemoStatus,
);

export default router;
