import { ApiStatus, HttpVerbs } from "../api";
import { AppUserAgent } from "../constants";
import { IApiReply } from "../interfaces/api.interface";
import { ILoginModel } from "../interfaces/models.interface";

export class LoginController {
  public async makePostLoginReq(
    loginUri: string,
    loginFrmData: ILoginModel
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const refToken = localStorage.getItem("token");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${loginUri}`,
        {
          method: HttpVerbs.POST,
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "x-user-id": AppUserAgent,
            "x-token": refToken || "",
          },
          body: JSON.stringify(loginFrmData),
          signal: controller.signal,
        }
      );

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

  public async makeGetCaptchaReq(captchaUri: string): Promise<IApiReply> {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const refToken = localStorage.getItem("token");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${captchaUri}`,
        {
          method: HttpVerbs.GET,
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "x-user-id": AppUserAgent,
            "x-token": refToken || "",
          },
          signal: controller.signal,
        }
      );

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

  public async makeGetRefCaptchaReq(
    captchaUri: string,
    captchaId: number
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const refToken = localStorage.getItem("token");

      const rawReply = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/${captchaUri}?captchaId=${captchaId}`,
        {
          method: HttpVerbs.GET,
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "x-user-id": AppUserAgent,
            "x-token": refToken || "",
          },
          signal: controller.signal,
        }
      );

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

  public async makeGetCaptchaImgReq(
    captchaId: number
  ): Promise<Blob | IApiReply> {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const refToken = localStorage.getItem("token");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/captcha/${captchaId}`,
        {
          method: HttpVerbs.GET,
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "x-user-id": AppUserAgent,
            "x-token": refToken || "",
          },
          signal: controller.signal,
        }
      );

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

  public async makeGetCaptchaAudioReq(
    captchaId: number
  ): Promise<Blob | IApiReply> {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const refToken = localStorage.getItem("token");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/captcha/audio/${captchaId}`,
        {
          method: HttpVerbs.GET,
          headers: {
            Accept: "audio/mpeg",
            "x-user-id": AppUserAgent,
            "x-token": refToken || "",
          },
          signal: controller.signal,
        }
      );

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

  public async makeGetCaptchaValidateReq(
    captchaId: number,
    captcha: string
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const refToken = localStorage.getItem("token");

      const rawReply = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/captcha-validate?captchaId=${captchaId}&captcha=${captcha}`,
        {
          method: HttpVerbs.GET,
          headers: {
            Accept: "application/json",
            "x-user-id": AppUserAgent,
            "x-token": refToken || "",
          },
          signal: controller.signal,
        }
      );

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
