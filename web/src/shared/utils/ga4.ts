import { createGa4Tracker, isPrerendering } from "@yasserzakywafaa/client-core/web";
import APP_CONSTANTS from "src/application/shared/app_constants";

export interface Ga4PageViewParams {
  page_path: string;
  page_title: string;
  page_location: string;
}

export type AnalyticsEventName =
  | "subscribe_click"
  | "sign_up"
  | "login"
  | "nav_click"
  | "cta_click"
  | "pricing_modal_open"
  | "contact_submit"
  | "demo_start"
  | "lead_magnet_submit"
  | "scroll_depth";

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

const ga4Tracker = createGa4Tracker({
  isEnabled: () =>
    APP_CONSTANTS.IS_PROD &&
    Boolean(APP_CONSTANTS.GOOGLE_ANALYTICS_ID) &&
    !isPrerendering(),
});

export const isGa4Enabled = (): boolean =>
  APP_CONSTANTS.IS_PROD &&
  Boolean(APP_CONSTANTS.GOOGLE_ANALYTICS_ID) &&
  !isPrerendering();

export const trackGa4PageView = ga4Tracker.trackGa4PageView;

export const trackGa4Event = ga4Tracker.trackGa4Event;

export const trackEvent = (
  event: AnalyticsEventName,
  params: AnalyticsEventParams = {},
): void => {
  trackGa4Event(event, params);
};
