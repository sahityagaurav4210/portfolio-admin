import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { memo, ReactNode, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { ApiController, ApiStatus } from "../api";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { useNavigate } from "react-router-dom";

import { Build, Link } from "@mui/icons-material";
import { BtnClick } from "../interfaces";
import { FTPController } from "../controllers/ftp.controller";
import useAppCss from "../hooks/useAppCss";
import ToolsController from "../controllers/tools.controller";
import TokenModal from "../models/tools/TokenModal";

function WebsiteUpdate(): ReactNode {
  const [websiteUpdateStatus, setWebsiteUpdateStatus] = useState<boolean>(false);
  const [tokenDialogOpenFlag, setTokenDialogOpenFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCVUpdateForm, setShowCVUpdateForm] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const { CardActionAreaCss, CardCss } = useAppCss();

  const navigate = useNavigate();

  async function handleWebsiteUpdate() {
    setWebsiteUpdateStatus(true);

    try {
      const controller = new ToolsController();
      const reply = await controller.makeUpdateWebsiteReq({ portfolio_url: import.meta.env.VITE_PORTFOLIO_URL });

      if (reply.status === ApiStatus.LOGOUT) {
        localStorage.clear();
        await navigate("/");
        return;
      }

      if (reply.status === ApiStatus.SUCCESS) {
        toast.success(reply.message, getGlobalToastConfig());
        return;
      }

      throw new Error(reply.message);
    } catch (error: any) {
      const message = error?.message || "Something went wrong at our end.";
      toast.error(message, getGlobalToastConfig());
    } finally {
      setWebsiteUpdateStatus(false);
    }
  }

  async function handleFTPButton(event: BtnClick) {
    event.preventDefault();
    setLoading(true);

    const controller = new FTPController();
    const email = localStorage.getItem("email");
    const auth = localStorage.getItem("authorization") as string;
    const payload = {
      email,
      fileName: "documents",
      fileType: "application/pdf",
    };

    const status = await controller.generateToken(
      `${import.meta.env.VITE_FTP_API_BASE_URL}/tokens/generate`,
      `Bearer ${auth}`,
      payload,
    );

    setLoading(false);

    if (status) {
      setShowCVUpdateForm(true);
      window.open(
        `${import.meta.env.VITE_FTP_URL}/?fileName=${payload.fileName}&fileType=${payload.fileType}&email=${email}`,
        "_blank",
      );
      return;
    }

    toast.error("Something went wrong, please try again after sometime...", getGlobalToastConfig());
  }

  async function handleUpdateCVBtn(event: BtnClick) {
    event.preventDefault();
    setLoading(true);

    const api = new ApiController();
    const auth = localStorage.getItem("authorization") as string;

    const reply = await api.POST("files/save-cv", `Bearer ${auth}`, { url });

    setLoading(false);

    if (reply.status === ApiStatus.SUCCESS) {
      setShowCVUpdateForm(false);
      toast.success(reply.message, getGlobalToastConfig());
      return;
    }

    toast.error(reply.message, getGlobalToastConfig());
  }

  return (
    <>
      <Box component="div" display="flex" columnGap={1} alignItems="center" mt={5}>
        <Build fontSize="small" color="warning" />
        <Typography variant="h5" color="primary" fontWeight={700}>
          PORTAL TOOLS
        </Typography>
      </Box>

      <Grid2 container spacing={2} px={2} my={2} mt={5}>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Card sx={CardCss}>
            <CardMedia image="/website.jpg" sx={{ minHeight: 300 }} />

            <CardContent sx={{ fontFamily: "Roboto", width: "100%", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} color="warning">
                Website
              </Typography>

              <Typography variant="body2" fontWeight={700} color="textSecondary" className="text-justify">
                This section provides a simple way to keep the portfolio up to date by allowing the last updated status
                to be refreshed with a single click. It ensures visitors always see the most recent update timestamp,
                reflecting active maintenance and ongoing improvements without any manual changes.
              </Typography>
            </CardContent>

            <CardActionArea sx={CardActionAreaCss}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={websiteUpdateStatus ? <CircularProgress size={16} /> : <IoMdCreate />}
                disabled={websiteUpdateStatus}
                onClick={handleWebsiteUpdate}
              >
                Update
              </Button>
            </CardActionArea>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Card sx={CardCss}>
            <CardMedia image="/identity.png" sx={{ minHeight: 300 }} />

            <CardContent sx={{ fontFamily: "Roboto" }}>
              <Typography variant="h6" fontWeight={700} color="warning">
                CLIENT TOKENS
              </Typography>

              <Typography variant="body2" fontWeight={700} color="textSecondary" className="text-justify">
                This section manages client secrets that enable secure communication between the client and the backend.
                By using protected keys for authentication and request validation, it ensures that only authorized
                clients can access backend services, safeguarding data exchange and preventing unauthorized connections.
              </Typography>
            </CardContent>

            <CardActionArea sx={CardActionAreaCss}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<IoMdCreate size={16} />}
                onClick={() => setTokenDialogOpenFlag(true)}
              >
                Generate
              </Button>
            </CardActionArea>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} px={2} my={2}>
        <Grid2 size={{ xs: 12, lg: 6 }} mx="auto">
          <Card sx={CardCss}>
            <CardMedia image="/books.jpg" sx={{ height: 300 }} />

            <CardContent sx={{ fontFamily: "Roboto" }}>
              <h1 className="text-xl text-amber-600 font-bold">Update CV</h1>

              <p>
                Upload your CV on the FTP portal by clicking on the button given below and then paste the url obtained
                in the below form.
              </p>

              {showCVUpdateForm && (
                <Grid2 container spacing={1} mt={2}>
                  <Grid2 size={8}>
                    <TextField
                      label="URL"
                      fullWidth
                      placeholder="Ex:- www.sgaurav.me/cv.pdf"
                      focused
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                    ></TextField>
                  </Grid2>
                  <Grid2 size={4} alignItems={"center"} display={"flex"}>
                    <Button fullWidth variant="outlined" disabled={loading} onClick={handleUpdateCVBtn}>
                      Update
                    </Button>
                  </Grid2>
                </Grid2>
              )}
            </CardContent>

            <CardActionArea sx={CardActionAreaCss}>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleFTPButton}
                startIcon={loading ? <CircularProgress size={16} color="secondary" /> : <Link />}
              >
                FTP Portal
              </Button>
            </CardActionArea>
          </Card>
        </Grid2>
      </Grid2>

      {tokenDialogOpenFlag && <TokenModal open={tokenDialogOpenFlag} setOpen={setTokenDialogOpenFlag} />}
    </>
  );
}

export default memo(WebsiteUpdate);
