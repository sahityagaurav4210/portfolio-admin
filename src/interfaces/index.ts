import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";

export type BtnClick = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type AppIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};
export type InputChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export interface ILayout {
  url: string,
  name: string,
  Icon: AppIcon;
}