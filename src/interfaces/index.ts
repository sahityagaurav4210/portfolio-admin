import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";
import { IApiReply } from "./api.interface";
import { IconType } from "react-icons/lib";

export type BtnClick = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type AppIcon =
  | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    })
  | IconType;
export type InputChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type AlertType = "error" | "info" | "warning" | "success";

export type QueryString = Record<string, string | number>;
export type ApiPayload = Record<string, any>;
export type POSTCallbackFn = (url: string, qs?: QueryString, payload?: Record<string, any>) => Promise<Response>;
export type GETCallbackFn = (url: string, qs?: QueryString) => Promise<Response>;

export interface ILayout {
  url: string;
  name: string;
  Icon: AppIcon;
}

export type CallbackFn = (...params: any) => Promise<IApiReply>;
