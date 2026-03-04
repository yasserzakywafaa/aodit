import { configureGoogleStrategy } from "../strategies/googleStrategy";
import { configureLinkedInStrategy } from "../strategies/linkedinStrategy";
import passport from "passport";

export const initializePassport = () => {
  // Initialize Passport
  passport.initialize();

  // Configure OAuth strategies
  configureGoogleStrategy();
  configureLinkedInStrategy();
};
