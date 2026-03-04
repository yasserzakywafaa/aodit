import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardUsersStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { User } from "src/shared/types/user";

export interface DashboardUsersManager {
  setUp: () => Promise<void>;
  handleGetUsersByPage: (
    pageNumber?: number,
    pageSize?: number,
  ) => Promise<void>;
  handleBlockUser: (userId: string) => Promise<void>;
  handleUnblockUser: (userId: string) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
}

export const useDashboardUsersManager = (
  store: DashboardUsersStore,
): DashboardUsersManager => {
  const setUp = async () => {
    store.setIsFetching(false);

    try {
      await handleGetUsersByPage();
    } catch (error) {
      console.error("Failed to get all users:", error);
    }
  };

  const handleGetUsersByPage = async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<User[]>> =
        await axios.get(END_POINTS.DASHBOARD.USERS.GET_ALL_USERS, {
          params: {
            pageNumber,
            pageSize,
          },
        });

      store.setUsers(response.data.results as User[]);
      store.setPaging({
        pageNumber: response.data.paging.pageNumber,
        pageSize,
        totalCount: response.data.paging.totalCount,
        totalPagesCount: response.data.paging.totalPagesCount,
      });
    } catch (error) {
      console.error("❌ Failed to get all users:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch users",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleBlockUser = async (userId: string): Promise<void> => {
    try {
      await axios.post(END_POINTS.DASHBOARD.ADMIN.USERS.BLOCK_USER(userId));

      Notify({
        content: "User blocked successfully",
        type: ToastTypes.Success,
      });

      // Refresh the users list
      await handleGetUsersByPage();
    } catch (error) {
      console.error("❌ Failed to block user:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to block user",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleUnblockUser = async (userId: string): Promise<void> => {
    try {
      await axios.post(END_POINTS.DASHBOARD.ADMIN.USERS.UNBLOCK_USER(userId));

      Notify({
        content: "User unblocked successfully",
        type: ToastTypes.Success,
      });

      // Refresh the users list
      await handleGetUsersByPage();
    } catch (error) {
      console.error("❌ Failed to unblock user:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to unblock user",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      await axios.delete(END_POINTS.DASHBOARD.USERS.DELETE_USER(userId));

      Notify({
        content: "User deleted successfully",
        type: ToastTypes.Success,
      });

      // Refresh the users list
      await handleGetUsersByPage();
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to delete user",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleGetUsersByPage,
    handleBlockUser,
    handleUnblockUser,
    handleDeleteUser,
  };
};
