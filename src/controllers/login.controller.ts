import { ApiStatus, CWPBApiController } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";
import { ILoginModel } from "../interfaces/models.interface";

export class LoginController {
  public async makePostLoginReq(relativeUrl: string, loginFrmData: ILoginModel): Promise<IApiReply> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/${relativeUrl}`;

      const rawReply = await appController.POST(fullAbsUrl, {}, loginFrmData);
      const reply = await appController.getSafePostReply(rawReply, fullAbsUrl, appController.POST, {}, loginFrmData);

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makeGetCaptchaReq(captchaRelativeUri: string): Promise<IApiReply> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/${captchaRelativeUri}`;

      const rawReply = await appController.GET(fullAbsUrl);
      const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET);
      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makeGetRefCaptchaReq(captchaRelativeUri: string, captchaId: number): Promise<IApiReply> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/${captchaRelativeUri}`;
      const qs = { captchaId };

      const rawReply = await appController.GET(fullAbsUrl, qs);
      const reply = await appController.getSafeReply(rawReply, fullAbsUrl, appController.GET, qs);
      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makeGetCaptchaImgReq(captchaId: number): Promise<Blob | IApiReply> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/captcha/${captchaId}`;

      const rawReply = await appController.GET(fullAbsUrl);
      const reply = await rawReply.blob();
      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makeGetCaptchaAudioReq(captchaId: number): Promise<Blob | IApiReply> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/captcha/audio/${captchaId}`;

      const rawReply = await appController.GET(fullAbsUrl);
      const reply = await rawReply.blob();

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async makeGetCaptchaValidateReq(captchaId: number, captcha: string): Promise<IApiReply> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const appController = new CWPBApiController();
      const fullAbsUrl = `${baseUrl}/captcha-validate`;
      const qs = { captchaId, captcha };

      const rawReply = await appController.GET(fullAbsUrl, qs);
      const reply = (await rawReply.json()) as IApiReply;

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
