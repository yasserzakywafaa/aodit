import AuthController from "../controllers/AuthController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

// Define API routes
authRouter.get(END_POINTS.AUTH.GOOGLE, AuthController.oauth2Google);

authRouter.get(
  END_POINTS.AUTH.GOOGLE_CALLBACK,
  AuthController.oauth2GoogleCallback
);
authRouter.get(END_POINTS.AUTH.LINKEDIN, AuthController.oauth2LinkedIn());
authRouter.get(
  END_POINTS.AUTH.LINKEDIN_CALLBACK,
  AuthController.oauth2LinkedInCallback
);
authRouter.post(
  END_POINTS.AUTH.PHONE_REGISTER_SEND_OTP,
  AuthController.sendPhoneRegisterOtp
);
authRouter.post(
  END_POINTS.AUTH.PHONE_REGISTER_VERIFY_OTP,
  AuthController.verifyPhoneRegisterOtp
);
authRouter.post(
  END_POINTS.AUTH.PHONE_LOGIN_SEND_OTP,
  AuthController.sendPhoneLoginOtp
);
authRouter.post(
  END_POINTS.AUTH.PHONE_LOGIN_VERIFY_OTP,
  AuthController.verifyPhoneLoginOtp
);

// Email + password auth
authRouter.post(END_POINTS.AUTH.EMAIL_REGISTER, AuthController.emailRegister);
authRouter.post(END_POINTS.AUTH.EMAIL_LOGIN, AuthController.emailLogin);

// Token Management Routes
authRouter.post(END_POINTS.AUTH.REFRESH_TOKEN, AuthController.refreshToken);
authRouter.post(END_POINTS.AUTH.LOGOUT, AuthController.logout);

// Protected Routes
authRouter.get(
  END_POINTS.AUTH.USER_INFO,
  authMiddleware,
  AuthController.getAuthUserInfo
);
authRouter.post(
  END_POINTS.AUTH.UPDATE_USER_INFO,
  authMiddleware,
  AuthController.updateUserInfo
);
authRouter.delete(
  END_POINTS.AUTH.DELETE_ACCOUNT,
  authMiddleware,
  AuthController.deleteAccount
);

export default authRouter;
