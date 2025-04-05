import { ContactPage, Dashboard, Logout } from "@mui/icons-material";
import { createTheme } from "@mui/material";
import { Branding, Navigation } from "@toolpad/core";
import { BiBriefcase } from "react-icons/bi";
import AppLogo from '/portfolio-builder.jpg';
import { BsEye } from "react-icons/bs";

const AppNav: Navigation = [
  { segment: '', title: "Dashboard", icon: <Dashboard /> },
  { segment: "hirings", title: "Hirings", icon: <BiBriefcase /> },
  { segment: "today-views-details", title: "View details", icon: <BsEye /> },
  { segment: "contacts", title: "Contacts", icon: <ContactPage /> },
  { kind: "divider" },
  { segment: 'logout', title: "Logout", icon: <Logout /> },
]

const AppTheme = createTheme({
  colorSchemes: { light: true, dark: false }, breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const AppBranding: Branding = { title: "PORTFOLIO ADMIN", homeUrl: "/", logo: <img src={AppLogo} style={{ borderRadius: 5 }}></img> }

export { AppTheme, AppBranding, AppLogo, AppNav }