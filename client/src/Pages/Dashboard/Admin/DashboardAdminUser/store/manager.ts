import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { User, UserRole } from "src/shared/types/user";
import axios, { AxiosResponse } from "axios";

import { DashboardUserStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardUserManager {
  setUp: (userId: string) => Promise<void>;
  handleGetUser: (userId: string) => Promise<void>;
  handleGetProjectsCount: (userId: string) => Promise<void>;
  handleUpdateUserProfile: () => Promise<void>;
  hasChanges: () => boolean;
}

export const useDashboardUserManager = (
  store: DashboardUserStore,
): DashboardUserManager => {
  const handleGetUser = async (userId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<User> = await axios.get(
        END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(userId),
      );

      store.setUser(response.data);
    } catch (error) {
      console.error("❌ Failed to get user:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch user",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleGetProjectsCount = async (userId: string): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.USERS.GET_USER_PROJECTS_COUNT(userId),
      );

      store.setProjectsCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to get user projects count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch projects count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const hasChanges = (): boolean => {
    const {
      user,
      role,
      isPaidUser,
      projectsCount,
      subscriptionType,
      maxProjectsAllowed,
      paymentStatus,
      apiAccessAllowed,
    } = store.state;

    if (!user) return false;

    const roleChanged = role !== user.role;
    const isPaidUserChanged = isPaidUser !== user.isPaidUser;
    const projectsCountChanged = projectsCount !== user.projectsCount;

    let subscriptionChanged = false;
    if (user.subscription) {
      const currentApiAccessAllowed =
        user.subscription.api?.apiAccessAllowed || false;
      subscriptionChanged =
        subscriptionType !== user.subscription.type ||
        maxProjectsAllowed !== user.subscription.maxProjectsAllowed ||
        paymentStatus !==
          ((user.subscription as any)?.paymentStatus || "unpaid") ||
        apiAccessAllowed !== currentApiAccessAllowed;
    }

    return (
      roleChanged ||
      isPaidUserChanged ||
      projectsCountChanged ||
      subscriptionChanged
    );
  };

  const handleUpdateUserProfile = async (): Promise<void> => {
    const {
      user,
      role,
      isPaidUser,
      projectsCount,
      subscriptionType,
      maxProjectsAllowed,
      paymentStatus,
      apiAccessAllowed,
    } = store.state;

    if (!user || !hasChanges()) {
      return;
    }

    store.setIsUpdating(true);
    try {
      const updates: {
        role?: UserRole;
        isPaidUser?: boolean;
        projectsCount?: number;
        subscription?: {
          type?: string;
          maxProjectsAllowed?: number;
          paymentStatus?: string;
          api?: {
            apiAccessAllowed?: boolean;
          };
        };
      } = {};

      if (role !== user.role) {
        updates.role = role;
      }

      if (isPaidUser !== user.isPaidUser) {
        updates.isPaidUser = isPaidUser;
      }

      if (projectsCount !== user.projectsCount) {
        updates.projectsCount = projectsCount;
      }

      if (user.subscription) {
        const subscriptionUpdates: {
          type?: string;
          maxProjectsAllowed?: number;
          paymentStatus?: string;
          api?: {
            apiAccessAllowed?: boolean;
          };
        } = {};

        if (subscriptionType !== user.subscription.type) {
          subscriptionUpdates.type = subscriptionType;
        }

        if (maxProjectsAllowed !== user.subscription.maxProjectsAllowed) {
          subscriptionUpdates.maxProjectsAllowed = maxProjectsAllowed;
        }

        const currentPaymentStatus =
          (user.subscription as any)?.paymentStatus || "unpaid";
        if (paymentStatus !== currentPaymentStatus) {
          subscriptionUpdates.paymentStatus = paymentStatus;
        }

        const currentApiAccessAllowed =
          user.subscription.api?.apiAccessAllowed || false;
        if (apiAccessAllowed !== currentApiAccessAllowed) {
          subscriptionUpdates.api = {
            apiAccessAllowed,
          };
        }

        if (Object.keys(subscriptionUpdates).length > 0) {
          updates.subscription = subscriptionUpdates;
        }
      }

      const response: AxiosResponse<{ message: string; user: User }> =
        await axios.put(
          END_POINTS.DASHBOARD.USERS.UPDATE_USER_INFO(user._id),
          updates,
        );

      store.setUser(response.data.user);

      Notify({
        content: "User profile updated successfully",
        type: ToastTypes.Success,
      });
    } catch (error) {
      console.error("❌ Failed to update user profile:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to update user profile",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsUpdating(false);
    }
  };

  const setUp = async (userId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      await Promise.all([
        handleGetUser(userId),
        handleGetProjectsCount(userId),
      ]);
    } catch (error) {
      console.error("Failed to set up user page:", error);
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    setUp,
    handleGetUser,
    handleGetProjectsCount,
    handleUpdateUserProfile,
    hasChanges,
  };
};
