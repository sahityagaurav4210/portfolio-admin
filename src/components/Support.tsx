import { Box, Typography } from "@mui/material";
import React, { ReactNode, useMemo } from "react";

function Support(): ReactNode {
  const appVersion = useMemo(() => import.meta.env.VITE_APP_VERSION, [import.meta.env.VITE_APP_VERSION]);
  const supportEmail = useMemo(() => import.meta.env.VITE_SUPPORT_EMAIL, [import.meta.env.VITE_SUPPORT_EMAIL]);

  return (
    <Box component="div" className="flex flex-col justify-center items-end px-1">
      <Typography variant="caption" className="text-justify">
        If you have any questions or need assistance, feel free to contact our{" "}
        <Box
          component="a"
          href={`mailto:${supportEmail}`}
          className="text-blue-700 underline underline-offset-2 decoration-dotted font-bold"
        >
          support team
        </Box>
      </Typography>

      <Typography variant="caption">App Version: {appVersion}</Typography>
    </Box>
  );
}

export default React.memo(Support);
