import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid2,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { IoStatsChartOutline } from "react-icons/io5";
import { ApiController } from "../api";

function Home(): ReactNode {
  const [dailyViewCount, setDailyViewCount] = useState<number>(0);
  const [monthlyViewCount, setMonthlyViewCount] = useState<number>(0);

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
      const views = await controller.GET("today-website-views", `Bearer ${authorization}`);

      setDailyViewCount(views?.data?.view_count);
    }

    async function getMonthlyViews() {
      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization") as string;
      const views = await controller.GET("total-website-views", `Bearer ${authorization}`);

      setMonthlyViewCount(views?.data?.view_count);
    }

    async function callApis() {
      await getTodayViews();
      await getMonthlyViews();
    }

    callApis();
  }, []);

  return (
    <>
      <Navbar username={username || "User"} />

      <Grid2 container spacing={2} px={2} my={2}>
        <Grid2 justifyItems="center" size={3} mx="auto">
          <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
            <Card sx={{ width: "100%", }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IoStatsChartOutline size={24} className="text-amber-800" /> <h1 className="text-2xl font-bold text-blue-700">{dailyViewCount}</h1>
                </Box>
                <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                <Box>
                  <p className="font-bold text-blue-400">Today's views</p>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Grid2>

        <Grid2 justifyItems="center" size={3} mx="auto">
          <div className="border-amber-600 border-2 ring-2 ring-offset-2 ring-amber-400 w-full rounded-sm shadow-xl shadow-neutral-800">
            <Card sx={{ width: "100%", }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IoStatsChartOutline size={24} className="text-amber-800" /> <h1 className="text-2xl font-bold text-blue-700">{monthlyViewCount}</h1>
                </Box>
                <Divider sx={{ borderBottom: "2px solid #1d4ed8 " }} />
                <Box>
                  <p className="font-bold text-blue-400">Total monthly views</p>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Grid2>
      </Grid2>

      <Divider />
    </>
  );
}

export default Home;
