import {
  createBreadcrumbSchema,
  createProductListSchema,
  useSchemaOrg,
} from "src/shared/utils/schemaOrg";

import { Container } from "@mui/material";
import Page from "src/components/shared/Page/Page";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import { getCurrencyCode } from "@yasserzakywafaa/client-core";
import { routes } from "src/application/routes";
import { useDeviceSize } from "@yasserzakywafaa/client-core/web";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePaymentContext } from "src/components/shared/Payment/store/Provider";
import { usePricing } from "src/components/shared/Pricing/usePricing";
import { usePricingContext } from "./store/Provider";

const PricingPage = () => {
  const { t } = useTranslation("page");
  const {
    store: {
      state: { isFetching },
    },
  } = usePricingContext();

  const { isDesktop } = useDeviceSize();
  const { plans, getPrice } = usePricing();
  const {
    store: {
      state: { prices },
    },
  } = usePaymentContext();

  // Generate Product schemas for all pricing plans
  const productListSchema = useMemo(() => {
    if (!plans || plans.length === 0) return null;

    const pricingPlans = plans.map((plan) => {
      const priceData = plan.product
        ? getPrice(plan.product)
        : { monthly: 0, yearly: 0 };

      // Get actual currency code (EUR, USD, CHF) from prices, not symbol
      let currencyCode = "USD";
      if (plan.product && prices.length > 0) {
        const monthlyPrice = prices.find(
          (price) =>
            plan.product?.prices.some((p) => p.id === price.id) &&
            price.recurring?.interval === "month",
        );
        currencyCode = getCurrencyCode(monthlyPrice?.currency);
      }

      return {
        title: plan.title,
        product: plan.product,
        price: priceData.monthly,
        currency: currencyCode,
        interval: "month" as const,
      };
    });

    return createProductListSchema(pricingPlans);
  }, [plans, getPrice, prices]);

  // Generate Breadcrumb schema
  const breadcrumbSchema = useMemo(() => {
    const breadcrumbs = [
      { name: t("breadcrumb.home"), url: routes.features },
      { name: t("breadcrumb.pricing"), url: routes.pricing },
    ];
    return createBreadcrumbSchema(breadcrumbs);
  }, [t]);

  // Inject Schema.org structured data
  useSchemaOrg(productListSchema, "product-list-schema");
  useSchemaOrg(breadcrumbSchema, "breadcrumb-schema");

  return (
    <Page
      title={t("pricing.pageTitle")}
      className="pricing-page"
      isLoading={isFetching}
    >
      <Container
        className="pricing-container"
        sx={{
          pt: 4,
          pb: 4,
        }}
      >
        {isDesktop ? <PricingTable /> : <Pricing />}
      </Container>
    </Page>
  );
};

export default PricingPage;
