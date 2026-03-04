import { User } from "./user"; // Assuming User type is in './user' or adjust path as needed
import { ObjectId } from "mongodb";

// Augment the Express Request interface to include the 'user' property
declare global {
  namespace Express {
    export interface Request {
      // Make user optional as it's only added after successful authentication
      user?: User & { _id: ObjectId };
    }
  }
}

// Export something to make it a module (even if empty)
export {};
