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
import ProtectedView from "../views/Protected";
import ChangePwd from "../pages/public/ChangePwd";
import InjectTitle from "../components/app/InjectTitle";
import UpdatedProfile from "../pages/public/UpdatedProfile";

const AppRoutes = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicLayout />,
    children: [
      {
        path: `/${AppStrings.ROUTES.LOGIN}`,
        element: <Login />,
      },
      {
        path: `/${AppStrings.ROUTES.FORGET_PWD}`,
        element: <ForgetPwd />,
      },
      {
        path: `/${AppStrings.ROUTES.CHANGE_PWD}`,
        element: <ChangePwd />,
      },
    ],
    errorElement: <Error />,
  },
  {
    path: "/public",
    element: <PublicLayout />,
    children: [
      {
        path: `/${AppStrings.ROUTES.UPDATED_PROFILE}`,
        element: <UpdatedProfile />,
      },
    ],
    errorElement: <Error />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedView>
            <InjectTitle title="Dashboard">
              <Home />
            </InjectTitle>
          </ProtectedView>
        ),
      },
      {
        path: `/${AppStrings.ROUTES.HIRINGS}`,
        element: (
          <ProtectedView>
            <InjectTitle title="Hirings">
              <Hirings />
            </InjectTitle>
          </ProtectedView>
        ),
      },
      {
        path: `/${AppStrings.ROUTES.CONTACTS}`,
        element: (
          <ProtectedView>
            <InjectTitle title="Contacts">
              <Contact />
            </InjectTitle>
          </ProtectedView>
        ),
      },
      {
        path: `/${AppStrings.ROUTES.SKILLS}`,
        element: (
          <ProtectedView>
            <InjectTitle title="Skills">
              <Skills />
            </InjectTitle>
          </ProtectedView>
        ),
      },
      {
        path: `/${AppStrings.ROUTES.VIEW_DETAILS}`,
        element: (
          <ProtectedView>
            <InjectTitle title="Views">
              <TodayViewsDetails />
            </InjectTitle>
          </ProtectedView>
        ),
      },
    ],
    errorElement: <Error />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default AppRoutes;
