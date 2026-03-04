import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import { ContactFormState } from "./state";
import { ContactStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";

export interface ContactManager {
  handleUpdateContactForm: (key: string, value: string) => void;
  handleSubmitContactForm: (state: ContactFormState) => void;
}

export const useContactManager = (store: ContactStore): ContactManager => {
  const handleUpdateContactForm = (key: string, value: string): void => {
    store.updateContactForm(key, value);
  };

  const handleSubmitContactForm = async (formState: ContactFormState) => {
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
    handleUpdateContactForm,
    handleSubmitContactForm,
  };
};
