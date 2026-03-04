import { Box, Card, CardContent } from "@mui/material";

const ContactMap = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ width: "100%", height: "380px" }}>
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86456.63225631765!2d8.454163987330201!3d47.37741205299691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900b9749bea219%3A0xe66e8df1e71fdc03!2sZ%C3%BCrich%2C%20Switzerland!5e0!3m2!1sen!2spt!4v1720853356629!5m2!1sen!2spt"
          ></iframe>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactMap;
