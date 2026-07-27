import { Mode, PaymentStatus, SessionStatus } from "@yasserzakywafaa/client-core";
import {
  SubscriptionPlanEnum,
  User,
  UserSubscription,
} from "src/shared/types/user";

export interface PaymentStatusInitialState {
  isFetching: boolean;
  user?: User;
  sessionData: SessionData;
  showPaymentSuccess: boolean;
}

export interface SessionData {
  id: string;
  userId: string;
  amount_total: number;
  client_reference_id: string;
  currency: string;
  customer_details: {
    email: string;
    name: string;
  };
  invoice: {
    subscription_details: {
      metadata: {
        subscriptionPlan: string;
        userId: string;
      };
    };
  };
  livemode: false;
  locale: null;
  metadata: { subscriptionPlan: SubscriptionPlanEnum; userId: string };
  mode: Mode;
  payment_method_types: string[]; // ["card"]
  payment_status: PaymentStatus;
  status: SessionStatus;
  subscription?: UserSubscription;
}

export interface PaymentStatusDataResponse {
  session: SessionData;
  subscriptionItem: UserSubscription;
  user: User;
}

export const getPaymentStatusInitialState = (): PaymentStatusInitialState => {
  return {
    isFetching: false,
    user: undefined,
    showPaymentSuccess: false,
    sessionData: {
      id: "",
      userId: "",
      amount_total: 0,
      client_reference_id: "",
      currency: "eur",
      customer_details: {
        email: "",
        name: "",
      },
      invoice: {
        subscription_details: {
          metadata: {
            subscriptionPlan: SubscriptionPlanEnum.Essential,
            userId: "",
          },
        },
      },
      livemode: false,
      locale: null,
      metadata: {
        subscriptionPlan: SubscriptionPlanEnum.Essential,
        userId: "",
      },

      mode: "payment",
      payment_method_types: [], // ["card"]
      payment_status: "unpaid",
      status: "open",
      subscription: undefined,
    },
  };
};
