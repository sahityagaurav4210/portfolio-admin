import { CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class ViewsController {
  public async makeGetViewsListReq(): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/today-views-details`;

    const rawReply = await appController.GET(fullAbsUrl);
    const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET.bind(appController));

    return reply;
  }
}

export default ViewsController;
