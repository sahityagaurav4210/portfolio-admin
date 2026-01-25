import React from "react";
import { IAppImgContainerProp } from "../interfaces/component_props.interface";
import { Box } from "@mui/material";

function AppImage({ url, height, width }: Readonly<IAppImgContainerProp>) {
  const imgWidth = width ? `w-[${width}]` : "w-full";
  const imgHeight = height ? `h-[${width}]` : "h-full";
  const className = `rounded-xl ${imgWidth} ${imgHeight} object-center`;

  return (
    <Box component="div" className="max-w-xs p-2">
      <img src={url} alt="Alt text" className={className} loading="lazy" />
    </Box>
  );
}

export default React.memo(AppImage);
