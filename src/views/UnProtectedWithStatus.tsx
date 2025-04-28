import { ReactNode, useEffect, useState } from "react";
import { IProtected } from "../interfaces/component_props.interface";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AppStrings } from "../i18n";
import Loader from "../pages/Loader";

function UnProtectedWithStatus({ children }: IProtected): ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const pageStatus = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pageStatus) navigate(AppStrings.ROUTES.UNDER_MAINTAINANCE);
    setLoading(prev => !prev);
  }, []);

  if (loading) return children;
  else <Loader />;

}

export default UnProtectedWithStatus;