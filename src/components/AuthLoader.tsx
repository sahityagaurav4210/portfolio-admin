import { Box, CircularProgress, Typography } from "@mui/material";

function AuthLoader() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={1}
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress size={16} color="secondary" />
      <Typography variant="subtitle2">Logging you in, please wait</Typography>
    </Box>
  );
}

export default AuthLoader;
