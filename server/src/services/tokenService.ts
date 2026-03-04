import {
  CookieOptions,
  RefreshTokenPayload,
  TokenPair,
  TokenPayload,
} from "../types/token";

import CONFIG from "../config";
import { Response } from "express";
import jwt from "jsonwebtoken";

export class TokenService {
  private static readonly ACCESS_TOKEN_EXPIRY = "15m";
  private static readonly REFRESH_TOKEN_EXPIRY = "7d";
  private static readonly COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: CONFIG.IS_PROD,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };

  static generateAccessToken(
    payload: Omit<TokenPayload, "iat" | "exp">,
  ): string {
    return jwt.sign(payload, CONFIG.JWT_SECRET!, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  static generateRefreshToken(
    payload: Omit<RefreshTokenPayload, "iat" | "exp">,
  ): string {
    return jwt.sign(payload, CONFIG.JWT_SECRET!, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
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

    return {
      accessToken: this.generateAccessToken(accessTokenPayload),
      refreshToken: this.generateRefreshToken(refreshTokenPayload),
    };
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, CONFIG.JWT_SECRET!) as TokenPayload;
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, CONFIG.JWT_SECRET!) as RefreshTokenPayload;
  }

  static setTokenCookies(response: Response, tokenPair: TokenPair): void {
    response.cookie("accessToken", tokenPair.accessToken, this.COOKIE_OPTIONS);

    response.cookie(
      "refreshToken",
      tokenPair.refreshToken,
      this.COOKIE_OPTIONS,
    );
  }

  static clearTokenCookies(response: Response): void {
    response.clearCookie("accessToken", {
      httpOnly: true,
      secure: CONFIG.IS_PROD,
      sameSite: "strict",
      path: "/",
    });

    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: CONFIG.IS_PROD,
      sameSite: "strict",
      path: "/",
    });
  }

  static extractTokenFromCookies(request: any): {
    accessToken?: string;
    refreshToken?: string;
  } {
    return {
      accessToken: request.cookies?.accessToken,
      refreshToken: request.cookies?.refreshToken,
    };
  }
}
