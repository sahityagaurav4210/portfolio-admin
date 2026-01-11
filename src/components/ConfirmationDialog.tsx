import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  useTheme,
} from "@mui/material";
import React from "react";
import Heading from "./Heading";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import CancelIcon from "@mui/icons-material/Cancel";
import { IConfirmationDialogProps } from "../interfaces/component_props.interface";

function ConfirmationDialog({
  open,
  isLoading,
  text,
  heading,
  Icon,
  onSuccess,
  onCancel,
}: Readonly<IConfirmationDialogProps>) {
  const theme = useTheme();

  const style = {
    p: 1,
    outline: "none",
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={() => {}}
      aria-labelledby="cnf-dialog-title"
      aria-describedby="cnf-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <Box component="div" sx={style}>
        <DialogTitle id="cnf-dialog-title">
          <Heading Icon={Icon} text={heading} />

          <Divider />
        </DialogTitle>

        <DialogContent>{text}</DialogContent>

        <DialogActions>
          {onCancel && (
            <Button
              variant="contained"
              startIcon={<CancelIcon />}
              type="button"
              onClick={onCancel}
              sx={{ backgroundColor: theme.palette.error.main }}
              autoFocus
              size="small"
              disabled={isLoading}
            >
              CANCEL
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={
              isLoading ? (
                <CircularProgress size={16} color="success" />
              ) : (
                <BeenhereIcon fontSize="small" />
              )
            }
            type="button"
            onClick={onSuccess}
            autoFocus={!onCancel}
            sx={{ backgroundColor: theme.palette.success.main }}
            size="small"
            disabled={isLoading}
          >
            OK
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default React.memo(ConfirmationDialog);
