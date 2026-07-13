import { createSubscriptionTierChecker, hasAdminRights as hasAdminRightsCore } from "@yasserzakywafaa/client-core";
import { SubscriptionPlanEnum, User, UserRole } from "../types/user";

import { UserType } from "src/application/store/state";

const ADMIN_ROLES = [UserRole.super_admin, UserRole.admin] as const;

const getSubscriptionTier = createSubscriptionTierChecker({
  freePlan: SubscriptionPlanEnum.Free,
  plans: {
    Lite: SubscriptionPlanEnum.Lite,
    Basic: SubscriptionPlanEnum.Basic,
    Essential: SubscriptionPlanEnum.Essential,
    Premium: SubscriptionPlanEnum.Premium,
  },
});

export const hasAdminRights = (user: User | null): boolean =>
  hasAdminRightsCore(user, ADMIN_ROLES);

export const hasSuperAdminRights = (user: { role: string } | null): boolean =>
  user?.role === UserRole.super_admin;

export const getUserType = (user: User): UserType => {
  const subscriptionTier = getSubscriptionTier(user);

  return {
    ...subscriptionTier,
    isLiteUser: user.subscription?.type === SubscriptionPlanEnum.Lite,
    isBasicUser: user.subscription?.type === SubscriptionPlanEnum.Basic,
    isEssentialUser: user.subscription?.type === SubscriptionPlanEnum.Essential,
    isPremiumUser: user.subscription?.type === SubscriptionPlanEnum.Premium,
  };
};
