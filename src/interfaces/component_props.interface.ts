import { CSSProperties } from "react";

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
  colspan: number,
  text: string
}