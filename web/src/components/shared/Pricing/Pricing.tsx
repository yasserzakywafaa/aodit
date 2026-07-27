import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LoaderSpinner from "../Loader/LoaderSpinner";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { usePaymentCatalog } from "../Payment/usePaymentCatalog";
import { usePricing } from "./usePricing";
import { useTranslation } from "react-i18next";

export const Pricing = () => {
  const { t } = useTranslation("page");
  usePaymentCatalog();

  const { plans, prices, getPrice, getCurrency } = usePricing();

  return (
    <Container
      id="pricing-cards"
      sx={{
        pt: { xs: 2, sm: 4 },
        pb: { xs: 2, sm: 4 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography component="h2" variant="h4" color="primary">
          {t("pricing.title")}
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{
          alignItems: "flex-start",
          justifyContent: "center"
        }}>
        {!prices.length && <LoaderSpinner position="absolute" />}

        {plans.map((plan) => {
          const isBasicPlan = plan.title === SubscriptionPlanEnum.Basic;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={plan.title}>
              <Card
                sx={{
                  paddingY: 2,
                  paddingX: 1,
                  minHeight: { xs: "", sm: "500px" },
                  flexBasis: "20%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: isBasicPlan ? "1px solid" : undefined,
                  borderColor: isBasicPlan ? "primary.main" : undefined,
                  backgroundColor: isBasicPlan
                    ? (t) => alpha(t.palette.primary.main, 0.1)
                    : undefined,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {plan.title}
                    </Typography>
                    {plan.subheader &&
                      plan.title !== SubscriptionPlanEnum.Free && (
                        <Chip
                          size="small"
                          variant="filled"
                          label={plan.subheader}
                          icon={<AutoAwesomeIcon />}
                          sx={{
                            backgroundColor: "primary.contrastText",
                            "& .MuiChip-label": {
                              color: "primary.dark",
                            },
                            "& .MuiChip-icon": {
                              color: "primary.dark",
                            },
                          }}
                        />
                      )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    {plan.product ? (
                      <>
                        <Typography
                          component="h4"
                          variant="h4"
                          sx={{
                            textDecoration: "line-through",
                            color: "gray",
                          }}
                        >
                          {getCurrency(plan.title)}
                          {plan.product.metadata.monthly_discounted_price}
                        </Typography>{" "}
                        &nbsp;
                        <Typography component="h4" variant="h4">
                          {getCurrency(plan.title)}
                          {getPrice(plan.product).monthly}
                        </Typography>
                        <Typography component="h4" variant="h6">
                          {t("pricing.perMonth")}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography component="h4" variant="h4">
                          {getCurrency(SubscriptionPlanEnum.Essential)}0
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Divider
                    sx={{
                      my: 2,
                      opacity: 0.2,
                      borderColor: "grey.500",
                    }}
                  />
                  {plan.features.map((feature) => (
                    <Box
                      key={feature}
                      sx={{
                        gap: 1.5,
                        paddingY: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          width: 20,
                          color:
                            plan.title === SubscriptionPlanEnum.Essential
                              ? "primary.light"
                              : "primary.main",
                        }}
                      />
                      <Typography component="span" variant="subtitle2">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>

                <CardActions>
                  {plan.buttonAction && plan.buttonText && (
                    <Button
                      fullWidth
                      component="button"
                      disabled={!!plan.buttonDisabled}
                      variant={plan.buttonVariant}
                      onClick={plan.buttonAction}
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
