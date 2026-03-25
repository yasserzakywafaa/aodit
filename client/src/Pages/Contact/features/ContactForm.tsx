import { Box, Button, Grid, TextField } from "@mui/material";

import { primaryColorOpaqueTen } from "src/application/shared/themes";
import { useContactContext } from "../store/Provider";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: primaryColorOpaqueTen,
    fontSize: 12,
    letterSpacing: "0.5px",
    "&:hover": { borderColor: "primary.main" },
    "&.Mui-focused": {
      borderColor: "primary.main",
      "& .MuiOutlinedInput-notchedOutline": { border: 0 },
    },
    "& fieldset": { border: 0 },
  },
};

const ContactForm = () => {
  const {
    store: { state },
    manager: { handleUpdateContactForm, handleSubmitContactForm },
  } = useContactContext();

  const handleChange =
    (key: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { value: string; name?: string } },
    ) => {
      const value = "value" in e.target ? e.target.value : "";
      handleUpdateContactForm(key, value);
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmitContactForm(state.contactForm);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
      <Grid container spacing={1.75}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            fullWidth
            name="name"
            placeholder="Your name"
            value={state.contactForm.name}
            onChange={handleChange("name")}
            sx={inputSx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="company"
            placeholder="Company"
            value={state.contactForm.company}
            onChange={handleChange("company")}
            sx={inputSx}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            type="email"
            name="email"
            placeholder="Work email"
            value={state.contactForm.email}
            onChange={handleChange("email")}
            sx={inputSx}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="message"
            placeholder="Describe your AI agent or use case (optional)"
            value={state.contactForm.message}
            onChange={handleChange("message")}
            sx={inputSx}
          />
        </Grid>
        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={state.isFetching}
            sx={{
              width: "100%",
              py: 2,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.3em",
              bgcolor: "primary.main",
              color: "background.default",
              border: 0,
              mt: 0.5,
              "&:hover": { bgcolor: "secondary.main" },
            }}
          >
            SUBMIT REQUEST →
          </Button>
          <Box
            component="p"
            sx={{
              fontSize: 10,
              color: "text.secondary",
              letterSpacing: "0.5px",
              textAlign: "center",
              mt: 1.5,
            }}
          >
            No spam. Your details are used only to process your rating request.
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactForm;
