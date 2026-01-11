import { useTheme } from "@mui/material";
import { useMemo } from "react";

function useAppCss() {
  const theme = useTheme();

  const RequiredFieldCss = useMemo(
    () => ({
      "& .MuiInputLabel-asterisk": {
        color: "red",
      },
    }),
    []
  );

  const FlexCss = useMemo(
    () => ({
      display: "flex",
    }),
    []
  );

  const AlignItemsCss = useMemo(() => ({ alignItems: "center" }), []);
  const JustifyItemsEndCss = useMemo(
    () => ({ justifyContent: "flex-end" }),
    []
  );
  const CardActionAreaCss = useMemo(
    () => ({
      p: 1,
      display: "flex",
      justifyContent: "flex-end",
      background: "#f5f5f5",
    }),
    []
  );

  const CardCss = useMemo(
    () => ({
      border: `1px solid ${theme.palette.secondary.A100}`,
    }),
    []
  );

  const GlobalTableCss = useMemo(
    () => ({
      muiTablePaperProps: {
        elevation: 3,
        sx: {
          borderRadius: "8px",
          overflow: "hidden",
          border: `1px solid ${theme.palette.secondary.A200}`,
        },
      },
      muiTableContainerProps: {
        sx: { maxHeight: "600px", minHeight: "150px" },
      },
      muiTableHeadCellProps: {
        sx: {
          fontWeight: "bold",
          color: "#000080",
          // width: "max-content",
          whiteSpace: "normal",
          wordBreak: "break-word",
          textAlign: "center",
          borderRight: `1px solid ${theme.palette.secondary.A200}`,
          borderBottom: `1px solid ${theme.palette.secondary.A200}`,
          borderTop: `1px solid ${theme.palette.secondary.A200}`,
        },
      },
      muiTableBodyCellProps: { sx: { color: "gray", fontWeight: 700 } },
      muiPaginationProps: {
        rowsPerPageOptions: [10, 20, 30, 40, 50, 100],
      },
      enableStickyHeader: true,
    }),
    [theme]
  );

  return {
    RequiredFieldCss,
    FlexCss,
    AlignItemsCss,
    JustifyItemsEndCss,
    CardActionAreaCss,
    CardCss,
    GlobalTableCss,
  };
}

export default useAppCss;
