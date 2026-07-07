import { Box, Typography } from "@mui/material";

import BotExclamationMarks from "../../../assets/images/bot_exclamation_marks.webp";

const NoResultsFound: React.FC<{ text: string }> = ({
  text = "No Results Found",
}) => {
  return (
    <>
      <Box component="div" className="no-results-container" sx={{
        width: "100%"
      }}>
        <Box
          component="div"
          className="no-results-wrapper "
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            p: 3
          }}>
          <Box component="div" className="no-results-image">
            <img src={BotExclamationMarks} width="100%" />
          </Box>

          <Box
            component="div"
            className="unauthorized-card-wrapper"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}>
            <Typography variant="h5">{text}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NoResultsFound;
