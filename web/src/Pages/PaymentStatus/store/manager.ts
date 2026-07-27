import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { PaymentStatusDataResponse } from "./state";
import { PaymentStatusStore } from "./store";
import { useApplicationContext } from "src/application/store/Provider";

export interface PaymentStatusManager {
  setUp: () => void;
  handleGetPaymentStatusData: (sessionId: string) => Promise<void>;
}

export const usePaymentStatusManager = (
  store: PaymentStatusStore
): PaymentStatusManager => {
  const {
    store: {
      state: { auth },
    },
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const setUp = async () => {
    await handleGetPaymentStatusData(store.state.sessionData.id);
  };

  const handleGetPaymentStatusData = async (sessionId: string) => {
    try {
      const response: AxiosResponse<
        PaymentStatusDataResponse,
        PaymentStatusDataResponse
      > = await axios.get(END_POINTS.PAYMENTS.GET_CHECKOUT_SESSION_DATA, {
        params: {
          sessionId,
          userId: auth.user?._id,
        },
      });
      const status = response.data.session.status;
      const paymentStatus = response.data.session.payment_status;

      if (status === "complete" && paymentStatus === "paid") {
        store.setShowPaymentSuccess(true);

        store.updatePaymentData({
          ...response.data.session,
          subscription: response.data.subscriptionItem,
        });

        handleSetAuthInfo({
          isAuthenticated: true,
          user: response.data.user,
        });
        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(response.data.user)
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Notify({
        //   content: error.response.data.message,
        //   type: ToastTypes.Error,
        // });
      } else {
        // Notify({
        //   content: `Oops! Something went wrong.\n${error}`,
        //   type: ToastTypes.Error,
        // });
      }
      throw new Error(`❌  Failed to get the Session data!  ${error}`);
    }
  };

  return {
    setUp,
    handleGetPaymentStatusData,
  };
};
