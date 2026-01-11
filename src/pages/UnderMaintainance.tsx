import { Grid } from "@mui/system";
import UnderMaintainanceImg from "../assets/under-maintainance.png";
import { Button, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";

function UnderMaintainance() {
  return (
    <Grid container maxHeight="100vh" spacing={1}>
      <Grid size={12} maxHeight="80vh" mt={2}>
        <img
          src={UnderMaintainanceImg}
          alt="under maintainance"
          className="h-full mx-auto"
        />
      </Grid>
      <Grid size={12}>
        <Typography variant="h5" textAlign={"center"} fontWeight={900}>
          Sorry, the page you're trying to access is under-maintainance.
        </Typography>
      </Grid>
      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <Button
          variant="contained"
          href="/"
          startIcon={<Home fontSize="small" />}
        >
          Go to home
        </Button>
      </Grid>
    </Grid>
  );
}

export default UnderMaintainance;
