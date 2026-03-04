import { SubscriptionPlanEnum, User, UserType } from "../models/types";

const getUserType = (user: User): UserType => {
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

export default getUserType;
