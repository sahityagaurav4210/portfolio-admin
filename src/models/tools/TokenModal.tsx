import React, { ReactNode, useEffect, useState } from "react";
import ToolsController from "../../controllers/tools.controller";
import { ApiStatus } from "../../api";
import { useNavigate } from "react-router-dom";
import { getGlobalToastConfig } from "../../configs/toasts.config";
import { toast } from "react-toastify";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import Heading from "../../components/Heading";
import { FaCircleInfo } from "react-icons/fa6";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { FaRegClipboard } from "react-icons/fa";
import { IToolsModalProp } from "../../interfaces/models.interface";
import { AppStrings } from "../../i18n";
import useAppCss from "../../hooks/useAppCss";

function TokenModal({ open, setOpen }: Readonly<IToolsModalProp>): ReactNode {
  const { HOME } = AppStrings;
  const { GlobalDialogDividerCss } = useAppCss();
  const [clientToken, setClientToken] = useState<string>("");
  const [tokenGenerationStatus, setTokenGenerationStatus] = useState<boolean>(false);
  const [isTokenVisible, setIsTokenVisible] = useState<boolean>(false);
  const [clipboardBtnTxt, setClipboardBtnTxt] = useState<string>(HOME.CLIENT_TOKEN_DIALOG.COPY_BTN);
  const navigate = useNavigate();

  async function handleTokenGeneration() {
    try {
      const controller = new ToolsController();
      const reply = await controller.makeTokenGenerationWebsiteReq({ url: import.meta.env.VITE_PORTFOLIO_URL });

      if (reply.status === ApiStatus.LOGOUT) {
        localStorage.clear();
        await navigate("/");
        return;
      }

      if (reply.status === ApiStatus.SUCCESS) {
        setClientToken(reply?.data?.token);
        return;
      }

      throw new Error(reply.message);
    } catch (error: any) {
      const message = error?.message || "Something went wrong at our end.";
      toast.error(message, getGlobalToastConfig());
    } finally {
      setTokenGenerationStatus(false);
    }
  }

  async function handleClipboardBtnTxt(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    await navigator.clipboard.writeText(clientToken);
    setClipboardBtnTxt(HOME.CLIENT_TOKEN_DIALOG.COPIED_BTN);
    setTimeout(() => {
      setClipboardBtnTxt(HOME.CLIENT_TOKEN_DIALOG.COPY_BTN);
    }, HOME.CLIENT_TOKEN_DIALOG.COPIED_BTN_TTL);
  }

  useEffect(() => {
    setTokenGenerationStatus(true);
    handleTokenGeneration();
  }, []);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Heading Icon={FaCircleInfo} text="Your secret token" />
      </DialogTitle>

      <DialogContent sx={GlobalDialogDividerCss}>
        <Container maxWidth="sm" className="mx-auto my-4">
          <Alert variant="filled" severity="warning" className="flex items-center text-justify">
            {HOME.CLIENT_TOKEN_DIALOG.FOOTER_NOTE}
          </Alert>
        </Container>

        {tokenGenerationStatus && (
          <Box component="div" display="flex" alignItems="center" columnGap={1}>
            <CircularProgress size={16} color="secondary" />
            <Typography variant="body1" fontWeight={700}>
              We're generating your token, please wait...
            </Typography>
          </Box>
        )}

        {!tokenGenerationStatus && (
          <Grid2 container spacing={2} display="flex" alignItems="center" my={2}>
            <Grid2 size={12}>
              <TextField
                type={isTokenVisible ? "text" : "password"}
                value={clientToken}
                disabled
                fullWidth
                label="Token"
                slotProps={{
                  input: {
                    endAdornment: (
                      <Fab size="small" color="primary" onClick={() => setIsTokenVisible((prev) => !prev)}>
                        {isTokenVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </Fab>
                    ),
                  },
                }}
                multiline={isTokenVisible}
              />
            </Grid2>

            <Grid2 size={3} offset={9}>
              <Button
                variant="outlined"
                color="success"
                startIcon={<FaRegClipboard />}
                onClick={handleClipboardBtnTxt}
                fullWidth
              >
                {clipboardBtnTxt}
              </Button>
            </Grid2>
          </Grid2>
        )}
      </DialogContent>

      <DialogActions className="bg-neutral-100">
        <Button
          variant="outlined"
          onClick={() => setOpen((prev) => !prev)}
          startIcon={<Close fontSize="small" />}
          color="error"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(TokenModal);
