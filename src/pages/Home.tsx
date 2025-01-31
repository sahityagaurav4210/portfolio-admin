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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { IoStatsChartOutline } from "react-icons/io5";
import { ApiController, ApiStatus } from "../api";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegClipboard } from "react-icons/fa";
import { TbHandFingerRight } from "react-icons/tb";
import { IoMdCreate } from "react-icons/io";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";

function Home(): ReactNode {
  const [dailyViewCount, setDailyViewCount] = useState<number>(0);
  const [monthlyViewCount, setMonthlyViewCount] = useState<number>(0);
  const [tokenDialogOpenFlag, setTokenDialogOpenFlag] =
    useState<boolean>(false);
  const [tokenGenerationStatus, setTokenGenerationStatus] =
    useState<boolean>(false);
  const [clientToken, setClientToken] = useState<string>("");

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

  async function handleTokenGeneration() {
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
                    <h1 className="text-2xl font-bold text-blue-700">
                      {dailyViewCount}
                    </h1>
                  </Box>
                  <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                  <Box>
                    <p className="font-bold text-blue-400">Today's views</p>
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
                    <h1 className="text-2xl font-bold text-blue-700">
                      {monthlyViewCount}
                    </h1>
                  </Box>
                  <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                  <Box>
                    <p className="font-bold text-blue-400">
                      Total monthly views
                    </p>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </Grid2>
        </Grid2>

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

        <Grid2 container spacing={2} px={2} my={2}>
          <TableContainer component={Paper} className="mb-2">
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ color: "white" }}
                    className="bg-blue-700"
                  >
                    Sr No.
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white" }}
                    className="bg-blue-700"
                  >
                    Client URL
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white" }}
                    className="bg-blue-700"
                  >
                    Token Quantity
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white" }}
                    className="bg-blue-700"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow className="odd:bg-neutral-50">
                  <TableCell align="center">1.</TableCell>
                  <TableCell align="center">
                    https://gaurav-sahitya.netlify.app
                  </TableCell>
                  <TableCell align="center">5</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MdOutlineDelete size={24} color="red" />
                  </TableCell>
                </TableRow>

                <TableRow className="odd:bg-neutral-50">
                  <TableCell align="center">1.</TableCell>
                  <TableCell align="center">
                    https://gaurav-sahitya.netlify.app
                  </TableCell>
                  <TableCell align="center">5</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MdOutlineDelete size={24} color="red" />
                  </TableCell>
                </TableRow>

                <TableRow className="odd:bg-neutral-50">
                  <TableCell align="center">1.</TableCell>
                  <TableCell align="center">
                    https://gaurav-sahitya.netlify.app
                  </TableCell>
                  <TableCell align="center">5</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MdOutlineDelete size={24} color="red" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>

        <Grid2 container spacing={2} px={2} my={2} mt={5}>
          <Grid2 size={12}>
            <Card className="border-l-8 border-blue-500">
              <CardContent
                sx={{ fontFamily: "Roboto" }}
                className="flex items-center"
              >
                <h1 className="text-xl text-amber-600 font-bold">Requests</h1>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        <Dialog
          open={tokenDialogOpenFlag}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Your token</DialogTitle>
          <DialogContent>
            <Grid2 container spacing={2} display="flex" alignItems="center">
              <Grid2 size={{ xs: 8, md: 10 }}>
                <input
                  type="text"
                  disabled
                  value={"*****************************"}
                  className="border p-2 font-bold text-xl rounded-lg bg-neutral-100 border-neutral-400 outline-none w-full"
                />
              </Grid2>

              <Grid2 size={{ xs: 4, md: 2 }}>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<FaRegClipboard />}
                  onClick={async () =>
                    await navigator.clipboard.writeText(clientToken)
                  }
                >
                  Copy
                </Button>
              </Grid2>
            </Grid2>
            <p className="text-justify text-zinc-600 text-xs mt-1 inline-flex">
              <TbHandFingerRight className="mx-1 text-neutral-500" size={24} />
              For security purposes, we will not provide you a further chance to
              copy your client token, so please copy this right away and store
              in a safe and secure place and never share this to anyone.
            </p>
          </DialogContent>
          <DialogActions>
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
