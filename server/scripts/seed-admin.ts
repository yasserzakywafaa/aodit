/**
 * seed-admin.ts
 *
 * Bootstraps the first super_admin account in a fresh MongoDB instance.
 * Run ONCE after first deployment:
 *
 *   docker compose -f docker-compose.onprem.yml exec aodit \
 *     sh -c "ADMIN_EMAIL=admin@bank.internal ADMIN_PASSWORD=SecurePass123 node build/scripts/seed-admin.js"
 *
 * Or locally (from the /server directory):
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret123 yarn seed:admin
 *
 * Required env vars:
 *   ADMIN_EMAIL        — email address for the admin account
 *   ADMIN_PASSWORD     — password (min 8 chars); stored as a bcrypt hash
 *   MONGODB_URI_PROD   — MongoDB connection URI (falls back to MONGODB_URI)
 *
 * Optional env vars:
 *   ADMIN_FIRST_NAME   — defaults to "Admin"
 *   ADMIN_LAST_NAME    — defaults to ""
 *
 * The script is idempotent — it skips creation if a user with the given email
 * already exists.
 */

import dotenv from "dotenv";
import path from "path";

// Load .env from the server root (one level above scripts/)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || "";
  const mongoUri = process.env.MONGODB_URI_PROD || process.env.MONGODB_URI;

  if (!email || !password || !mongoUri) {
    console.error(
      "❌  Required env vars missing.\n" +
        "    Set: ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI_PROD (or MONGODB_URI)",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌  ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log("✅  Connected to MongoDB.");

    // Target the production database directly — seed is always a prod bootstrap task
    const db = client.db("aodit_prod");
    const users = db.collection("users");

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await users.findOne({ email: normalizedEmail });

    if (existing) {
      console.log(
        `ℹ️   Admin user already exists: ${normalizedEmail}. Skipping.`,
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    await users.insertOne({
      userId: `email-${randomUUID()}`,
      email: normalizedEmail,
      passwordHash,
      name: { givenName: firstName, familyName: lastName },
      picture: "",
      role: "super_admin",
      status: "active",
      provider: "email",
      verified: true,
      isPaidUser: false,
      projectCount: 0,
      createdAt: now,
      lastLogin: now,
      preferences: {
        theme: "dark",
        notifications: false,
        languagePreference: "en",
      },
      subscription: {
        id: "",
        type: "Free",
        startDate: now,
        maxProjectsAllowed: 500,
        endDate: now,
        paymentStatus: "unpaid",
        plan: undefined,
        price: undefined,
        api: {
          apiAccessAllowed: false,
          apiKey: "",
        },
      },
    });

    console.log(`✅  Super admin created: ${normalizedEmail}`);
    console.log(
      "ℹ️   You can now log in with the email and password you set.\n" +
        "    Then create additional users from the Admin → Users page.",
    );
  } finally {
    await client.close();
    console.log("✅  MongoDB connection closed.");
  }
}

seedAdmin().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
