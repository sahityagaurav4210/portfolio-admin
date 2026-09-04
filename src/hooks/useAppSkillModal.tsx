import { useNavigate } from "react-router-dom";
import SkillController from "../controllers/skills.controller";
import { checkLogoutApiResponse } from "../helpers";
import { ApiStatus } from "../api";

function useAppSkillModal() {
  const navigate = useNavigate();

  async function addSkill(skillFormData: Record<string, any>, skillFile?: File | null) {
    const formData = new FormData();
    formData.append("name", skillFormData.name);
    formData.append("experience", String(skillFormData.experience));
    formData.append("description", skillFormData.description);
    formData.append("priority", skillFormData.priority);

    if (skillFile) formData.append("skill", skillFile);

    const controller = new SkillController();
    const reply = await controller.makePostSkillReq(formData);
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

  async function editSkill(id: string, skillFormData: Record<string, any>, skillFile?: File | null) {
    const formData = new FormData();
    formData.append("name", skillFormData.name);
    formData.append("experience", String(skillFormData.experience));
    formData.append("description", skillFormData.description);
    formData.append("priority", skillFormData.priority);

    if (skillFile) formData.append("skill", skillFile);

    const controller = new SkillController();
    const reply = await controller.makePutSkillReq(id, formData);
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

  return { addSkill, editSkill };
}

export default useAppSkillModal;
