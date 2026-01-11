import { Box } from "@mui/material";
import React from "react";
import { IAppImgContainerProp } from "../interfaces/component_props.interface";

function ImgContainer({
  url,
}: Readonly<IAppImgContainerProp>): React.ReactNode {
  return (
    <Box component="div" className="max-w-20 max-h-20">
      <img src={url} alt="Logo" className="rounded-xl" />
    </Box>
  );
}

export default React.memo(ImgContainer);
