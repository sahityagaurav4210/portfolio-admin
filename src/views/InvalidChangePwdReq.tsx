import { Warning } from "@mui/icons-material";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { memo, ReactNode } from "react";

function InvalidChangePwdReq(): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box component="div" className="h-full flex flex-col items-center justify-center" m={isMobile ? 2 : 0}>
      <Warning sx={{ fontSize: "5rem" }} color="error" />
      <Typography variant="h4" fontWeight={900}>Invalid access request</Typography>
      <Typography variant="body1" className="text-justify">Sorry, we could not process your request. Please try again.</Typography>
    </Box>
  );
}

export default memo(InvalidChangePwdReq);