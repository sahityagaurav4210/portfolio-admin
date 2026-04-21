import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProtected } from "../interfaces/component_props.interface";
import AuthLoader from "../components/AuthLoader";
import HomeController from "../controllers/home.controller";
import { ApiStatus } from "../api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAuthUser } from "../redux/slices/auth.slice";
import useAppHelperFn from "../hooks/useAppHelperFn";

function ProtectedView({ children }: Readonly<IProtected>): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { getCookieValue } = useAppHelperFn();

  async function checkLoginStatus() {
    const controller = new HomeController();
    const loginStatus = getCookieValue("login_status");

    if (loginStatus !== "true" || !user) {
      const profile = await controller.makeGetLoggedInUserProfileReq();

      setLoading(false);

      if (profile.status === ApiStatus.UNAUTHORISED) {
        localStorage.clear();
        return await navigate("/auth/login");
      }

      if (profile.status === ApiStatus.SUCCESS) {
        dispatch(setAuthUser(profile.data.user));
      }

    }

    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    checkLoginStatus();
  }, []);

  if (loading) {
    return <AuthLoader />;
  } else {
    return children;
  }
}

export default ProtectedView;
