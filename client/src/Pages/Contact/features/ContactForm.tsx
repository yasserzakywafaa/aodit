import { Box, Button, Grid, TextField } from "@mui/material";

import { SendOutlined } from "@mui/icons-material";
import { useContactContext } from "../store/Provider";

const ContactForm = () => {
  const {
    store: { state },
    manager: { handleUpdateContactForm, handleSubmitContactForm },
  } = useContactContext();

  const handleOnFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateContactForm(name, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmitContactForm(state.contactForm);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            name="name"
            label="Name"
            value={state.contactForm.name}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={state.contactForm.email}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            name="subject"
            label="Subject"
            value={state.contactForm.subject}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            multiline
            fullWidth
            rows={4}
            name="message"
            label="Message"
            value={state.contactForm.message}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" endIcon={<SendOutlined />}>
            Send Message
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactForm;
