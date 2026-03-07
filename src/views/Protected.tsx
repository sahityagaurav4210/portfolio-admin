import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProtected } from "../interfaces/component_props.interface";
import AuthLoader from "../components/AuthLoader";
import HomeController from "../controllers/home.controller";
import { ApiStatus } from "../api";

function ProtectedView({ children }: Readonly<IProtected>): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function checkLoginStatus() {
    const controller = new HomeController();
    const profile = await controller.makeGetLoggedInUserProfileReq();

    setLoading(false);

    if (profile.status === ApiStatus.UNAUTHORISED) {
      localStorage.clear();
      return await navigate("/auth/login");
    }
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
