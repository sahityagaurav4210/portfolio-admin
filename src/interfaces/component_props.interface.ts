import { CSSProperties, ReactNode } from "react";
import { AlertType, AppIcon, BtnClick } from ".";
import { IProjects, ISkillForm } from "./models.interface";
import { IAlert } from "./hooks.interface";

import { IHeroSectionPayload } from "./states.interfaces";
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
  width?: string;
  height?: string;
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
  onEditHandler?: () => void;
}

export interface IEditSkillDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  details?: ISkillForm;
  onAddHandler: () => Promise<void>;
}

export interface IEditHeroSectionDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  details?: IHeroSectionPayload;
  onAddHandler: () => Promise<void>;
}

export interface IEditProjectDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  details?: IProjects;
  onAddHandler: () => Promise<void>;
}

export interface IViewProjectDialogProp {
  open: boolean;
  handleDialogCloseBtnClick: (e: BtnClick) => void;
  details?: IProjects;
  onEditHandler?: () => void;
}


export interface IChangePwdProp {
  open: boolean;
  callback: () => void;
}

export interface INotesProp {
  notes: string[];
  my?: number;
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

export interface IContactActionsProp {
  row: Record<string, any>;
  handleViewBtnClick: (id: number) => void;
  handleDeleteBtnClick?: (_id: string) => void;
}

export interface IModalHeading {
  text: string;
  Icon: AppIcon;
}

export interface IFooterProp {
  showSupport?: boolean;
}

export interface IInjectTitleProp {
  title: string;
  children: ReactNode;
}

export interface ITagsInput {
  tags?: Array<string>;
  onAddTag: Function;
  onRemoveTag: Function;
  disabled?: boolean;
  isRequired?: boolean;
}

export interface IAppContainer {
  arrow?: boolean;
  children: ReactNode;
  showInfoIcon?: boolean;
}
