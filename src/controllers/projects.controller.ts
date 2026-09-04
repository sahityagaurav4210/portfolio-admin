import { CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class ProjectsController {
  private getApiBaseUri(): string {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    return baseUrl;
  }

  public async makeGetProjectsListReq(): Promise<IApiReply> {
    const baseUrl = this.getApiBaseUri();

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/projects/list`;

    const rawReply = await appController.GET(fullAbsUrl);
    const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET.bind(appController));

    return reply;
  }

  public async createNewProject(payload: FormData): Promise<IApiReply> {
    const baseUrl = this.getApiBaseUri();

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/projects/add`;

    const rawReply = await appController.POST(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePostReply(
      rawReply,
      fullAbsUrl,
      appController.POST.bind(appController),
      undefined,
      payload,
    );

    return reply;
  }

  public async updateExistingProjectById(projectId: string, payload: FormData): Promise<IApiReply> {
    const baseUrl = this.getApiBaseUri();

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/projects/update/${projectId}`;

    const rawReply = await appController.PUT(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePutReply(
      rawReply,
      fullAbsUrl,
      appController.PUT.bind(appController),
      undefined,
      payload,
    );

    return reply;
  }

  public async deleteExistingProjectById(projectId: string): Promise<IApiReply> {
    const baseUrl = this.getApiBaseUri();

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/projects/update/${projectId}`;

    const rawReply = await appController.DELETE(fullAbsUrl);
    const reply = await appController.getSafeDeleteReply(
      rawReply,
      fullAbsUrl,
      appController.DELETE.bind(appController),
    );

    return reply;
  }
}

export default ProjectsController;
