import { Grid } from "@mui/system";
import NotFoundImg from "../assets/404.jpg";
import { ReactNode } from "react";
import { Button, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";

function NotFound(): ReactNode {
  return (
    <Grid container rowSpacing={2}>
      <Grid size={12}>
        <img
          src={NotFoundImg}
          alt="404"
          className="h-full max-h-96 mx-auto"
          loading="lazy"
        />
      </Grid>

      <Grid size={12}>
        <Typography
          variant="subtitle1"
          fontFamily={"Roboto"}
          fontWeight={900}
          textAlign={"center"}
        >
          The page you're trying to access, does not exists in our web app
        </Typography>
      </Grid>

      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <Button
          variant="contained"
          startIcon={<Home fontSize="small" />}
          href="/"
        >
          Go to home
        </Button>
      </Grid>
    </Grid>
  );
}

export default NotFound;
