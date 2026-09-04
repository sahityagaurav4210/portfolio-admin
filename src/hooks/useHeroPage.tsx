import { useCallback, useEffect, useState } from "react";
import HomeController from "../controllers/home.controller";
import { checkLogoutApiResponse } from "../helpers";
import { useNavigate } from "react-router-dom";
import { ApiStatus } from "../api";
import { IHeroSectionPayload } from "../interfaces/states.interfaces";

function useHeroPage() {
  const [heroSection, setHeroSection] = useState<IHeroSectionPayload>();
  const navigate = useNavigate();

  const fetchHeroSection = useCallback(async function () {
    const controller = new HomeController();
    const reply = await controller.makeGetHomeSectionReq();
    const isLogout = checkLogoutApiResponse(reply.status, reply.message);

    if (isLogout) {
      await navigate("/auth/login");
      localStorage.clear();
      return;
    }

    if (reply.status === ApiStatus.SUCCESS) {
      setHeroSection(reply.data);
      return;
    }

    throw new Error(reply.message);
  }, []);

  useEffect(function () {
    fetchHeroSection();
  }, []);

  return { heroSection, fetchHeroSection };
}

export default useHeroPage;
