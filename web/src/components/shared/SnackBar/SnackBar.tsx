import { Card, CardContent, Snackbar } from "@mui/material";

import { white } from "src/application/shared/themes";

export interface SnackBarComponentProps {
  isVisible: boolean;
  autoHideDuration?: number | null;
  style?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  cardContentStyle?: React.CSSProperties;
  cardContentText: string;
  onClose?: () => void;
}

const SnackBarComponent = (props: SnackBarComponentProps) => {
  const {
    style,
    autoHideDuration = 2000,
    isVisible,
    cardStyle,
    cardContentStyle,
    cardContentText,
    onClose,
  } = props;

  const handleOnSnackBarClose = () => {
    onClose?.();
  };

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={autoHideDuration}
      sx={{
        ...style,
        bottom: "48px",
        left: "24px",
        fontSize: "0.75rem",
        textTransform: "capitalize",
      }}
      onClick={handleOnSnackBarClose}
      onClose={handleOnSnackBarClose}
    >
      <Card
        sx={{
          ...cardStyle,
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) =>
            theme.palette.mode === "light" ? theme.palette.primary.main : white,
        }}
      >
        <CardContent sx={{ ...cardContentStyle, p: "0.75rem !important" }}>
          {cardContentText}
        </CardContent>
      </Card>
    </Snackbar>
  );
};

export default SnackBarComponent;
