import { Container } from "@mui/material";
import React, { ReactNode } from "react";
import { IAppImgContainerProp } from "../interfaces/component_props.interface";

function BannerContainer({ url }: Readonly<IAppImgContainerProp>): ReactNode {
  return (
    <Container maxWidth="xl">
      <img
        src={url}
        alt="Banner"
        className="max-h-96 w-full aspect-video object-cover"
      />
    </Container>
  );
}

export default React.memo(BannerContainer);
