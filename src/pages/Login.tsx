import { Button, Grid, Link, TextField, Typography } from "@mui/material";
import { ReactNode } from "react";
import FormTermsAndCondition from "../components/FormTermsAndCondition";
import { useNavigate } from "react-router-dom";

function Login(): ReactNode {
  const navigate = useNavigate();

  return (
    <>
      <Grid container height="100vh" bgcolor="#F5EFFF">
        <Grid
          item
          bgcolor="white"
          xs={12}
          md={6}
          border={1}
          p={1}
          py={4}
          borderRadius={2}
          sx={{
            margin: "auto",
            marginX: { xs: 1, md: "auto" },
            boxShadow: "0px 0px 0.25rem 0.25rem grey",
          }}
        >
          <Typography variant="h3" textAlign="center">
            LOGIN FORM
          </Typography>
          <Grid container spacing={1} marginTop={0.25}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                type="tel"
                placeholder="Ex: +919646560135"
                fullWidth
                focused
                helperText="It should contain country code also"
                error={false}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                placeholder="Ex: Abc!123"
                helperText="It should contain at least one capital, one small, one digit and one special character."
              />
            </Grid>

            <Grid item xs={4}>
              <Button
                variant="contained"
                sx={{ width: { xs: "100%", md: "50%" } }}
                onClick={() => navigate("/home")}
              >
                LOGIN
              </Button>
            </Grid>

            <Grid
              item
              xs={8}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Link> Forgot your password</Link>
            </Grid>

            <FormTermsAndCondition />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
