import { Box, Card, CardContent, Divider, Grid2, Paper } from "@mui/material";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoStatsChartOutline } from "react-icons/io5";
import { ApiController, ApiStatus } from "../api";
import WebsiteUpdate from "../views/WebsiteUpdate";
import ViewCount from "../components/ViewCount";
import Heading from "../components/Heading";
import { Dashboard } from "@mui/icons-material";

function Home(): ReactNode {
  const [dailyViewCount, setDailyViewCount] = useState<number>(-2);
  const [totalViewsCount, setTotalViewsCount] = useState<number>(-2);
  const [monthlyViewCount, setMonthlyViewCount] = useState<number>(-2);

  const loginStatus = Boolean(localStorage.getItem("login_status"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginStatus) {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    let timer: any;
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

      setDailyViewCount(views?.data?.view_count ?? -1);
    }

    async function getMonthlyViews() {
      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization") as string;
      const views = await controller.GET(
        "monthly-website-views",
        `Bearer ${authorization}`
      );

      if (views.status === ApiStatus.LOGOUT) {
        localStorage.clear();
        throw new Error("Logout");
      }

      setMonthlyViewCount(views?.data?.view_count ?? -1);
    }

    async function getTotalViews() {
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

      setTotalViewsCount(views?.data?.view_count ?? -1);
    }

    async function callApis() {
      await getTodayViews();
      await getMonthlyViews();
      await getTotalViews();
    }

    timer = setTimeout(() => {
      callApis().catch((error_: Error) => {
        if (error_.message === ApiStatus.LOGOUT) navigate("/");
      });
    }, 250);

    return function () {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const cachedDailyViewsCount = useMemo(() => dailyViewCount, [dailyViewCount]);
  const cachedMonthlyViewsCount = useMemo(
    () => monthlyViewCount,
    [monthlyViewCount]
  );
  const cachedTotalViewsCount = useMemo(
    () => totalViewsCount,
    [totalViewsCount]
  );

  return (
    <Paper
      variant="elevation"
      component="div"
      className="p-4 m-1 border border-slate-400"
    >
      <Heading Icon={Dashboard} text="Dashboard" />

      <Divider sx={{ mb: 4 }} />

      <Grid2 container spacing={2} px={2} my={2}>
        {/* Daily views */}
        <Grid2 justifyItems="center" size={{ xs: 6, md: 4 }} mx="auto">
          <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IoStatsChartOutline size={24} className="text-amber-800" />{" "}
                  <h1
                    className="text-2xl font-bold text-blue-700"
                    style={{ fontFamily: "Roboto" }}
                  >
                    <ViewCount count={cachedDailyViewsCount} />
                  </h1>
                </Box>
                <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                <Box>
                  <p
                    className="font-bold text-blue-400 text-xs"
                    style={{ fontFamily: "Roboto" }}
                  >
                    Today's views
                  </p>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Grid2>

        {/* Total monthly views */}
        <Grid2 justifyItems="center" size={{ xs: 6, md: 4 }} mx="auto">
          <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IoStatsChartOutline size={24} className="text-amber-800" />{" "}
                  <h1
                    className="text-2xl font-bold text-blue-700"
                    style={{ fontFamily: "Roboto" }}
                  >
                    <ViewCount count={cachedMonthlyViewsCount} />
                  </h1>
                </Box>
                <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                <Box>
                  <p
                    className="font-bold text-blue-400 text-xs"
                    style={{ fontFamily: "Roboto" }}
                  >
                    Total monthly views
                  </p>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Grid2>

        {/* Total views */}
        <Grid2 justifyItems="center" size={{ xs: 6, md: 4 }} mx="auto">
          <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IoStatsChartOutline size={24} className="text-amber-800" />{" "}
                  <h1
                    className="text-2xl font-bold text-blue-700"
                    style={{ fontFamily: "Roboto" }}
                  >
                    <ViewCount count={cachedTotalViewsCount} />
                  </h1>
                </Box>
                <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                <Box>
                  <p
                    className="font-bold text-blue-400 text-xs"
                    style={{ fontFamily: "Roboto" }}
                  >
                    Total views
                  </p>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Grid2>
      </Grid2>

      <WebsiteUpdate />
    </Paper>
  );
}

export default Home;
