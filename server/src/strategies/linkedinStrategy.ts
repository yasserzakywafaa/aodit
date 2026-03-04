import { AuthProviderEnum, User } from "../models/types";

import CONFIG from "../config";
import END_POINTS from "../models/endpoints";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import axios from "axios";
import jwt from "jsonwebtoken";
import passport from "passport";

export const configureLinkedInStrategy = () => {
  if (!CONFIG.LINKEDIN_CLIENT_ID || !CONFIG.LINKEDIN_CLIENT_SECRET) {
    console.warn("⚠️  LinkedIn OAuth credentials not configured");
    return;
  }

  const strategyOptions: any = {
    clientID: CONFIG.LINKEDIN_CLIENT_ID,
    clientSecret: CONFIG.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${CONFIG.SERVER_URL}${END_POINTS.AUTH.LINKEDIN_CALLBACK}`,
    scope: ["openid", "profile", "email"],
    skipUserProfile: true,
  };

  const strategy = new LinkedInStrategy(
    strategyOptions,
    async (accessToken, refreshToken, params: any, _profile, done) => {
      try {
        let claims: any = undefined;

        if (params && params.id_token) {
          claims = jwt.decode(params.id_token);
        }

        if (!claims && accessToken) {
          const { data } = await axios.get(
            "https://api.linkedin.com/v2/userinfo",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
          claims = data;
        }

        if (!claims) {
          throw new Error("Failed to obtain LinkedIn OIDC claims");
        }

        const user: Partial<User> = {
          userId: claims.sub,
          email: claims.email || "",
          name: {
            givenName: claims.given_name || "",
            familyName: claims.family_name || "",
          },
          picture: claims.picture || "",
          provider: AuthProviderEnum.linkedin,
          verified:
            typeof claims.email_verified === "boolean"
              ? claims.email_verified
              : true,
          refreshToken,
        };

        return done(null, user);
      } catch (error) {
        console.error("❌ LinkedIn OAuth strategy error:", error);
        return done(error as Error);
      }
    },
  );

  passport.use(strategy);
};
