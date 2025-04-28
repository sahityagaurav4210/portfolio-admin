import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Layout from "../layouts";
import Home from "../pages/Home";
import Logout from "../views/Logout";
import Hirings from "../views/Hirings";
import TodayViewsDetails from "../views/TodayViewsDetails";
import Contact from "../views/Contact";
import Skills from "../pages/SkillsPage";
import ForgetPwd from "../pages/ForgetPwd";
import UnderMaintainance from "../pages/UnderMaintainance";
import { getRouteStatus } from "../helpers";
import { AppStrings } from "../i18n";
import ProtectedView from "../views/Protected";
import UnProtectedView from "../views/UnProtected";
import UnProtectedWithStatus from "../views/UnProtectedWithStatus";
import NotFound from "../pages/NotFound";
import Error from "../pages/Error";

const AppRoutes = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: AppStrings.ROUTES.LOGIN,
        element: <UnProtectedView><Login /></UnProtectedView>,
      },
      {
        path: AppStrings.ROUTES.LOGOUT,
        element: <UnProtectedView><Logout /></UnProtectedView>,
      },
      {
        path: AppStrings.ROUTES.FORGET_PWD,
        element: <UnProtectedWithStatus><ForgetPwd /></UnProtectedWithStatus>,
        loader: async ({ request }) => {
          const { url } = request;
          let routeName = url.split("/");
          return await getRouteStatus(`/${routeName[routeName.length - 1]}`);
        }
      },
      {
        path: AppStrings.ROUTES.UNDER_MAINTAINANCE,
        element: <UnderMaintainance />,
      },
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: AppStrings.ROUTES.HIRINGS,
            element: <ProtectedView><Hirings /></ProtectedView>,
            loader: async ({ request }) => {
              const { url } = request;
              let routeName = url.split("/");
              return await getRouteStatus(`/${routeName[routeName.length - 1]}`);
            }
          },
          {
            path: AppStrings.ROUTES.VIEW_DETAILS,
            element: <ProtectedView><TodayViewsDetails /></ProtectedView>,
            loader: async ({ request }) => {
              const { url } = request;
              let routeName = url.split("/");
              return await getRouteStatus(`/${routeName[routeName.length - 1]}`);
            }
          },
          {
            path: AppStrings.ROUTES.CONTACTS,
            element: <ProtectedView><Contact /></ProtectedView>,
            loader: async ({ request }) => {
              const { url } = request;
              let routeName = url.split("/");
              return await getRouteStatus(`/${routeName[routeName.length - 1]}`);
            }
          },
          {
            path: AppStrings.ROUTES.SKILLS,
            element: <ProtectedView><Skills /></ProtectedView>,
            loader: async ({ request }) => {
              const { url } = request;
              let routeName = url.split("/");
              return await getRouteStatus(`/${routeName[routeName.length - 1]}`);
            }
          },
        ],
      },
    ],
    errorElement: <Error />
  },
  { path: "*", element: <NotFound />, errorElement: <Error /> }
]);

export default AppRoutes;
