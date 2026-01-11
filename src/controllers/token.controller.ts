import { ApiStatus } from "../api";
import { CallbackFn } from "../interfaces";
import { IApiReply } from "../interfaces/api.interface";
import { FTPController } from "./ftp.controller";

class TokenController {
  public async refreshToken(
    reply: IApiReply,
    refAccessToken: string,
    callbackFn: CallbackFn,
    ...params: any
  ): Promise<IApiReply> {
    if (
      reply.status === ApiStatus.FORBIDDEN &&
      reply.message === "Token expired"
    ) {
      const ftpController = new FTPController();
      const response = await ftpController.refreshAccessToken(refAccessToken);

      if (response === ApiStatus.FORBIDDEN) {
        return { status: ApiStatus.LOGOUT, message: "Session expired" };
      }

      if (response === ApiStatus.EXCEPTION) {
        return {
          status: ApiStatus.EXCEPTION,
          message: "Something went wrong at our end.",
        };
      }

      return await callbackFn(params);
    }

    return reply;
  }
}

export default TokenController;
