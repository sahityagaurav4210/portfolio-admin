import { CSSProperties, ReactNode } from "react";
import { AlertType, AppIcon, BtnClick } from ".";
import { ISkillForm } from "./models.interface";
import { IAlert } from "./hooks.interface";
import { Breakpoint } from "@mui/material";

export interface INavbarProp {
  username: string;
  profile_pic?: string;
}

export interface ITableCol {
  text?: string;
  style: CSSProperties;
}

export interface ITableRowProp {
  columns: Array<ITableCol>;
}

export interface INoDataTableRow {
  colspan: number;
  text: string;
}

export interface ITextFieldLabel {
  text: string;
  required?: boolean;
}

export interface IViewCount {
  count: number;
}

export interface IProtected {
  children: ReactNode;
}

export interface IAppImgContainerProp {
  url: string;
}

export interface INavItem {
  segment?: string;
  title?: string;
  icon?: React.ReactNode;
}

export interface IRenderOpts {
  mini: boolean;
}

export interface IHeadingProp {
  text: string;
  Icon: AppIcon;
}

export interface IGlobalDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  onAddHandler: () => Promise<void>;
}

export interface IViewDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  details: Record<string, any> | undefined;
  text: string;
}

export interface IEditSkillDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  details?: ISkillForm;
  onAddHandler: () => Promise<void>;
}

export interface IChangePwdProp {
  open: boolean;
  callback: () => void;
}

export interface INotesProp {
  notes: string[];
}

export interface ICWPSAlertProp {
  alert: IAlert;
  handleAlertOnClose: VoidFunction;
  maxWidth?: Breakpoint;
  alertType?: AlertType;
}

export interface IIPLocModalProp {
  clientIp: string;
  isOpen: boolean;
  handleModalOnClose: VoidFunction;
}

export interface IConfirmationDialogProps {
  open: boolean;
  isLoading: boolean;
  text: ReactNode;
  heading: string;
  Icon: AppIcon;
  onSuccess: (event: BtnClick) => void | Promise<void>;
  onCancel?: (event: BtnClick) => void | Promise<void>;
}
