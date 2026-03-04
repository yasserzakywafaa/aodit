export type PaymentStatus = "no_payment_required" | "paid" | "unpaid";

export type SessionStatus = "complete" | "expired" | "open";

export type Mode = "payment" | "setup" | "subscription";

// Stripe
export interface Product {
  id: string;
  object: "product";
  active: boolean;
  created: number;
  default_price?: string | Price | null;
  prices: Price[];
  deleted?: void;
  description: string | null;
  images: Array<string>;
  livemode: boolean;
  metadata: any;
  name: string;
  statement_descriptor?: string | null;
  unit_label?: string | null;
  updated: number;
  url: string | null;
}

export interface Plan {
  active: boolean;
  amount: number | null; // The unit amount in cents
  currency: string;
  interval: "day" | "month" | "week" | "year";
  livemode: boolean;
  metadata: { [name: string]: string };
  nickname: string | null;
  product: string;
  trial_period_days: number | null;
}

export interface Price {
  id: string;
  object: "price";
  active: boolean;
  billing_scheme: "per_unit" | "tiered";
  created: number;
  currency: string;
  deleted?: void;
  livemode: boolean;
  lookup_key: string | null;
  metadata: any;
  nickname: string | null;
  product: string | Product;
  recurring: PriceRecurring | null;
  type: "one_time" | "recurring";
  unit_amount: number | null;
  unit_amount_decimal: string | null;
}

export interface PriceRecurring {
  aggregate_usage: "last_during_period" | "last_ever" | "max" | "sum" | null;

  interval: "day" | "month" | "week" | "year";
  interval_count: number;
  meter: string | null;

  trial_period_days: number | null;
  usage_type: "licensed" | "metered";
}
