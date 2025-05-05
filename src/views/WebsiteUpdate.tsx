import { Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, TextField } from '@mui/material';
import { memo, ReactNode, useState } from 'react';
import { IoMdCreate } from 'react-icons/io';
import { ApiController, ApiStatus } from '../api';
import { toast } from 'react-toastify';
import { getGlobalToastConfig } from '../configs/toasts.config';
import { useNavigate } from 'react-router-dom';

import WebUpdates from '../assets/web-updates.jpg';
import AppSecrets from '../assets/app-secrets.jpg';
import Docs from '../assets/docs.jpg';

import { TbHandFingerRight } from 'react-icons/tb';
import { FaRegClipboard } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { AppStrings } from '../i18n';
import { Link } from '@mui/icons-material';
import { BtnClick } from '../interfaces';
import { FTPController } from '../controllers/ftp.controller';

function WebsiteUpdate(): ReactNode {
  const { HOME } = AppStrings;
  const [websiteUpdateStatus, setWebsiteUpdateStatus] = useState<boolean>(false);
  const [tokenGenerationStatus, setTokenGenerationStatus] =
    useState<boolean>(false);
  const [clientToken, setClientToken] = useState<string>("");
  const [clipboardBtnTxt, setClipboardBtnTxt] = useState<string>(
    HOME.CLIENT_TOKEN_DIALOG.COPY_BTN
  );
  const [tokenDialogOpenFlag, setTokenDialogOpenFlag] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCVUpdateForm, setShowCVUpdateForm] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const navigate = useNavigate();

  async function handleWebsiteUpdate() {
    setWebsiteUpdateStatus(true);
    const controller = new ApiController();
    const authorization = localStorage.getItem("authorization") as string;

    const reply = await controller.POST("update-website", `Bearer ${authorization}`, { portfolio_url: import.meta.env.VITE_PORTFOLIO_URL });
    setWebsiteUpdateStatus(false);

    if (reply.status === ApiStatus.LOGOUT) {
      localStorage.clear();
      navigate("/");
      return;
    }
    toast.success("Website updated successfully", getGlobalToastConfig());
  }

  async function handleTokenGeneration(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setTokenGenerationStatus(true);
    const controller = new ApiController();
    const authorization = localStorage.getItem("authorization") as string;
    const reply = await controller.POST(
      "authentication/tokens/refresh-client-token",
      `Bearer ${authorization}`, { url: "https://www.sgaurav.me" }
    );

    setTokenGenerationStatus(false);

    if (reply.status === ApiStatus.SUCCESS) {
      setClientToken(reply?.data?.token);
      setTokenDialogOpenFlag(true);
    } else toast.error(reply.message, getGlobalToastConfig());
  }

  async function handleClipboardBtnTxt(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    await navigator.clipboard.writeText(clientToken);
    setClipboardBtnTxt(HOME.CLIENT_TOKEN_DIALOG.COPIED_BTN);
    setTimeout(() => {
      setClipboardBtnTxt(HOME.CLIENT_TOKEN_DIALOG.COPY_BTN);
    }, HOME.CLIENT_TOKEN_DIALOG.COPIED_BTN_TTL);
  }

  async function handleFTPButton(event: BtnClick) {
    event.preventDefault();
    setLoading(true);

    const controller = new FTPController();
    const email = localStorage.getItem("email");
    const auth = localStorage.getItem("authorization") as string;
    const payload = { email, fileName: 'documents', fileType: "application/pdf" };

    const status = await controller.generateToken(`${import.meta.env.VITE_FTP_API_BASE_URL}/tokens/generate`, `Bearer ${auth}`, payload);

    setLoading(false);

    if (status) {
      setShowCVUpdateForm(true);
      window.open(`${import.meta.env.VITE_FTP_URL}/?fileName=${payload.fileName}&fileType=${payload.fileType}&email=${email}`, "_blank");
      return;
    }

    toast.error("Something went wrong, please try again after sometime...", getGlobalToastConfig());
  }

  async function handleUpdateCVBtn(event: BtnClick) {
    event.preventDefault();
    setLoading(true);

    const api = new ApiController();
    const auth = localStorage.getItem("authorization") as string;

    const reply = await api.POST('files/save-cv', `Bearer ${auth}`, { url });

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
      <Grid2 container spacing={2} px={2} my={2} mt={5}>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardMedia image={WebUpdates} sx={{ height: 250 }} />
            <CardContent
              sx={{ fontFamily: "Roboto", width: "100%", height: "100%" }}
              className="flex items-center justify-between"
            >
              <h1 className="text-xl text-amber-600 font-bold">
                Update website
              </h1>

              <Button
                variant="outlined"
                color="warning"
                startIcon={
                  !websiteUpdateStatus ? (
                    <IoMdCreate />
                  ) : (
                    <CircularProgress size={16} />
                  )
                }
                disabled={websiteUpdateStatus}
                onClick={handleWebsiteUpdate}
              >
                Update
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardMedia image={AppSecrets} sx={{ height: 250 }} />
            <CardContent
              sx={{ fontFamily: "Roboto" }}
              className="flex items-center w-full justify-between"
            >
              <h1 className="text-xl text-amber-600 font-bold">
                Client tokens
              </h1>

              <Button
                variant="outlined"
                color="warning"
                startIcon={
                  !tokenGenerationStatus ? (
                    <IoMdCreate />
                  ) : (
                    <CircularProgress size={16} />
                  )
                }
                disabled={tokenGenerationStatus}
                onClick={handleTokenGeneration}
              >
                Generate
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} px={2} my={2}>
        <Grid2 size={{ xs: 12, lg: 6 }} mx="auto">
          <Card>
            <CardMedia image={Docs} sx={{ height: 300 }} />
            <CardContent
              sx={{ fontFamily: "Roboto" }}
            >
              <h1 className="text-xl text-amber-600 font-bold">Update CV</h1>

              <p>Upload your CV on the FTP portal by clicking on the button given below and then paste the url obtained in the below form.</p>

              {showCVUpdateForm && <Grid2 container spacing={1} mt={2}>
                <Grid2 size={8}>
                  <TextField label="URL" fullWidth placeholder='Ex:- www.sgaurav.me/cv.pdf' focused value={url} onChange={event => setUrl(event.target.value)}></TextField>
                </Grid2>
                <Grid2 size={4} alignItems={"center"} display={"flex"}>
                  <Button fullWidth variant='outlined' disabled={loading} onClick={handleUpdateCVBtn}>Update</Button>
                </Grid2>
              </Grid2>
              }

            </CardContent>
            <CardActionArea sx={{ p: 1, display: "flex", justifyContent: "flex-end", background: "#f5f5f5" }}>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleFTPButton}
                startIcon={
                  !loading ? <Link /> : <CircularProgress size={16} />
                }
              >
                FTP Portal
              </Button>
            </CardActionArea>
          </Card>
        </Grid2>
      </Grid2>

      <Dialog
        open={tokenDialogOpenFlag}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="bg-blue-200 inline-flex items-center gap-1">
          <FaCircleInfo className="text-blue-800" /> Your token
        </DialogTitle>
        <DialogContent className="my-2">
          <Grid2 container spacing={2} display="flex" alignItems="center">
            <Grid2 size={{ xs: 8, md: 9 }}>
              <input
                type="text"
                disabled
                value={"*****************************"}
                className="border p-2 font-bold text-xl rounded-lg bg-neutral-100 border-neutral-400 outline-none w-full"
              />
            </Grid2>

            <Grid2 size={{ xs: 4, md: 3 }}>
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
          <p className="text-justify text-zinc-600 text-[10px] mt-1 inline-flex">
            <TbHandFingerRight className="mx-1 text-neutral-500" size={16} />
            {HOME.CLIENT_TOKEN_DIALOG.FOOTER_NOTE}
          </p>
        </DialogContent>
        <DialogActions className="bg-neutral-50">
          <Button
            variant="outlined"
            onClick={() => setTokenDialogOpenFlag((prev) => !prev)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(WebsiteUpdate);