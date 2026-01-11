// theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    A100?: string;
    A200?: string;
    A700?: string;
  }

  interface SimplePaletteColorOptions {
    A100?: string;
    A200?: string;
    A700?: string;
  }
}
