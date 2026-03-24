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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2713.5!2d8.3042!3d47.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ffa2a9dbbf269%3A0x4dfc3b39b0893a92!2sMurbacherstrasse%2019%2C%206003%20Luzern%2C%20Switzerland!5e0!3m2!1sen!2sch!4v1700000000000!5m2!1sen!2sch"
          ></iframe>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactMap;
