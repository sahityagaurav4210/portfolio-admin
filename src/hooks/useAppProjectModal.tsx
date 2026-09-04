import { useNavigate } from "react-router-dom";
import ProjectsController from "../controllers/projects.controller";
import { checkLogoutApiResponse } from "../helpers";
import { ApiStatus } from "../api";
import { IProjects } from "../interfaces/models.interface";

function useAppProjectModal() {
  const navigate = useNavigate();

  function buildProjectFormData(projectData: Partial<IProjects>, cardImageFile?: File | null): FormData {
    const formData = new FormData();

    if (projectData.name !== undefined) formData.append("name", projectData.name);
    if (projectData.type !== undefined) formData.append("type", projectData.type);
    if (projectData.text !== undefined) formData.append("text", projectData.text);

    if (Array.isArray(projectData.tech_stack)) {
      projectData.tech_stack.forEach((tech) => formData.append("tech_stack", tech));
      formData.append("techStack", JSON.stringify(projectData.tech_stack));
    }

    if (projectData.codeLink !== undefined) formData.append("codeLink", projectData.codeLink);
    if (projectData.liveLink !== undefined) formData.append("liveLink", projectData.liveLink);
    if (projectData.documentation_link !== undefined) {
      formData.append("documentation_link", projectData.documentation_link);
    }
    if (projectData.note !== undefined) formData.append("note", projectData.note);
    if (projectData.priority !== undefined && projectData.priority !== null) {
      formData.append("priority", String(Number(projectData.priority)));
    }

    if (projectData.projectDomain !== undefined && projectData.projectDomain !== null) {
      formData.append("projectDomain", projectData.projectDomain);
    }
    if (projectData.disabled !== undefined) formData.append("disabled", String(Boolean(projectData.disabled)));
    if (projectData.ongoing !== undefined) formData.append("ongoing", String(Boolean(projectData.ongoing)));
    if (projectData.showDivider !== undefined) formData.append("showDivider", String(Boolean(projectData.showDivider)));

    if (cardImageFile) {
      formData.append("cardImage", cardImageFile);
    }


    return formData;
  }

  async function addProject(projectData: Partial<IProjects>, cardImageFile?: File | null) {
    const formData = buildProjectFormData(projectData, cardImageFile);

    const controller = new ProjectsController();
    const reply = await controller.createNewProject(formData);
    const isLogout = checkLogoutApiResponse(reply.status, reply.message);

    if (isLogout) {
      await navigate("/auth/login");
      localStorage.clear();
      return;
    }

    if (reply.status === ApiStatus.SUCCESS) {
      return reply;
    }

    throw new Error(reply.message || "Failed to create project");
  }

  async function editProject(id: string, projectData: Partial<IProjects>, cardImageFile?: File | null) {
    const formData = buildProjectFormData(projectData, cardImageFile);

    const controller = new ProjectsController();
    const reply = await controller.updateExistingProjectById(id, formData);
    const isLogout = checkLogoutApiResponse(reply.status, reply.message);

    if (isLogout) {
      await navigate("/auth/login");
      localStorage.clear();
      return;
    }

    if (reply.status === ApiStatus.SUCCESS) {
      return reply;
    }

    throw new Error(reply.message || "Failed to update project");
  }

  return { addProject, editProject };
}

export default useAppProjectModal;
