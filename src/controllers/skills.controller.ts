import { CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class SkillController {
  public async makeGetSkillListReq(): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/skills/list`;

    const rawReply = await appController.GET(fullAbsUrl);
    const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET);

    return reply;
  }

  public async makePostSkillReq(payload: Record<string, any>): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/skills/add`;

    const rawReply = await appController.POST(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePostReply(
      rawReply,
      fullAbsUrl,
      appController.POST.bind(appController),
      {},
      payload,
    );

    return reply;
  }

  public async makePutSkillReq(_id: string, payload: Record<string, any>): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/portfolio/skills/update/${_id}`;

    const rawReply = await appController.PUT(fullAbsUrl, {}, payload);
    const reply = await appController.getSafePutReply(
      rawReply,
      fullAbsUrl,
      appController.PUT.bind(appController),
      {},
      payload,
    );

    return reply;
  }
}

export default SkillController;
