import { memo, ReactNode } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { IModalHeading } from "../../interfaces/component_props.interface";

function ModalHeading({ text, Icon }: Readonly<IModalHeading>): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "warning.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon fontSize={isMobile ? "medium" : "large"} sx={{ color: "white" }} />
      </Box>
      <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
        {text}
      </Typography>
    </Box>
  );
}

export default memo(ModalHeading);
