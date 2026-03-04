import { DBCollectionsEnum, getDocumentFromDb } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb";
import { TokenService } from "../services/tokenService";
import { User } from "../models/types";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = TokenService.extractTokenFromCookies(req);

    if (!accessToken) {
      TokenService.clearTokenCookies(res);
      return res.status(401).json({ message: "No access token provided" });
    }

    // Verify access token
    const decoded = TokenService.verifyAccessToken(accessToken);

    const user = (await getDocumentFromDb(
      new ObjectId(decoded.userId),
      DBCollectionsEnum.users,
    )) as User;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("🔑 User Authenticated:", {
      name: `${user.name?.givenName} ${user.name?.familyName}`,
      email: user.email,
    });

    // Attach user to request
    req.user = user;
    return next();
  } catch (error) {
    console.error("❌ OAuth2 auth middleware error:", error);
    return res.status(401).json({ message: "Invalid access token" });
  }
};
