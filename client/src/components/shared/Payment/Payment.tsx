import { Elements } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { usePaymentContext } from "./store/Provider";

const PaymentWrapper: React.FC = () => {
  const {
    store: {
      state: { stripePromise },
    },
    manager: { setUp },
  } = usePaymentContext();

  useEffect(() => {
    setUp();
  }, []);

  return <Elements stripe={stripePromise} />;
};

export default PaymentWrapper;
