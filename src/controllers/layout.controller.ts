import { CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class LayoutController {
  public async makeLogoutReq(): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/authentication/logout`;

    const rawReply = await appController.POST(fullAbsUrl);
    const reply = await appController.getSafePostReply(rawReply, fullAbsUrl, appController.POST);

    return reply;
  }

  public async makeGetProfileReq(): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/user/profile`;

    const rawReply = await appController.GET(fullAbsUrl);
    const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET);

    return reply;
  }

  public async makePutProfileReq(payload: Record<string, any>): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/user/edit-profile`;

    const rawReply = await appController.PUT(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePutReply(rawReply, fullAbsUrl, appController.PUT, {}, payload);

    return reply;
  }

  public async makeChangePwdReq(payload: Record<string, any>): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/user/change-pwd`;

    const rawReply = await appController.PUT(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePutReply(rawReply, fullAbsUrl, appController.PUT, {}, payload);

    return reply;
  }
}

export default LayoutController;
