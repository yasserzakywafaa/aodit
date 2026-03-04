export interface GoogleAnalyticsPayload {
  timestamp_micros: number; // Timestamp in milliseconds
  client_id: string;
  non_personalized_ads: boolean;
  events: GoogleAnalyticsPayloadEvent[];
}

export interface GoogleAnalyticsPayloadEvent {
  name: GoogleAnalyticsEventNameEnum;
  params: GoogleAnalyticsPayloadEventParams;
}

export interface GoogleAnalyticsPayloadEventParams {
  debug_mode: boolean;
  value: number; // Convert from cents to dollars/euros
  affiliation: string | undefined; // Source of the transaction
  currency: string;
  transaction_id: string | undefined;
  event_timestamp: number; // Timestamp in milliseconds
  items: GoogleAnalyticsPayloadEventParamsItem[];
}

export interface GoogleAnalyticsPayloadEventParamsItem {
  item_name: string;
  item_id: string;
  price: number;
  quantity: number;
  item_category: string;
}

export type GoogleAnalyticsEventNameEnum = "begin_checkout" | "purchase";
