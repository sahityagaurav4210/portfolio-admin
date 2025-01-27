import {
  AppBar,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { INavbarProp } from "../interfaces/component_props.interface";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ApiController, ApiStatus } from "../api";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";

function Navbar({ username }: INavbarProp): ReactNode {
  const [logoutStatus, setLogoutStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleLogout(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    const authorization = `Bearer ${
      localStorage.getItem("authorization") as string
    }`;
    const token = localStorage.getItem("token") as string;

    setLogoutStatus(true);
    const controller = new ApiController();
    const reply = await controller.logout("authentication/logout", {
      authorization,
      token,
    });

    setLogoutStatus(false);

    if (reply.status === ApiStatus.SUCCESS) {
      localStorage.clear();
      toast.success(reply.message, getGlobalToastConfig());
      navigate("/");
    } else {
      toast.error(reply.message, getGlobalToastConfig());
    }
  }

  return (
    <>
      <AppBar
        sx={{
          flexGrow: 1,
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        position="sticky"
        color="default"
      >
        <div className="flex items-center justify-between px-1">
          <Toolbar>
            <Typography variant="h6">Welcome, {username}</Typography>
          </Toolbar>

          <Button
            variant="outlined"
            disabled={logoutStatus}
            startIcon={logoutStatus && <CircularProgress size={16} />}
            onClick={handleLogout}
            className="flex items-center"
          >
            <IoLogOut size={24} />
          </Button>
        </div>
      </AppBar>
    </>
  );
}

export default Navbar;
