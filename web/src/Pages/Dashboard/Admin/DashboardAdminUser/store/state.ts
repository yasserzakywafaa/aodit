import { SubscriptionPlanEnum, User, UserRole } from "src/shared/types/user";

export interface DashboardUserState {
  isFetching: boolean;
  user: User | null;
  role: UserRole;
  isPaidUser: boolean;
  projectsCount: number;
  subscriptionType: string;
  maxProjectsAllowed: number;
  paymentStatus: string;
  apiAccessAllowed: boolean;
  isUpdating: boolean;
}

export const getDashboardUserInitialState = (): DashboardUserState => {
  return {
    isFetching: false,
    user: null,
    projectsCount: 0,
    role: UserRole.user,
    isPaidUser: false,
    subscriptionType: SubscriptionPlanEnum.Free,
    maxProjectsAllowed: 0,
    paymentStatus: "unpaid",
    apiAccessAllowed: false,
    isUpdating: false,
  };
};
