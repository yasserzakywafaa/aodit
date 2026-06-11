import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import { usePaymentContext } from "src/components/shared/Payment/store/Provider";
import { usePricingModalContext } from "./store/Provider";

export const PricingModal = () => {
  const {
    store: { state, handleTogglePricingModal },
  } = usePricingModalContext();

  const {
    store: {
      state: { prices },
    },
  } = usePaymentContext();

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && reason === "backdropClick") return;

    handleCloseModal();
  };

  const handleCloseModal = () => {
    handleTogglePricingModal();
  };

  return (
    <>
      <Dialog
        maxWidth="md"
        scroll="paper"
        fullWidth={true}
        open={state.isVisible}
        onClose={onCloseModal}
      >
        <DialogContent>
          {state.isVisible && !prices.length && (
            <LoaderSpinner position="absolute" />
          )}
          {state.isVisible && <Pricing />}
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="close"
            variant="contained"
            startIcon={<Close />}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
