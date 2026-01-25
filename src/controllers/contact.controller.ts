import { CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class ContactController {
  public async makeGetContactListReq(): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const appController = new CWPBApiController();
    const fullAbsUrl = `${baseUrl}/contract/all`;

    const rawReply = await appController.GET(fullAbsUrl);
    const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET.bind(appController));

    return reply;
  }
}

export default ContactController;
