import { DashboardUserState, getDashboardUserInitialState } from "./state";
import { SubscriptionPlanEnum, User, UserRole } from "src/shared/types/user";

import { useState } from "react";

export interface DashboardUserStore {
  state: DashboardUserState;
  setIsFetching: (isFetching: boolean) => void;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  setIsPaidUser: (isPaidUser: boolean) => void;
  setProjectsCount: (projectsCount: number) => void;
  setSubscriptionType: (subscriptionType: string) => void;
  setMaxProjectsAllowed: (maxProjectsAllowed: number) => void;
  setPaymentStatus: (paymentStatus: string) => void;
  setApiAccessAllowed: (apiAccessAllowed: boolean) => void;
  setIsUpdating: (isUpdating: boolean) => void;
}

const useDashboardUserStore = (): DashboardUserStore => {
  const initialState = getDashboardUserInitialState();
  const [state, setState] = useState<DashboardUserState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setUser = (user: User | null) => {
    setState((prev) => {
      const newState = {
        ...prev,
        user,
      };

      // Initialize editable fields when user is set
      if (user) {
        newState.role = user.role;
        newState.isPaidUser = user.isPaidUser;
        newState.projectsCount = user.reportsCount;
        newState.subscriptionType =
          user.subscription?.type || SubscriptionPlanEnum.Free;
        newState.maxProjectsAllowed =
          user.subscription?.maxProjectsAllowed || 0;
        newState.paymentStatus =
          (user.subscription as any)?.paymentStatus || "unpaid";
        newState.apiAccessAllowed =
          user.subscription?.api?.apiAccessAllowed || false;
      } else {
        const defaultState = getDashboardUserInitialState();
        newState.role = defaultState.role;
        newState.isPaidUser = defaultState.isPaidUser;
        newState.projectsCount = defaultState.projectsCount;
        newState.subscriptionType = defaultState.subscriptionType;
        newState.maxProjectsAllowed = defaultState.maxProjectsAllowed;
        newState.paymentStatus = defaultState.paymentStatus;
        newState.apiAccessAllowed = defaultState.apiAccessAllowed;
      }

      return newState;
    });
  };

  const setProjectsCount = (count: number) => {
    setState((prev) => ({
      ...prev,
      projectsCount: count,
    }));
  };

  const setRole = (role: UserRole) => {
    setState((prev) => ({
      ...prev,
      role,
    }));
  };

  const setIsPaidUser = (isPaidUser: boolean) => {
    setState((prev) => ({
      ...prev,
      isPaidUser,
    }));
  };

  const setSubscriptionType = (subscriptionType: string) => {
    setState((prev) => ({
      ...prev,
      subscriptionType,
    }));
  };

  const setMaxProjectsAllowed = (maxProjectsAllowed: number) => {
    setState((prev) => ({
      ...prev,
      maxProjectsAllowed,
    }));
  };

  const setPaymentStatus = (paymentStatus: string) => {
    setState((prev) => ({
      ...prev,
      paymentStatus,
    }));
  };

  const setApiAccessAllowed = (apiAccessAllowed: boolean) => {
    setState((prev) => ({
      ...prev,
      apiAccessAllowed,
    }));
  };

  const setIsUpdating = (isUpdating: boolean) => {
    setState((prev) => ({
      ...prev,
      isUpdating,
    }));
  };

  return {
    state,
    setIsFetching,
    setUser,
    setProjectsCount,
    setRole,
    setIsPaidUser,
    setSubscriptionType,
    setMaxProjectsAllowed,
    setPaymentStatus,
    setApiAccessAllowed,
    setIsUpdating,
  };
};

export default useDashboardUserStore;
