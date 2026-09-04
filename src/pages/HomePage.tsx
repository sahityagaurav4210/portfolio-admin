import { Box, Paper, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import AppImage from "../components/AppImage";

function HomePage(): ReactNode {
  const appVersion = import.meta.env.VITE_APP_VERSION;

  return (
    <Paper variant="elevation" component="div" className="p-4 m-1 border border-slate-400 min-h-96">
      <Box component="div" className="w-full h-full flex flex-col items-center justify-center">
        <AppImage url="/logo.jpeg" />
        <Typography variant="h5" sx={{ fontWeight: 700 }} className="uppercase">
          Welcome to Portfolio Builder Admin Panel
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }} className="uppercase italic">
          Version: {appVersion}
        </Typography>
      </Box>
    </Paper>
  );
}

export default React.memo(HomePage);
