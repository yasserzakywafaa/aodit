import { NextFunction, Request, Response } from "express";

import { UserRole } from "../models/types";

export const requireAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (user.role !== UserRole.admin && user.role !== UserRole.super_admin) {
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }
  return next();
};
