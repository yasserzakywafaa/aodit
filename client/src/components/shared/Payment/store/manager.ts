import { Price, Product } from "src/shared/types/payment";
import { SubscriptionPlanEnum, User } from "src/shared/types/user";
import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { PaymentStore } from "./store";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { loadStripe } from "@stripe/stripe-js";
import { isPrerendering } from "src/shared/utils/prerender";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";

export interface PaymentManager {
  setUp: () => void;
  handleGetPublishableKey: () => void;
  handleGetPricesList: () => void;
  handleGetProductsListWithPrices: () => void;
  handleCreateCheckoutSession: (
    priceId: string,
    priceObject: Price,
    plan: SubscriptionPlanEnum,
    user: User | null,
    options?: { mode?: "payment" | "subscription"; credits?: number },
  ) => Promise<void>;
}

export const usePaymentManager = (store: PaymentStore): PaymentManager => {
  const {
    store: {
      state: { trackingInfo },
    },
    manager: { handleIsFetching },
  } = useApplicationContext();

  const setUp = async () => {
    if (isPrerendering()) return;

    handleGetPublishableKey();
    handleGetPricesList();
    handleGetProductsListWithPrices();
  };

  const handleGetPublishableKey = async (): Promise<any> => {
    try {
      const response: AxiosResponse<
        { publishableKey: string },
        { publishableKey: string }
      > = await axios.get(END_POINTS.PAYMENTS.CONFIG, {
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": new Date().toISOString(),
        },
      });

      store.setPublishableKey(response.data.publishableKey);

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(`❌  Failed to get Stripe Publishable Key!  ${error}`);
    }
  };

  const handleGetPricesList = async (): Promise<any> => {
    try {
      const response: AxiosResponse<Price[], Price[]> = await axios.get(
        END_POINTS.PAYMENTS.GET_PRICES_LIST,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );

      store.setPrices(response.data);

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(`❌  Failed to get Stripe Publishable Key!  ${error}`);
    }
  };

  const handleGetProductsListWithPrices = async (): Promise<Product[]> => {
    try {
      const response: AxiosResponse<any> = await axios.get(
        END_POINTS.PAYMENTS.GET_PRODUCTS_LIST_WITH_PRICES,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );

      store.setProducts(response.data);

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(
        `❌  Failed to get Stripe Product with Prices!  ${error}`,
      );
    }
  };

  const handleCreateCheckoutSession = async (
    priceId: string,
    priceObject: Price,
    subscriptionPlan: SubscriptionPlanEnum,
    user: User | null,
    options?: { mode?: "payment" | "subscription"; credits?: number },
  ): Promise<any> => {
    if (!user) return;
    if (isPrerendering()) return;

    try {
      // Create a Checkout Session on the server and get the sessionId
      const response: AxiosResponse<{ sessionId: string }> = await axios.post(
        END_POINTS.PAYMENTS.CREATE_CHECKOUT_SESSION,
        {
          metadata: {
            priceId,
            priceObject,
            subscriptionPlan,
            userId: user._id,
            success_url: `${window.location.origin}${routes.dashboard.billing.paymentStatus(
              "{CHECKOUT_SESSION_ID}",
            )}`,
            cancel_url: `${window.location.href}`,
            googleAnalyticsClientId: trackingInfo.clientId,
            mode: options?.mode ?? "subscription",
            credits: options?.credits,
          },
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );
      const { sessionId } = response.data;

      // Load Stripe only when the user actually starts checkout
      const publishableKey = store.state.publishableKey;
      if (!publishableKey) return;

      const stripe = await loadStripe(publishableKey);
      if (!stripe) return;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      handleIsFetching(false);

      if (error) {
        console.error("Error redirecting to Stripe:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      handleIsFetching(false);
    }
  };

  return {
    setUp,
    handleGetPublishableKey,
    handleGetPricesList,
    handleGetProductsListWithPrices,
    handleCreateCheckoutSession,
  };
};
