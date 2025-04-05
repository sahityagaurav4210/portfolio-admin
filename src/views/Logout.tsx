import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApiController, ApiStatus } from "../api";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";

function Logout(): ReactNode {
  const navigate = useNavigate();

  useEffect(() => {
    async function logout(): Promise<void> {
      const authorization = `Bearer ${localStorage.getItem("authorization") as string
        }`;
      const token = localStorage.getItem("token") as string;

      const controller = new ApiController();
      const reply = await controller.logout("authentication/logout", {
        authorization,
        token,
      });


      if (reply.status === ApiStatus.SUCCESS) {
        localStorage.clear();
        toast.success(reply.message, getGlobalToastConfig());
        navigate("/");
      } else {
        toast.error(reply.message, getGlobalToastConfig());
      }
    }

    logout();
  }, [])

  return null;
}

export default Logout;
