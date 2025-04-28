import { ReactNode } from "react";
import { IProtected } from "../interfaces/component_props.interface";

function UnProtectedView({ children }: IProtected): ReactNode {
  return children;
}

export default UnProtectedView;