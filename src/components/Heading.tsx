import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { IHeadingProp } from "../interfaces/component_props.interface";

function Heading({ text, Icon }: Readonly<IHeadingProp>): React.ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Icon
        fontSize={isMobile ? "medium" : "large"}
        sx={{ color: theme.palette.warning.main }}
        fontWeight={700}
      />
      <Typography
        variant={isMobile ? "h6" : "h4"}
        color={theme.palette.primary.main}
        fontWeight={700}
      >
        {text}
      </Typography>
    </Box>
  );
}

export default React.memo(Heading);
