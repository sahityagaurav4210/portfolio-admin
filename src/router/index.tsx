import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { ProtectedLayout, PublicLayout } from "../layouts";
import Home from "../pages/Home";
import Hirings from "../views/Hirings";
import TodayViewsDetails from "../views/TodayViewsDetails";
import Contact from "../views/Contact";
import Skills from "../pages/SkillsPage";
import ForgetPwd from "../pages/ForgetPwd";
import { AppStrings } from "../i18n";
import NotFound from "../pages/NotFound";
import Error from "../pages/Error";

const AppRoutes = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicLayout />,
    children: [
      {
        path: `/${AppStrings.ROUTES.LOGIN}`,
        element: <Login />
      },
      {
        path: `/${AppStrings.ROUTES.FORGET_PWD}`,
        element: <ForgetPwd />
      }
    ],
    errorElement: <Error />
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: `/${AppStrings.ROUTES.HIRINGS}`,
        element: <Hirings />
      },
      {
        path: `/${AppStrings.ROUTES.CONTACTS}`,
        element: <Contact />
      },
      {
        path: `/${AppStrings.ROUTES.SKILLS}`,
        element: <Skills />
      },
      {
        path: `/${AppStrings.ROUTES.VIEW_DETAILS}`,
        element: <TodayViewsDetails />
      }
    ],
    errorElement: <Error />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default AppRoutes;
