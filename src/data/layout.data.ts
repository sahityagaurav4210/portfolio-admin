import { ILayout } from "../interfaces";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { AppStrings } from "../i18n";
import { AccountTree, AddHome, Home } from "@mui/icons-material";

const SIDEBAR_ITEMS: Array<ILayout> = [
  {
    name: "HomePage",
    url: "/",
    Icon: Home,
  },
  {
    name: "Dashboard",
    url: `/${AppStrings.ROUTES.DASHBOARD}`,
    Icon: DashboardIcon,
  },
  {
    name: "Hirings",
    url: `/${AppStrings.ROUTES.HIRINGS}`,
    Icon: WorkIcon,
  },
  {
    name: "Views",
    url: `/${AppStrings.ROUTES.VIEW_DETAILS}`,
    Icon: VisibilityIcon,
  },
  {
    name: "Contacts",
    url: `/${AppStrings.ROUTES.CONTACTS}`,
    Icon: ContactEmergencyIcon,
  },
  {
    name: "Skills",
    url: `/${AppStrings.ROUTES.SKILLS}`,
    Icon: WidgetsIcon,
  },
  {
    name: "Hero Section",
    url: `/${AppStrings.ROUTES.HERO}`,
    Icon: AddHome,
  },
  {
    name: "Projects",
    url: `/${AppStrings.ROUTES.PROJECTS}`,
    Icon: AccountTree,
  },
];

export default SIDEBAR_ITEMS;
