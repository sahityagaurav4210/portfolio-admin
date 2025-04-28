import { ReactNode, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AppStrings } from "../i18n";
import { IProtected } from "../interfaces/component_props.interface";
import Loader from "../pages/Loader";

function ProtectedView({ children }: IProtected): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const pageStatus = useLoaderData();
  const loginStatus = Boolean(localStorage.getItem("login_status"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!pageStatus) navigate(AppStrings.ROUTES.UNDER_MAINTAINANCE);
    if (!loginStatus) navigate(AppStrings.ROUTES.LOGIN);

    setLoading(prev => !prev);
  }, []);

  if (loading) return children;
  else <Loader />;
}

export default ProtectedView;