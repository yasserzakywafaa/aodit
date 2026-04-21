import { SubscriptionPlanEnum, User, UserRole } from "../types/user";

import { UserType } from "src/application/store/state";

export const hasSuperAdminRights = (user: User | null): boolean => {
  if (!user) return false;

  return user.role === UserRole.super_admin;
};

export const hasAdminRights = (user: User | null): boolean => {
  if (!user) return false;

  return user.role === UserRole.super_admin || user.role === UserRole.admin;
};

export const getUserType = (user: User): UserType => {
  return {
    isFreeUser:
      !user.isPaidUser && user.subscription?.type === SubscriptionPlanEnum.Free,
    isPaidUser: user.subscription?.type !== SubscriptionPlanEnum.Free,
    isLiteUser: user.subscription?.type === SubscriptionPlanEnum.Lite,
    isBasicUser: user.subscription?.type === SubscriptionPlanEnum.Basic,
    isEssentialUser: user.subscription?.type === SubscriptionPlanEnum.Essential,
    isPremiumUser: user.subscription?.type === SubscriptionPlanEnum.Premium,
  };
};
