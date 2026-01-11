import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";
import { IApiReply } from "./api.interface";

export type BtnClick = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type AppIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};
export type InputChange = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
export type AlertType = "error" | "info" | "warning" | "success";

export interface ILayout {
  url: string;
  name: string;
  Icon: AppIcon;
}

export type CallbackFn = (...params: any) => Promise<IApiReply>;
