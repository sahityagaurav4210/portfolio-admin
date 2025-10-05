import { createTheme } from "@mui/material";

const AppTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#193cb8", A100: "#83b5ff" },
    secondary: { main: "#94a3b8", A700: "#475569", A100: "#e2e8f0" },
    warning: { main: "#ea580c" },
    error: { main: "#fb2c36" },
    success: { A100: "#166534", main: "#00bc7c", A700: "#065f46" }
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedSizeSmall: {
          padding: "0.5rem"
        }
      }
    }
  }
});

export default AppTheme;