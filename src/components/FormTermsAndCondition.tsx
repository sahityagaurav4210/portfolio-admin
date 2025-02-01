import { Box, Grid, Link, Typography } from "@mui/material";
import { ReactNode } from "react";
import { TbHandFingerRight } from "react-icons/tb";

function FormTermsAndCondition(): ReactNode {
  return (
    <>
      <Grid item xs={12} mt={1}>
        <Box sx={{ display: "flex", alignItems: "center", }}>
          <TbHandFingerRight className="mx-1 text-neutral-500" size={12} />
          <Typography fontFamily="Roboto" variant="caption" className="text-neutral-400">
            By clicking on login, you agree to our{" "}
            <Link href="#">terms and condition.</Link>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", }}>
          <TbHandFingerRight className="mx-1 text-neutral-500" size={16} />
          <Typography variant="caption" fontFamily="Roboto" className="text-neutral-400">
            If you don't have your login credentials, then please contact &nbsp;
            <Link href="#">administrator</Link>
          </Typography>
        </Box>
      </Grid>
    </>
  );
}

export default FormTermsAndCondition;
