import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Layout from "../layouts";
import Home from "../pages/Home";
import Logout from "../views/Logout";
import Hirings from "../views/Hirings";
import TodayViewsDetails from "../views/TodayViewsDetails";
import Contact from "../views/Contact";

const AppRoutes = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'logout',
        Component: Logout,
      },
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: Home,
          },
          {
            path: 'hirings',
            Component: Hirings,
          },
          {
            path: 'today-views-details',
            Component: TodayViewsDetails,
          },
          {
            path: 'contacts',
            Component: Contact,
          },
        ],
      },
    ],
  },
]);

export default AppRoutes;
