import { AppBar, Toolbar, Typography } from "@mui/material";
import { ReactNode } from "react";
import { INavbarProp } from "../interfaces/component_props.interface";

function Navbar({ username }: INavbarProp): ReactNode {
  return (
    <>
      <AppBar
        sx={{
          flexGrow: 1,
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        position="sticky"
      >
        <Toolbar>
          <Typography variant="h6">Welcome, {username}</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
