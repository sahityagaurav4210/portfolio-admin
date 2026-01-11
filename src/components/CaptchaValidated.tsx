import { Verified } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";

function CaptchaValidated(): ReactNode {
  return (
    <Box
      component="div"
      display="flex"
      columnGap={1}
      className="min-w-4 max-w-max border p-2 font-bold bg-emerald-800 items-center rounded-md border-emerald-500 ring-1 ring-offset-1 ring-emerald-400 m-2 mx-3"
    >
      <Verified fontSize="small" sx={{ color: "white" }} />
      <Typography
        variant="body2"
        fontWeight={700}
        className="text-emerald-50 uppercase"
      >
        Captcha Validated
      </Typography>
    </Box>
  );
}

export default React.memo(CaptchaValidated);
