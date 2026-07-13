import CONFIG from "../config";
import { Request, Response } from "express";
import {
  createTokenService,
  RefreshTokenPayload,
  TokenPair,
  TokenPayload,
  TokenService as CoreTokenService,
} from "@yasserzakywafaa/server-core";

type AccessTokenInput = Omit<TokenPayload, "iat" | "exp">;
type RefreshTokenInput = Omit<RefreshTokenPayload, "iat" | "exp">;

let coreTokenService:
  | CoreTokenService<TokenPayload, RefreshTokenPayload>
  | undefined;

const getCoreTokenService = (): CoreTokenService<
  TokenPayload,
  RefreshTokenPayload
> => {
  coreTokenService ??= createTokenService<TokenPayload, RefreshTokenPayload>({
    jwtSecret: CONFIG.JWT_SECRET ?? "",
    environment: CONFIG.NODE_ENV,
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
    cookies: {
      accessTokenName: "accessToken",
      refreshTokenName: "refreshToken",
      options: {
        httpOnly: true,
        secure: CONFIG.IS_PROD,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      },
      clearOptions: {
        httpOnly: true,
        secure: CONFIG.IS_PROD,
        sameSite: "strict",
        path: "/",
      },
    },
  });

  return coreTokenService;
};

export class TokenService {
  static generateAccessToken(payload: AccessTokenInput): string {
    return getCoreTokenService().generateAccessToken(payload as TokenPayload);
  }

  static generateRefreshToken(payload: RefreshTokenInput): string {
    return getCoreTokenService().generateRefreshToken(
      payload as RefreshTokenPayload,
    );
  }

  static generateTokenPair(
    user: { userId: string; email: string },
    tokenVersion: number = 0,
  ): TokenPair {
    const accessTokenPayload: TokenPayload = {
      userId: user.userId,
      email: user.email,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      ...accessTokenPayload,
      tokenVersion,
    };

    return getCoreTokenService().generateTokenPair(
      accessTokenPayload,
      refreshTokenPayload,
    );
  }

  static verifyAccessToken(token: string): TokenPayload {
    return getCoreTokenService().verifyAccessToken(token);
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return getCoreTokenService().verifyRefreshToken(token);
  }

  static setTokenCookies(response: Response, tokenPair: TokenPair): void {
    getCoreTokenService().setTokenCookies(response, tokenPair);
  }

  static clearTokenCookies(response: Response): void {
    getCoreTokenService().clearTokenCookies(response);
  }

  static extractTokenFromCookies(request: Request): {
    accessToken?: string;
    refreshToken?: string;
  } {
    return getCoreTokenService().extractTokenFromCookies(request);
  }
}
