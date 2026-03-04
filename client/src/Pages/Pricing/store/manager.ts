import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { PricingFormState } from "./state";
import { PricingStore } from "./store";
import axios from "axios";

export interface PricingManager {
  handleUpdatePricingForm: (key: string, value: string) => void;
  handleSubmitPricingForm: (state: PricingFormState) => void;
}

export const usePricingManager = (store: PricingStore): PricingManager => {
  const handleUpdatePricingForm = (key: string, value: string): void => {
    store.updatePricingForm(key, value);
  };

  const handleSubmitPricingForm = async (formState: PricingFormState) => {
    store.handleIsFetching(true);

    try {
      await axios.post(
        END_POINTS.CONTACT.SUPPORT,
        {
          ...formState,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      Notify({
        content: "Email sent successfully",
        type: ToastTypes.Success,
      });

      store.resetFormState();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
      throw new Error(`❌  Failed to send email!  ${error}`);
    } finally {
      store.handleIsFetching(false);
    }
  };

  return {
    handleUpdatePricingForm,
    handleSubmitPricingForm,
  };
};
