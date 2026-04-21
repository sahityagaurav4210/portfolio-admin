import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <Box
      component="div"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Box component="main" sx={{ display: "flex", flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default PublicLayout;
