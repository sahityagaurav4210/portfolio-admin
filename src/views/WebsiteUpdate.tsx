import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import { memo, ReactNode, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { ApiStatus } from "../api";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { useNavigate } from "react-router-dom";

import { Build, CloudUpload } from "@mui/icons-material";
import useAppCss from "../hooks/useAppCss";
import ToolsController from "../controllers/tools.controller";
import TokenModal from "../models/tools/TokenModal";
import UploadCVModal from "../models/tools/UploadCVModal";

function WebsiteUpdate(): ReactNode {
  const [websiteUpdateStatus, setWebsiteUpdateStatus] = useState<boolean>(false);
  const [tokenDialogOpenFlag, setTokenDialogOpenFlag] = useState<boolean>(false);
  const [cvDialogOpen, setCvDialogOpen] = useState<boolean>(false);

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

              <Typography variant="body2" fontWeight={700} color="textSecondary" className="text-justify" mt={1}>
                Upload your latest CV/Resume and website links. Click the button below to open the upload dialog where
                you can attach a PDF and provide comma-separated website URLs.
              </Typography>
            </CardContent>

            <CardActionArea sx={CardActionAreaCss}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<CloudUpload fontSize="small" />}
                onClick={() => setCvDialogOpen(true)}
              >
                Upload CV
              </Button>
            </CardActionArea>
          </Card>
        </Grid2>
      </Grid2>

      {tokenDialogOpenFlag && <TokenModal open={tokenDialogOpenFlag} setOpen={setTokenDialogOpenFlag} />}
      {cvDialogOpen && <UploadCVModal open={cvDialogOpen} setOpen={setCvDialogOpen} />}
    </>
  );
}

export default memo(WebsiteUpdate);
