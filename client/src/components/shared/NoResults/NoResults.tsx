import { Box, Typography } from "@mui/material";

import BotExclamationMarks from "../../../assets/images/bot_exclamation_marks.webp";

const NoResultsFound: React.FC<{ text: string }> = ({
  text = "No Results Found",
}) => {
  return (
    <>
      <Box component="div" className="no-results-container" width="100%">
        <Box
          sx={{ p: 3 }}
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className="no-results-wrapper "
        >
          <Box component="div" className="no-results-image">
            <img src={BotExclamationMarks} width="100%" />
          </Box>

          <Box
            display="flex"
            component="div"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            className="unauthorized-card-wrapper"
          >
            <Typography variant="h5">{text}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NoResultsFound;
