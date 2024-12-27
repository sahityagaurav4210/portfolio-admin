import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import { ReactNode } from "react";

function Home(): ReactNode {
  return (
    <>
      <AppBar
        sx={{ flexGrow: 1, top: 0, left: 0, pointerEvents: "none" }}
        position="sticky"
      >
        <Toolbar>
          <Typography variant="h6">Welcome, Gaurav</Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} px={2} mt={1}>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography variant="h4">Projects</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
