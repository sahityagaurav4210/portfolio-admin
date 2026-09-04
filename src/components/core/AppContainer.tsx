import React, { ReactNode } from "react";
import { IAppContainer } from "../../interfaces/component_props.interface";
import { Box, useTheme } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

function AppContainer({ children, arrow, showInfoIcon }: Readonly<IAppContainer>): ReactNode {
  const theme = useTheme();

  const arrowCss = arrow
    ? {
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-5px", // 4px (half the height) + 1px (for the border)
          left: "16px",
          width: "8px",
          height: "8px",
          // Match the box's background color so it masks the border underneath it
          backgroundColor: theme.palette.background.paper,
          // Only apply borders to the sides that stick out
          borderTop: "1px solid gainsboro",
          borderLeft: "1px solid gainsboro",
          transform: "rotate(45deg)",
          zIndex: 1, // Ensures the arrow renders on top of the box's straight border
        },
      }
    : {};

  return (
    <Box
      component="div"
      sx={{
        position: "relative",
        padding: 3,
        borderRadius: 2,
        my: 2,
        backgroundColor: theme.palette.background.paper,
        ...arrowCss,
        display: "flex",
        gap: 1,
        border: "1px solid gainsboro",
        alignItems: "center",
      }}
    >
      {!!showInfoIcon && <InfoOutlined fontSize="small" />}

      {children}
    </Box>
  );
}

export default React.memo(AppContainer);
