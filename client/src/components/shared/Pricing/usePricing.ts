import APP_CONSTANTS from "src/application/shared/app_constants";
import { Product, getCurrencySymbol } from "@yasserzakywafaa/client-core";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { routes } from "src/application/routes";
import { trackEvent } from "src/shared/utils/ga4";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";
import { usePaymentContext } from "../Payment/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useTranslation } from "react-i18next";

interface SubscriptionPlanProps {
  title: SubscriptionPlanEnum;
  subheader?: string;
  product?: Product;
  features: string[];
  buttonText: string;
  buttonDisabled?: boolean;
  buttonVariant: "text" | "outlined" | "contained";
  buttonAction?: () => void;
}

interface SubscriptionPlanTableProps {
  title: SubscriptionPlanEnum;
  subheader?: string;
  product?: Product;
  features: { [key: string]: string | number | boolean | undefined };
  buttonText: string;
  buttonDisabled?: boolean;
  buttonVariant: "text" | "outlined" | "contained";
  buttonAction?: () => void;
}

export const usePricing = () => {
  const { t } = useTranslation("page");
  const navigate = useNavigate();
  const {
    store: {
      state: {
        auth: { user, isAuthenticated },
        userType: {
          isFreeUser,
          isLiteUser,
          isBasicUser,
          isEssentialUser,
          isPremiumUser,
        },
      },
    },
    manager: { handleIsFetching },
  } = useApplicationContext();

  const {
    store: {
      state: { products, prices },
    },
    manager: { handleCreateCheckoutSession },
  } = usePaymentContext();

  const {
    store: {
      state: { isVisible: isPricingModalVisible },
      handleTogglePricingModal,
    },
  } = usePricingModalContext();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  const mapProductToMonthlyPlan = (plan: SubscriptionPlanEnum) => {
    const planName = plan.toLocaleLowerCase();

    const currentPlan = products.find((product) => {
      const productName = product.name.toLocaleLowerCase();
      if (
        productName.includes(planName) &&
        product.prices.find((price) => price.recurring?.interval === "month")
      ) {
        return product;
      } else return;
    });

    return currentPlan;
  };

  const mapProductToYearlyPlan = (plan: SubscriptionPlanEnum) => {
    const currentPlan = products.find((product) => {
      if (
        product.name.toLocaleLowerCase().includes(plan) &&
        product.prices.find((price) => price.recurring?.interval === "year")
      ) {
        return product;
      } else return;
    });

    return currentPlan;
  };

  const getMonthlyPlan = (plan: SubscriptionPlanEnum) => {
    return mapProductToMonthlyPlan(plan);
  };

  const getYearlyPlan = (plan: SubscriptionPlanEnum) => {
    return mapProductToYearlyPlan(plan);
  };

  const getPrice = (product: Product) => {
    const currentProductPrices = product.prices.flatMap((price) => price.id);

    const monthlyPrice = prices.find(
      (price) =>
        currentProductPrices.includes(price.id) &&
        price.recurring?.interval === "month",
    )?.unit_amount;

    const yearlyPrice = prices.find(
      (price) =>
        currentProductPrices.includes(price.id) &&
        price.recurring?.interval === "year",
    )?.unit_amount;

    const monthly = monthlyPrice ? monthlyPrice / 100 : 0;
    const yearly = yearlyPrice ? yearlyPrice / 100 : 0;

    return {
      monthly,
      yearly,
    };
  };

  const getCurrency = (plan: SubscriptionPlanEnum) => {
    const currency = prices.find(
      (price) => price.id === getMonthlyPlan(plan)?.default_price,
    )?.currency;

    return getCurrencySymbol(currency);
  };

  const handleOnSubscribeClick = async (
    subscriptionPlan: SubscriptionPlanEnum,
  ) => {
    trackEvent("subscribe_click", {
      plan: subscriptionPlan,
      is_authenticated: isAuthenticated,
    });

    if (!isAuthenticated) {
      handleToggleRegisterModal();
      return;
    }

    switch (subscriptionPlan) {
      case SubscriptionPlanEnum.Free:
        navigate(routes.dashboard.reports.create);
        return;

      case SubscriptionPlanEnum.Lite:
        try {
          handleIsFetching(true);
          const defaultPriceId = products.find((prod) => {
            const prodName = prod.name.toLocaleLowerCase();
            const planName = SubscriptionPlanEnum.Lite.toLocaleLowerCase();

            return prodName.includes(planName);
          })?.default_price;
          const currentPriceObject = prices.find(
            (price) => price.id === defaultPriceId,
          );

          if (!defaultPriceId || !currentPriceObject) return;

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            currentPriceObject,
            SubscriptionPlanEnum.Lite,
            user,
          );
          handleIsFetching(false);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          isPricingModalVisible && handleTogglePricingModal();
        }
        return;

      case SubscriptionPlanEnum.Basic:
        try {
          handleIsFetching(true);
          const defaultPriceId = products.find((prod) => {
            const prodName = prod.name.toLocaleLowerCase();
            const planName = SubscriptionPlanEnum.Basic.toLocaleLowerCase();

            return prodName.includes(planName);
          })?.default_price;
          const currentPriceObject = prices.find(
            (price) => price.id === defaultPriceId,
          );

          if (!defaultPriceId || !currentPriceObject) return;

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            currentPriceObject,
            SubscriptionPlanEnum.Basic,
            user,
          );
          handleIsFetching(false);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          isPricingModalVisible && handleTogglePricingModal();
        }
        return;

      case SubscriptionPlanEnum.Essential:
        try {
          handleIsFetching(true);
          const defaultPriceId = products.find((prod) => {
            const prodName = prod.name.toLocaleLowerCase();
            const planName = SubscriptionPlanEnum.Essential.toLocaleLowerCase();

            return prodName.includes(planName);
          })?.default_price;
          const currentPriceObject = prices.find(
            (price) => price.id === defaultPriceId,
          );

          if (!defaultPriceId || !currentPriceObject) return;

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            currentPriceObject,
            SubscriptionPlanEnum.Essential,
            user,
          );
          handleIsFetching(false);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          isPricingModalVisible && handleTogglePricingModal();
        }
        return;

      case SubscriptionPlanEnum.Premium:
        try {
          handleIsFetching(true);
          const defaultPriceId = products.find((prod) => {
            const prodName = prod.name.toLocaleLowerCase();
            const planName = SubscriptionPlanEnum.Premium.toLocaleLowerCase();

            return prodName.includes(planName);
          })?.default_price;
          const currentPriceObject = prices.find(
            (price) => price.id === defaultPriceId,
          );

          if (!defaultPriceId || !currentPriceObject) return;

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            currentPriceObject,
            SubscriptionPlanEnum.Premium,
            user,
          );
          handleIsFetching(false);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          isPricingModalVisible && handleTogglePricingModal();
        }
        return;

      default:
        return;
    }
  };

  const getButtonText = (plan: SubscriptionPlanEnum) => {
    switch (plan) {
      case SubscriptionPlanEnum.Free:
        if (!isAuthenticated) return t("pricing.cta.createProjects");
        if (isFreeUser) return t("pricing.cta.createProjects");
        else return "";

      case SubscriptionPlanEnum.Lite:
        if (!isAuthenticated) return t("pricing.cta.registerSubscribe");
        if (isFreeUser) return t("pricing.cta.upgrade");
        if (!isLiteUser && (isBasicUser || isEssentialUser || isPremiumUser))
          return "";
        else return t("pricing.cta.currentPlan");

      case SubscriptionPlanEnum.Basic:
        if (!isAuthenticated) return t("pricing.cta.registerSubscribe");
        if (isFreeUser || isLiteUser) return t("pricing.cta.upgrade");
        if (!isBasicUser && (isEssentialUser || isPremiumUser)) return "";
        else return t("pricing.cta.currentPlan");

      case SubscriptionPlanEnum.Essential:
        if (!isAuthenticated) return t("pricing.cta.registerSubscribe");
        if (isFreeUser || isLiteUser || isBasicUser) return t("pricing.cta.upgrade");
        if (!isBasicUser && !isEssentialUser && isPremiumUser) return "";
        else return t("pricing.cta.currentPlan");

      case SubscriptionPlanEnum.Premium:
        if (!isAuthenticated) return t("pricing.cta.registerSubscribe");
        if (!isPremiumUser) return t("pricing.cta.upgrade");
        else return t("pricing.cta.currentPlan");

      default:
        return t("pricing.cta.upgrade");
    }
  };

  const plans: SubscriptionPlanProps[] = [
    {
      title: SubscriptionPlanEnum.Free,
      product: undefined,
      features: [
        t("pricing.features.freeTrial"),
        t("pricing.features.saveTime"),
        t("pricing.features.generateUpToFree", {
          count: APP_CONSTANTS.MAX_APP_LIMIT_FREE,
        }),
        t("pricing.features.basicCustomization"),
        t("pricing.features.publicProjects"),
      ],
      buttonDisabled: false,
      buttonText: getButtonText(SubscriptionPlanEnum.Free),
      buttonVariant: isAuthenticated ? "outlined" : "contained",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Free),
    },
    {
      title: SubscriptionPlanEnum.Lite,
      subheader: "",
      product: getMonthlyPlan(SubscriptionPlanEnum.Lite),
      features: [
        t("pricing.features.exportPdf"),
        t("pricing.features.limitedBrandVoice"),
        t("pricing.features.limitedCustomization"),
        t("pricing.features.generateUpToMonthly", {
          count: APP_CONSTANTS.MAX_APP_LIMIT_LITE,
        }),
        t("pricing.features.publishWordpressGhost"),
        t("pricing.features.singleProjectCreation"),
      ],
      buttonDisabled: isBasicUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Lite),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Lite),
    },
    {
      title: SubscriptionPlanEnum.Basic,
      subheader: t("pricing.popular"),
      product: getMonthlyPlan(SubscriptionPlanEnum.Basic),
      features: [
        t("pricing.features.exportPdf"),
        t("pricing.features.limitedBrandVoice"),
        t("pricing.features.advancedCustomization"),
        t("pricing.features.privateProjects"),
        t("pricing.features.topicsKeywordsRelated"),
        t("pricing.features.seoOptimizedContent"),
        t("pricing.features.generateUpToMonthly", {
          count: APP_CONSTANTS.MAX_APP_LIMIT_BASIC,
        }),
        t("pricing.features.publishWordpressGhost"),
        t("pricing.features.apiAccess"),
        t("pricing.features.campaignBulk"),
        t("pricing.features.multiClientManagement"),
      ],
      buttonDisabled: isBasicUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Basic),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Basic),
    },
    {
      title: SubscriptionPlanEnum.Essential,
      product: getMonthlyPlan(SubscriptionPlanEnum.Essential),
      features: [
        t("pricing.features.exportPdf"),
        t("pricing.features.enhancedBrandVoice"),
        t("pricing.features.customizableParameters"),
        t("pricing.features.privateProjects"),
        t("pricing.features.highQualityInterlinking"),
        t("pricing.features.topicsKeywordsRelated"),
        t("pricing.features.generateUpToMonthly", {
          count: APP_CONSTANTS.MAX_APP_LIMIT_ESSENTIAL,
        }),
        t("pricing.features.publishWordpressGhost"),
        t("pricing.features.apiAccess"),
        t("pricing.features.advancedCampaignAutomation"),
        t("pricing.features.bulkGenerationScale"),
        t("pricing.features.multiClientWorkflows"),
      ],
      buttonDisabled: isEssentialUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Essential),
      buttonVariant: isBasicUser ? "contained" : "outlined",
      buttonAction: () =>
        handleOnSubscribeClick(SubscriptionPlanEnum.Essential),
    },
    {
      title: SubscriptionPlanEnum.Premium,
      product: getMonthlyPlan(SubscriptionPlanEnum.Premium),
      features: [
        t("pricing.features.exportPdf"),
        t("pricing.features.fullBrandVoice"),
        t("pricing.features.customizableParameters"),
        t("pricing.features.highQualityInterlinking"),
        t("pricing.features.privateProjects"),
        t("pricing.features.topicsKeywordsRelated"),
        t("pricing.features.personalizedTopics"),
        t("pricing.features.advancedCustomizableParameters"),
        t("pricing.features.priorityGeneration"),
        t("pricing.features.generateUpToMonthly", {
          count: APP_CONSTANTS.MAX_APP_LIMIT_PREMIUM,
        }),
        t("pricing.features.publishWordpressGhost"),
        t("pricing.features.automatedScheduling"),
        t("pricing.features.fullApiAccess"),
        t("pricing.features.enterpriseCampaignAutomation"),
        t("pricing.features.unlimitedBulkGeneration"),
        t("pricing.features.advancedMultiClient"),
        t("pricing.features.scheduledCampaignExecution"),
      ],
      buttonDisabled: isPremiumUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Premium),
      buttonVariant: isEssentialUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Premium),
    },
  ];

  const plansForTable: SubscriptionPlanTableProps[] = [
    {
      title: SubscriptionPlanEnum.Free,
      product: undefined,
      features: {
        [t("pricing.table.rowSaveTime")]: true,
        [t("pricing.table.rowNumberOfProjects")]:
          APP_CONSTANTS.MAX_APP_LIMIT_FREE,
        [t("pricing.table.rowProjectCustomization")]: false,
        [t("pricing.table.rowVisibility")]: t("pricing.table.valuePublic"),
        [t("pricing.table.rowExportPdf")]: false,
        [t("pricing.table.rowBrandVoice")]: false,
        [t("pricing.table.rowCustomizableParameters")]: false,
        [t("pricing.table.rowInterlinking")]: false,
        [t("pricing.table.rowTopicsKeywords")]: false,
        [t("pricing.table.rowPriorityGeneration")]: false,
        [t("pricing.table.rowAutoPublish")]: false,
        [t("pricing.table.rowScheduling")]: false,
        [t("pricing.table.rowApiAccess")]: false,
      },
      buttonDisabled: false,
      buttonText: getButtonText(SubscriptionPlanEnum.Free),
      buttonVariant: isAuthenticated ? "outlined" : "contained",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Free),
    },
    {
      title: SubscriptionPlanEnum.Lite,
      subheader: "",
      product: getMonthlyPlan(SubscriptionPlanEnum.Lite),
      features: {
        [t("pricing.table.rowSaveTime")]: true,
        [t("pricing.table.rowNumberOfProjects")]:
          APP_CONSTANTS.MAX_APP_LIMIT_LITE,
        [t("pricing.table.rowProjectCustomization")]:
          t("pricing.table.valueBasic"),
        [t("pricing.table.rowVisibility")]: t("pricing.table.valuePrivate"),
        [t("pricing.table.rowExportPdf")]: true,
        [t("pricing.table.rowBrandVoice")]: t("pricing.table.valueLimited"),
        [t("pricing.table.rowCustomizableParameters")]: false,
        [t("pricing.table.rowInterlinking")]: t("pricing.table.valueBasic"),
        [t("pricing.table.rowTopicsKeywords")]: false,
        [t("pricing.table.rowPriorityGeneration")]: false,
        [t("pricing.table.rowAutoPublish")]: true,
        [t("pricing.table.rowScheduling")]: false,
        [t("pricing.table.rowApiAccess")]: false,
      },
      buttonDisabled: isBasicUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Lite),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Lite),
    },
    {
      title: SubscriptionPlanEnum.Basic,
      subheader: t("pricing.popular"),
      product: getMonthlyPlan(SubscriptionPlanEnum.Basic),
      features: {
        [t("pricing.table.rowSaveTime")]: true,
        [t("pricing.table.rowNumberOfProjects")]:
          APP_CONSTANTS.MAX_APP_LIMIT_BASIC,
        [t("pricing.table.rowProjectCustomization")]:
          t("pricing.table.valueFlexible"),
        [t("pricing.table.rowVisibility")]: t("pricing.table.valuePrivate"),
        [t("pricing.table.rowExportPdf")]: true,
        [t("pricing.table.rowBrandVoice")]: t("pricing.table.valueRelaxed"),
        [t("pricing.table.rowCustomizableParameters")]: false,
        [t("pricing.table.rowInterlinking")]: t("pricing.table.valueAdvanced"),
        [t("pricing.table.rowTopicsKeywords")]: true,
        [t("pricing.table.rowPriorityGeneration")]: false,
        [t("pricing.table.rowAutoPublish")]: true,
        [t("pricing.table.rowScheduling")]: false,
        [t("pricing.table.rowApiAccess")]: true,
      },
      buttonDisabled: isBasicUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Basic),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Basic),
    },
    {
      title: SubscriptionPlanEnum.Essential,
      product: getMonthlyPlan(SubscriptionPlanEnum.Essential),
      features: {
        [t("pricing.table.rowSaveTime")]: true,
        [t("pricing.table.rowNumberOfProjects")]:
          APP_CONSTANTS.MAX_APP_LIMIT_ESSENTIAL,
        [t("pricing.table.rowProjectCustomization")]:
          t("pricing.table.valueAdvanced"),
        [t("pricing.table.rowVisibility")]: t("pricing.table.valuePrivate"),
        [t("pricing.table.rowExportPdf")]: true,
        [t("pricing.table.rowBrandVoice")]: t("pricing.table.valueEnhanced"),
        [t("pricing.table.rowCustomizableParameters")]: false,
        [t("pricing.table.rowInterlinking")]:
          t("pricing.table.valueHighQuality"),
        [t("pricing.table.rowTopicsKeywords")]: true,
        [t("pricing.table.rowPriorityGeneration")]: false,
        [t("pricing.table.rowAutoPublish")]: true,
        [t("pricing.table.rowScheduling")]: false,
        [t("pricing.table.rowApiAccess")]: true,
      },
      buttonDisabled: isEssentialUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Essential),
      buttonVariant: isBasicUser ? "contained" : "outlined",
      buttonAction: () =>
        handleOnSubscribeClick(SubscriptionPlanEnum.Essential),
    },
    {
      title: SubscriptionPlanEnum.Premium,
      product: getMonthlyPlan(SubscriptionPlanEnum.Premium),
      features: {
        [t("pricing.table.rowSaveTime")]: true,
        [t("pricing.table.rowNumberOfProjects")]:
          APP_CONSTANTS.MAX_APP_LIMIT_PREMIUM,
        [t("pricing.table.rowProjectCustomization")]: t("pricing.table.valueFull"),
        [t("pricing.table.rowVisibility")]: t("pricing.table.valuePrivate"),
        [t("pricing.table.rowExportPdf")]: true,
        [t("pricing.table.rowBrandVoice")]: t("pricing.table.valueFull"),
        [t("pricing.table.rowCustomizableParameters")]: true,
        [t("pricing.table.rowInterlinking")]:
          t("pricing.table.valueHighQuality"),
        [t("pricing.table.rowTopicsKeywords")]: true,
        [t("pricing.table.rowPriorityGeneration")]: true,
        [t("pricing.table.rowAutoPublish")]: true,
        [t("pricing.table.rowScheduling")]: true,
        [t("pricing.table.rowApiAccess")]: t("pricing.table.valueFull"),
      },
      buttonDisabled: isPremiumUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Premium),
      buttonVariant: isEssentialUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Premium),
    },
  ];

  return {
    plans,
    plansForTable,
    prices,
    getPrice,
    getCurrency,
    getMonthlyPlan,
    getYearlyPlan,
  };
};
