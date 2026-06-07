import { Box, CircularProgress, Typography } from "@mui/material";
import React, { ReactNode } from "react";

function VerifyingRequest(): ReactNode {
  return (
    <Box component="div" className="h-full flex items-center justify-center gap-x-2">
      <CircularProgress size={16} color="secondary" />
      <Typography variant="body1" color="secondary">
        Verifying request...
      </Typography>
    </Box>
  );
}

export default React.memo(VerifyingRequest);
