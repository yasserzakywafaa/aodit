import APP_CONSTANTS from "src/application/shared/app_constants";
import { createSchemaHelpers } from "@yasserzakywafaa/client-core/web";

const baseUrl = APP_CONSTANTS.APP_URL || "https://www.aodit.ai";

export const {
  getBaseUrl,
  getAbsoluteUrl,
  formatDateISO,
  getImageUrl,
  createPersonSchema,
  createOrganizationSchema,
} = createSchemaHelpers(baseUrl);
