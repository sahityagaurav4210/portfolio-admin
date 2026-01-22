import { CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class ToolsController {
  public async makeUpdateWebsiteReq(payload: Record<string, any>): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/update-website`;

    const rawReply = await appController.POST(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePostReply(rawReply, fullAbsUrl, appController.POST, {}, payload);

    return reply;
  }

  public async makeTokenGenerationWebsiteReq(payload: Record<string, any>): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/authentication/tokens/refresh-client-token`;

    const rawReply = await appController.POST(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePostReply(rawReply, fullAbsUrl, appController.POST, {}, payload);

    return reply;
  }
}

export default ToolsController;
