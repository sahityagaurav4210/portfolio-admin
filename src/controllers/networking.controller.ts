import { ApiStatus, CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

class NetworkingController {
  public async makeGetClientIpLocReq(clientIp: string): Promise<IApiReply> {
    let reply: IApiReply;

    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/networking/location`;
      const qs = { clientIp };
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const rawReply = await appController.GET(fullAbsUrl, qs);
      reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET, qs);

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }
}

export default NetworkingController;
