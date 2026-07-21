import { createAxiosErrorHandler } from "@yasserzakywafaa/client-core";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

export const getAxiosError = createAxiosErrorHandler(({ content, type }) =>
  Notify({ content, type: type as ToastTypes }),
);
