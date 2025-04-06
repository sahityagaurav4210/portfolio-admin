import { Box } from "@mui/material";
import { ITextFieldLabel } from "../interfaces/component_props.interface";
import { ReactNode } from "react";

export default function TextFieldLabel({ text, required }: ITextFieldLabel): ReactNode {
  if (!required)
    return <p >{text}</p>

  return <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <p>{text}</p>
    <sup className="text-red-600 text-xs">*</sup>
  </Box>
}