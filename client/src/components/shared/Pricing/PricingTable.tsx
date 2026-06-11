import {
  AutoAwesome as AutoAwesomeIcon,
  CheckOutlined,
  Close,
  Loyalty,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import {
  primaryColorOpaqueTen,
  primaryColorOpaqueThirty,
} from "src/application/shared/themes";

import { SubscriptionPlanEnum } from "src/shared/types/user";
import { useApplicationContext } from "src/application/store/Provider";
import { usePaymentCatalog } from "../Payment/usePaymentCatalog";
import { usePricing } from "./usePricing";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  textAlign: "left",
}));

interface PricingTableProps {}

const PricingTable: React.FC<PricingTableProps> = () => {
  usePaymentCatalog();

  const { plansForTable, getPrice, getCurrency } = usePricing();
  const tableFeatures = Object.keys(plansForTable[0].features);
  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();
  const tableBgColorOpaque =
    themeMode === "light" ? primaryColorOpaqueTen : primaryColorOpaqueThirty;

  return (
      <Container
        id="pricing-table"
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
            Pricing
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            We have a wide range of packages for you to choose from
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            backgroundImage: "none",
            backgroundColor: "transparent",
          }}
        >
          <Table sx={{ minWidth: 900 }} aria-label="pricing table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{
                    width: "20%",
                    verticalAlign: "top",
                  }}
                >
                  <Typography component="h3" variant="subtitle1">
                    Plans
                  </Typography>

                  <Loyalty
                    fontSize="large"
                    color="primary"
                    sx={{ mt: "1rem" }}
                  />
                </StyledTableCell>

                {plansForTable.map((plan) => (
                  <StyledTableCell
                    key={plan.title}
                    sx={{
                      width: "20%",
                      textAlign: "left",
                      verticalAlign: "top",
                      backgroundColor:
                        plan.title === SubscriptionPlanEnum.Basic
                          ? tableBgColorOpaque
                          : "transparent",
                    }}
                  >
                    <Box display="flex">
                      <Typography component="h3" variant="subtitle1">
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
                              ml: 1,
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
                            variant="h5"
                            sx={{
                              textDecoration: "line-through",
                              color: "gray",
                            }}
                          >
                            {getCurrency(plan.title)}
                            {plan.product.metadata.monthly_discounted_price}
                          </Typography>
                          &nbsp;
                          <Typography component="h4" variant="h5">
                            {getCurrency(plan.title)}
                            {getPrice(plan.product).monthly}
                          </Typography>
                          <Typography component="h4" variant="subtitle1">
                            /month
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography component="h4" variant="h5">
                            {getCurrency(SubscriptionPlanEnum.Essential)}0
                          </Typography>
                        </>
                      )}
                    </Box>
                    {plan.buttonText ? (
                      <Button
                        variant={plan.buttonVariant}
                        color="primary"
                        size="small"
                        sx={{ marginTop: "0.5rem", padding: "4px" }}
                        disabled={!!plan.buttonDisabled}
                        onClick={plan.buttonAction}
                      >
                        {plan.buttonText}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableFeatures.map((feature, index) => (
                <TableRow key={feature}>
                  <StyledTableCell component="th" scope="row">
                    {feature}
                  </StyledTableCell>
                  {plansForTable.map((plan) => {
                    const featureValue = plan.features[feature];
                    let cellContent;

                    if (typeof featureValue === "boolean") {
                      cellContent = featureValue ? (
                        <CheckOutlined color="success" />
                      ) : (
                        <Close color="error" />
                      );
                    } else if (
                      typeof featureValue === "number" ||
                      typeof featureValue === "string"
                    ) {
                      cellContent = featureValue;
                    } else {
                      cellContent = "-";
                    }

                    return (
                      <StyledTableCell
                        key={plan.title}
                        align="center"
                        sx={{
                          textAlign: "center",
                          backgroundColor:
                            plan.title === SubscriptionPlanEnum.Basic
                              ? tableBgColorOpaque
                              : "transparent",
                        }}
                      >
                        {cellContent}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
};

export default PricingTable;
