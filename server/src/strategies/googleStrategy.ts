import { AuthProviderEnum, User } from "../models/types";

import CONFIG from "../config";
import END_POINTS from "../models/endpoints";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

export const configureGoogleStrategy = () => {
  if (!CONFIG.GOOGLE_OAUTH_CLIENT_ID || !CONFIG.GOOGLE_OAUTH_CLIENT_SECRET) {
    console.warn("⚠️  Google OAuth credentials not configured");
    console.warn("🔧 GOOGLE_OAUTH_CLIENT_ID:", CONFIG.GOOGLE_OAUTH_CLIENT_ID);
    console.warn(
      "🔧 GOOGLE_OAUTH_CLIENT_SECRET:",
      CONFIG.GOOGLE_OAUTH_CLIENT_SECRET ? "***SET***" : "***MISSING***",
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: CONFIG.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: CONFIG.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: `${CONFIG.SERVER_URL}${END_POINTS.AUTH.GOOGLE_CALLBACK}`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user: Partial<User> = {
            userId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: {
              givenName: profile.name?.givenName || "",
              familyName: profile.name?.familyName || "",
            },
            picture: profile.photos?.[0]?.value || "",
            provider: AuthProviderEnum.google,
            verified: profile.emails?.[0]?.verified || false,
            refreshToken, // Only save if provided
          };

          return done(null, user);
        } catch (error) {
          console.error("❌ Google OAuth strategy error:", error);
          return done(error as Error);
        }
      },
    ),
  );
};
