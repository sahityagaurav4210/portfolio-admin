import { Grid, Link, Typography } from "@mui/material";
import { ReactNode } from "react";

function FormTermsAndCondition(): ReactNode {
  return (
    <>
      <Grid item xs={12} mt={1}>
        <Typography variant="caption" color="grey" fontFamily="Roboto">
          By clicking on login, you agree to our{" "}
          <Link href="#">terms and condition.</Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption" color="grey" fontFamily="Roboto">
          If you don't have your login credentials, then please contact &nbsp;
          <Link href="#">administrator</Link>
        </Typography>
      </Grid>
    </>
  );
}

export default FormTermsAndCondition;
