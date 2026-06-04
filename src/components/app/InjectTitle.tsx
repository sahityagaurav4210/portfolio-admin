import React, { ReactNode, useEffect } from "react";
import { IInjectTitleProp } from "../../interfaces/component_props.interface";

function InjectTitle({ title, children }: Readonly<IInjectTitleProp>): ReactNode {
  useEffect(() => {
    document.title = `Portfolio Admin || ${title}`;

    return function () {
      document.title = "Portfolio Admin";
    };
  }, [title]);

  return children;
}

export default React.memo(InjectTitle);
