import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import axios from "axios";

export const getAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    Notify({
      content: error.response.data.message,
      type: ToastTypes.Error,
    });
  } else {
    Notify({
      content: `An error happened!`,
      type: ToastTypes.Error,
    });
  }
};
