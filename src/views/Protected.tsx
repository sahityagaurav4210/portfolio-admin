import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppStrings } from "../i18n";
import { IProtected } from "../interfaces/component_props.interface";
import Loader from "../pages/Loader";

function ProtectedView({ children }: IProtected): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const loginStatus = Boolean(localStorage.getItem("login_status"));
  const navigate = useNavigate();


  useEffect(() => {
    if (!loginStatus) navigate(AppStrings.ROUTES.LOGIN);

    setLoading(prev => !prev);
  }, []);

  if (loading) return children;
  else return <Loader />;
}

export default ProtectedView;