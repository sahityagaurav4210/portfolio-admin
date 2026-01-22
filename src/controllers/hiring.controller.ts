import { ApiStatus, CWPBApiController } from "../api";
import { IApiReply } from "../interfaces/api.interface";

class HiringController {
  public async makeSoftDeleteHiringReq(hiringId: string): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl =
      appEnv === "local" ? "/api/v1" : import.meta.env.VITE_API_BASE_URL;
    let url = `${baseUrl}/hiring/soft-delete/${hiringId}`;

    try {
      const appController = new CWPBApiController();

      const rawReply = await appController.DELETE(url);
      const reply = await appController.getSafeReply(
        rawReply,
        url,
        appController.DELETE
      );

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makePermanentDeleteHiringReq(
    hiringId: string
  ): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl =
      appEnv === "local" ? "/api/v1" : import.meta.env.VITE_API_BASE_URL;
    let url = `${baseUrl}/hiring/delete/${hiringId}`;

    try {
      const appController = new CWPBApiController();

      const rawReply = await appController.DELETE(url);
      const reply = await appController.getSafeReply(
        rawReply,
        url,
        appController.DELETE
      );

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makeGetHiringRecordsReq(): Promise<IApiReply> {
    const appEnv = import.meta.env.VITE_APP_ENV;
    const baseUrl =
      appEnv === "local" ? "/api/v1" : import.meta.env.VITE_API_BASE_URL;
    let url = `${baseUrl}/hiring/all`;

    try {
      const appController = new CWPBApiController();

      const rawReply = await appController.GET(url);
      const reply = await appController.getSafeReply(
        rawReply,
        url,
        appController.GET
      );

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

export default HiringController;
