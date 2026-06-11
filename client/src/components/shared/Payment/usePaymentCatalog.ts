import { useEffect } from "react";
import { isPrerendering } from "src/shared/utils/prerender";
import { usePaymentContext } from "./store/Provider";

let catalogInitStarted = false;

/** Loads Stripe price/product catalog without mounting a wrapper component. */
export const usePaymentCatalog = (): void => {
  const {
    manager: { setUp },
  } = usePaymentContext();

  useEffect(() => {
    if (isPrerendering()) return;
    if (catalogInitStarted) return;
    catalogInitStarted = true;
    setUp();
  }, [setUp]);
};
