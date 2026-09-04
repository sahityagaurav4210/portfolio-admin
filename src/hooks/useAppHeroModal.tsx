import { useNavigate } from "react-router-dom";
import HomeController from "../controllers/home.controller";
import { checkLogoutApiResponse } from "../helpers";
import { ApiStatus } from "../api";

function useAppHeroModal() {
  const navigate = useNavigate();

  async function editHeroSection(payload: Record<string, any>) {
    const controller = new HomeController();
    const reply = await controller.makeAddHomeSectionReq(payload);
    const isLogout = checkLogoutApiResponse(reply.status, reply.message);

    if (isLogout) {
      await navigate("/auth/login");
      localStorage.clear();
      return;
    }

    if (reply.status === ApiStatus.SUCCESS) {
      return reply;
    }

    throw new Error(reply.message);
  }

  return { editHeroSection };
}

export default useAppHeroModal;
