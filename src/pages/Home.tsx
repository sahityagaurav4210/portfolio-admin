import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { IoStatsChartOutline } from "react-icons/io5";
import { ApiController, ApiStatus } from "../api";
import { FaRegClipboard } from "react-icons/fa";
import { TbHandFingerRight } from "react-icons/tb";
import { IoMdCreate } from "react-icons/io";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { AppStrings } from "../i18n";
import { FaCircleInfo } from "react-icons/fa6";
import TodayViewsDetails from "../views/TodayViewsDetails";
import WebsiteUpdate from "../views/WebsiteUpdate";
import Footer from "../views/Footer";
import Hirings from "../views/Hirings";

function Home(): ReactNode {
  const { HOME } = AppStrings;

  const [dailyViewCount, setDailyViewCount] = useState<number>(0);
  const [monthlyViewCount, setMonthlyViewCount] = useState<number>(0);
  const [tokenDialogOpenFlag, setTokenDialogOpenFlag] =
    useState<boolean>(false);
  const [tokenGenerationStatus, setTokenGenerationStatus] =
    useState<boolean>(false);
  const [clientToken, setClientToken] = useState<string>("");
  const [clipboardBtnTxt, setClipboardBtnTxt] = useState<string>(HOME.CLIENT_TOKEN_DIALOG.COPY_BTN);

  const username = localStorage.getItem("username");
  const loginStatus = Boolean(localStorage.getItem("login_status"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginStatus) {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    async function getTodayViews() {
      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization") as string;
      const views = await controller.GET(
        "today-website-views",
        `Bearer ${authorization}`
      );

      if (views.status === ApiStatus.LOGOUT) {
        localStorage.clear();
        throw new Error("Logout");
      }

      setDailyViewCount(views?.data?.view_count);
    }

    async function getMonthlyViews() {
      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization") as string;
      const views = await controller.GET(
        "total-website-views",
        `Bearer ${authorization}`
      );

      if (views.status === ApiStatus.LOGOUT) {
        localStorage.clear();
        throw new Error("Logout");
      }

      setMonthlyViewCount(views?.data?.view_count);
    }

    async function callApis() {
      await getTodayViews();
      await getMonthlyViews();
    }

    callApis().catch((reason: Error) => {
      if (reason.message === ApiStatus.LOGOUT) navigate("/");
    });
  }, []);

  async function handleTokenGeneration(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    setTokenGenerationStatus(true);
    const controller = new ApiController();
    const authorization = localStorage.getItem("authorization") as string;
    const reply = await controller.POST(
      "authentication/tokens/refresh-client-token",
      `Bearer ${authorization}`,
      { url: "https://gaurav-sahitya.netlify.app" }
    );

    setTokenGenerationStatus(false);

    if (reply.status === ApiStatus.SUCCESS) {
      setClientToken(reply?.data?.token);
      setTokenDialogOpenFlag(true);
    } else toast.error(reply.message, getGlobalToastConfig());
  }

  async function handleClipboardBtnTxt(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    await navigator.clipboard.writeText(clientToken)
    setClipboardBtnTxt(HOME.CLIENT_TOKEN_DIALOG.COPIED_BTN);
    setTimeout(() => {
      setClipboardBtnTxt(HOME.CLIENT_TOKEN_DIALOG.COPY_BTN)
    }, HOME.CLIENT_TOKEN_DIALOG.COPIED_BTN_TTL);
  }

  return (
    <>
      <div className="bg-neutral-200 min-h-screen">
        <Navbar username={username || "User"} />

        <Grid2 container spacing={2} px={2} my={2}>
          <Grid2 justifyItems="center" size={{ xs: 6, md: 3 }} mx="auto">
            <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IoStatsChartOutline size={24} className="text-amber-800" />{" "}
                    <h1 className="text-2xl font-bold text-blue-700" style={{ fontFamily: "Roboto" }}>
                      {dailyViewCount}
                    </h1>
                  </Box>
                  <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                  <Box>
                    <p className="font-bold text-blue-400 text-xs" style={{ fontFamily: "Roboto" }}>Today's views</p>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </Grid2>

          <Grid2 justifyItems="center" size={{ xs: 6, md: 3 }} mx="auto">
            <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IoStatsChartOutline size={24} className="text-amber-800" />{" "}
                    <h1 className="text-2xl font-bold text-blue-700" style={{ fontFamily: "Roboto" }}>
                      {monthlyViewCount}
                    </h1>
                  </Box>
                  <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                  <Box>
                    <p className="font-bold text-blue-400 text-xs" style={{ fontFamily: "Roboto" }}>
                      Total monthly views
                    </p>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </Grid2>
        </Grid2>

        <WebsiteUpdate />

        <Grid2 container spacing={2} px={2} my={2} mt={5}>
          <Grid2 size={12}>
            <Card className="border-l-8 border-blue-500">
              <CardContent
                sx={{ fontFamily: "Roboto" }}
                className="flex items-center"
              >
                <div className="flex items-center justify-between w-full h-full">
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
                </div>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        <Hirings />

        <TodayViewsDetails />

        <Footer />

        <Dialog
          open={tokenDialogOpenFlag}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="bg-blue-200 inline-flex items-center gap-1"><FaCircleInfo className="text-blue-800" /> Your token</DialogTitle>
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
      </div>
    </>
  );
}

export default Home;
