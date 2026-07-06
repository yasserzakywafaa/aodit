import CONFIG from "../config";
import {
  DBCollectionsEnum,
  database,
  getDocumentFromDb,
  getDocumentsByQueryFromDb,
} from "../models/mongoDb";
import { Report, ReportStatus } from "../models/types/report";
import { User, UserRole } from "../models/types/user";
import { ObjectId } from "mongodb";
import Stripe from "stripe";
import ReportServices from "./reportService";
import { stopReport } from "./reports/reportRunService";

const secretKey = CONFIG.IS_DEV
  ? CONFIG.STRIPE_TEST_SECRET_KEY
  : CONFIG.STRIPE_LIVE_SECRET_KEY;

const stripe = new Stripe(secretKey ?? "", { typescript: true });

export interface DeleteUserAccountOptions {
  blockAdminSelfDelete?: boolean;
}

export interface UserDeletionResult {
  deleted: {
    reports: number;
    agents: number;
  };
  warnings: string[];
}

const isAdminRole = (role: UserRole): boolean =>
  role === UserRole.admin || role === UserRole.super_admin;

const cleanupStripeForUser = async (user: User): Promise<string[]> => {
  const warnings: string[] = [];

  try {
    const subscriptionId = user.subscription?.id;
    if (subscriptionId) {
      await stripe.subscriptions.cancel(subscriptionId);
    }
  } catch (error) {
    console.error(
      "❌ Failed to cancel Stripe subscription during account deletion:",
      error,
    );
    warnings.push("stripe_subscription_cancel_failed");
  }

  try {
    if (user.stripeCustomerId) {
      await stripe.customers.del(user.stripeCustomerId);
    }
  } catch (error) {
    console.error(
      "❌ Failed to delete Stripe customer during account deletion:",
      error,
    );
    warnings.push("stripe_customer_delete_failed");
  }

  return warnings;
};

export const deleteUserAccount = async (
  userId: string,
  options: DeleteUserAccountOptions = {},
): Promise<UserDeletionResult> => {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = (await getDocumentFromDb(
    new ObjectId(userId),
    DBCollectionsEnum.users,
  )) as User | null;

  if (!user || !user._id) {
    throw new Error("User not found");
  }

  if (options.blockAdminSelfDelete && isAdminRole(user.role)) {
    throw new Error("Admin accounts cannot be deleted via self-service");
  }

  const userObjectId = user._id;
  const userIdString = userObjectId.toString();
  const warnings: string[] = [];

  const reports = (await getDocumentsByQueryFromDb<Report>(
    { userId: userIdString },
    DBCollectionsEnum.reports,
  )) as Report[];

  for (const report of reports) {
    if (report.status === ReportStatus.running && report._id) {
      try {
        await stopReport(report._id.toString());
      } catch (error) {
        console.error("❌ Failed to stop running report during deletion:", error);
        warnings.push("report_stop_failed");
      }
    }
  }

  for (const report of reports) {
    if (report._id) {
      await ReportServices.deleteReport(report._id.toString());
    }
  }

  warnings.push(...(await cleanupStripeForUser(user)));

  const agentsCollection = database.collection(DBCollectionsEnum.agents);
  const usersCollection = database.collection(DBCollectionsEnum.users);

  const agentsDeleteResult = await agentsCollection.deleteMany({
    userId: userIdString,
  });

  const userDeleteResult = await usersCollection.deleteOne({
    _id: userObjectId,
  });

  if (userDeleteResult.deletedCount === 0) {
    throw new Error("Failed to delete user account");
  }

  console.log("✅ User account deleted successfully:", {
    userId: userIdString,
    reportsDeleted: reports.length,
    agentsDeleted: agentsDeleteResult.deletedCount,
    warnings,
  });

  return {
    deleted: {
      reports: reports.length,
      agents: agentsDeleteResult.deletedCount,
    },
    warnings,
  };
};
