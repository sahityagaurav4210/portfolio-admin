import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Outlet } from "react-router-dom";
import Footer from "../views/Footer";

function PublicLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="div"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Box
        component="header"
        className="flex justify-between items-center min-h-[4vh]"
      >
        <Box component="div" className="max-w-max p-1 mx-1">
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={900}
            className="text-center"
            color="warning"
          >
            Coding Works
          </Typography>

          <Divider className="bg-blue-800 font-black h-1" />

          <Typography
            variant={isMobile ? "body1" : "h6"}
            fontWeight={900}
            className="text-center"
            color="success"
          >
            Portfolio Services
          </Typography>
        </Box>
      </Box>

      <Box component="main" sx={{ display: "flex", flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ display: "flex", flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default PublicLayout;
