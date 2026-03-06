import { ApiStatus, CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

export class FilesController {
  public async uploadResume(formData: FormData): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl = getApiBaseUrl(appEnv);

    const fullAbsUrl = `${baseUrl}/files/upload-resume`;

    try {
      const appController = new CWPBApiController();

      const rawReply = await appController.POST(fullAbsUrl, {}, formData);
      const reply = await appController.getSafePostReply(rawReply, fullAbsUrl, appController.POST.bind(appController), {}, formData);

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