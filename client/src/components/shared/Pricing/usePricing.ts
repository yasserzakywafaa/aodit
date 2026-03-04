import APP_CONSTANTS from "src/application/shared/app_constants";
import { Product } from "src/shared/types/payment";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";
import { usePaymentContext } from "../Payment/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

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
    if (!isAuthenticated) {
      handleToggleRegisterModal();
      return;
    }

    switch (subscriptionPlan) {
      case SubscriptionPlanEnum.Free:
        navigate(routes.dashboard.projects.create);
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
        if (!isAuthenticated) return "Create Projects";
        if (isFreeUser) return "Create Projects";
        else return "";

      case SubscriptionPlanEnum.Lite:
        if (!isAuthenticated) return "Register & Subscribe";
        if (isFreeUser) return "Upgrade";
        if (!isLiteUser && (isBasicUser || isEssentialUser || isPremiumUser))
          return "";
        else return "Current Plan";

      case SubscriptionPlanEnum.Basic:
        if (!isAuthenticated) return "Register & Subscribe";
        if (isFreeUser || isLiteUser) return "Upgrade";
        if (!isBasicUser && (isEssentialUser || isPremiumUser)) return "";
        else return "Current Plan";

      case SubscriptionPlanEnum.Essential:
        if (!isAuthenticated) return "Register & Subscribe";
        if (isFreeUser || isLiteUser || isBasicUser) return "Upgrade";
        if (!isBasicUser && !isEssentialUser && isPremiumUser) return "";
        else return "Current Plan";

      case SubscriptionPlanEnum.Premium:
        if (!isAuthenticated) return "Register & Subscribe";
        if (!isPremiumUser) return "Upgrade";
        else return "Current Plan";

      default:
        return "Upgrade";
    }
  };

  const plans: SubscriptionPlanProps[] = [
    {
      title: SubscriptionPlanEnum.Free,
      product: undefined,
      features: [
        "Free trial",
        "Save time on project creation",
        `Generate up to ${APP_CONSTANTS.MAX_APP_LIMIT_FREE} project`,
        "Basic project customization",
        "Projects are public",
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
        "Export Project to PDF",
        "Limited brand voice customization",
        "Limited project customization",
        `Generate up to ${APP_CONSTANTS.MAX_APP_LIMIT_LITE} projects/month`,
        "Publish to WordPress & Ghost",
        "Single project creation",
      ],
      buttonDisabled: isBasicUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Lite),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Lite),
    },
    {
      title: SubscriptionPlanEnum.Basic,
      subheader: "Popular",
      product: getMonthlyPlan(SubscriptionPlanEnum.Basic),
      features: [
        "Export Project to PDF",
        "Limited brand voice customization",
        "Advanced project customization",
        "Private projects",
        "Topics & Keywords related recommendations",
        "SEO-optimized content with keyword and interlinking",
        `Generate up to ${APP_CONSTANTS.MAX_APP_LIMIT_BASIC} projects/month`,
        "Publish to WordPress & Ghost",
        "Access to Metriz API",
        "Campaign creation for bulk generation",
        "Multi-client campaign management",
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
        "Export Project to PDF",
        "Enhanced brand voice customization",
        "Customizable project parameters",
        "Private projects",
        "High-quality Interlinking for SEO",
        "Topics & Keywords related recommendations",
        `Generate up to ${APP_CONSTANTS.MAX_APP_LIMIT_ESSENTIAL} projects/month`,
        "Publish to WordPress & Ghost",
        "Access to Metriz API",
        "Advanced campaign automation",
        "Bulk project generation at scale",
        "Multi-client campaign workflows",
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
        "Export Project to PDF",
        "Full brand voice customization",
        "Customizable project parameters",
        "High-quality Interlinking for SEO",
        "Private projects",
        "Topics & Keywords related recommendations",
        "Personalized project topic recommendations",
        "Advanced Customizable project parameters",
        "Priority content generation",
        `Generate up to ${APP_CONSTANTS.MAX_APP_LIMIT_PREMIUM} projects/month`,
        "Publish to WordPress & Ghost",
        "Automated project scheduling",
        "Full Access to Metriz API",
        "Enterprise campaign automation",
        "Unlimited bulk project generation",
        "Advanced multi-client management",
        "Scheduled campaign execution",
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
        "Save time on project creation": true,
        "Number of projects": APP_CONSTANTS.MAX_APP_LIMIT_FREE,
        "Project customization": false,
        "Visibility of Projects": "Public",
        "Export Project to PDF": false,
        "Brand voice customization": false,
        "Customizable project parameters": false,
        "Interlinking for SEO": false,
        "Topics & Keywords recommendations": false,
        "Priority content generation": false,
        "Auto Publish to WordPress & Ghost": false,
        "Automated project scheduling": false,
        "Access to Metriz API": false,
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
        "Save time on project creation": true,
        "Number of projects": APP_CONSTANTS.MAX_APP_LIMIT_LITE,
        "Project customization": "Basic",
        "Visibility of Projects": "Private",
        "Export Project to PDF": true,
        "Brand voice customization": "Limited",
        "Customizable project parameters": false,
        "Interlinking for SEO": "Basic",
        "Topics & Keywords recommendations": false,
        "Priority content generation": false,
        "Auto Publish to WordPress & Ghost": true,
        "Automated project scheduling": false,
        "Access to Metriz API": false,
      },
      buttonDisabled: isBasicUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Lite),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Lite),
    },
    {
      title: SubscriptionPlanEnum.Basic,
      subheader: "Popular",
      product: getMonthlyPlan(SubscriptionPlanEnum.Basic),
      features: {
        "Save time on project creation": true,
        "Number of projects": APP_CONSTANTS.MAX_APP_LIMIT_BASIC,
        "Project customization": "Flexible",
        "Visibility of Projects": "Private",
        "Export Project to PDF": true,
        "Brand voice customization": "Relaxed",
        "Customizable project parameters": false,
        "Interlinking for SEO": "Advanced",
        "Topics & Keywords recommendations": true,
        "Priority content generation": false,
        "Auto Publish to WordPress & Ghost": true,
        "Automated project scheduling": false,
        "Access to Metriz API": true,
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
        "Save time on project creation": true,
        "Number of projects": APP_CONSTANTS.MAX_APP_LIMIT_ESSENTIAL,
        "Project customization": "Advanced",
        "Visibility of Projects": "Private",
        "Export Project to PDF": true,
        "Brand voice customization": "Enhanced",
        "Customizable project parameters": false,
        "Interlinking for SEO": "High-quality",
        "Topics & Keywords recommendations": true,
        "Priority content generation": false,
        "Auto Publish to WordPress & Ghost": true,
        "Automated project scheduling": false,
        "Access to Metriz API": true,
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
        "Save time on project creation": true,
        "Number of projects": APP_CONSTANTS.MAX_APP_LIMIT_PREMIUM,
        "Project customization": "Full",
        "Visibility of Projects": "Private",
        "Export Project to PDF": true,
        "Brand voice customization": "Full",
        "Customizable project parameters": true,
        "Interlinking for SEO": "High-quality",
        "Topics & Keywords recommendations": true,
        "Priority content generation": true,
        "Auto Publish to WordPress & Ghost": true,
        "Automated project scheduling": true,
        "Access to Metriz API": "Full",
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
