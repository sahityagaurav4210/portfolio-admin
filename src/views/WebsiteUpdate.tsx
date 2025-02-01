import { Button, Card, CardContent, CircularProgress, Grid2 } from '@mui/material'
import { ReactNode, useState } from 'react'
import { IoMdCreate } from 'react-icons/io'
import { ApiController, ApiStatus } from '../api';
import { toast } from 'react-toastify';
import { getGlobalToastConfig } from '../configs/toasts.config';
import { useNavigate } from 'react-router-dom';

function WebsiteUpdate(): ReactNode {
  const [websiteUpdateStatus, setWebsiteUpdateStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleWebsiteUpdate() {
    setWebsiteUpdateStatus(true);
    const controller = new ApiController();
    const authorization = localStorage.getItem("authorization") as string;

    const reply = await controller.POST("update-website", `Bearer ${authorization}`, { portfolio_url: "https://gaurav-sahitya.netlify.app" });
    setWebsiteUpdateStatus(false);

    if (reply.status === ApiStatus.LOGOUT) {
      localStorage.clear();
      navigate("/");
      return;
    }
    toast.success("Website updated successfully", getGlobalToastConfig());
  }

  return (
    <>
      <Grid2 container spacing={2} px={2} my={2} mt={5}>
        <Grid2 size={12}>
          <Card className="border-l-8 border-blue-500">
            <CardContent
              sx={{ fontFamily: "Roboto" }}
              className="flex items-center"
            >
              <div className="flex items-center justify-between w-full h-full">
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
              </div>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default WebsiteUpdate