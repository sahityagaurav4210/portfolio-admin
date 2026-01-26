import { ApiStatus, getApiHeaders, HttpVerbs } from "../api";
import { getApiBaseUrl } from "../helpers";
import { IApiReply } from "../interfaces/api.interface";

export class FTPController {
  public async refreshAccessToken(token: string): Promise<void | string> {
    try {
      const appEnv = import.meta.env.VITE_APP_ENV;
      const baseUrl = getApiBaseUrl(appEnv);

      const fullAbsUrl = `${baseUrl}/authentication/tokens/refresh-access-token`;
      const headers = { ...getApiHeaders("application/json"), "x-ref-token": token };

      const rawReply = await fetch(fullAbsUrl, {
        method: HttpVerbs.GET,
        headers,
        credentials: "include",
      });
      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) return reply.status;
      localStorage.setItem("authorization", reply?.data?.access_token);
    } catch {
      return ApiStatus.EXCEPTION;
    }
  }

  private async GET(url: string, authorization?: string): Promise<IApiReply> {
    try {
      const controller = new AbortController();
      const headers = authorization ? { ...getApiHeaders(), Authorization: authorization } : getApiHeaders();

      setTimeout(
        () => {
          controller.abort();
        },
        Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
      );

      const rawReply = await fetch(url, {
        method: HttpVerbs.GET,
        headers,
        signal: controller.signal,
      });

      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        const token = localStorage.getItem("token") as string;
        const status = await this.refreshAccessToken(token);

        if (status === ApiStatus.FORBIDDEN) {
          return { status: ApiStatus.LOGOUT, message: "Logout" };
        }

        const authorization = localStorage.getItem("authorization") as string;
        const reply = await this.GET(url, `Bearer ${authorization}`);
        return reply;
      }

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  private async POST(url: string, authorization?: string, payload?: Record<string, any>): Promise<IApiReply> {
    try {
      const controller = new AbortController();
      const headers = authorization ? { ...getApiHeaders(), Authorization: authorization } : getApiHeaders();
      const commons = {
        method: HttpVerbs.POST,
        headers,
        signal: controller.signal,
      };
      const apiPayload = payload ? { ...commons, body: JSON.stringify(payload) } : commons;

      setTimeout(
        () => {
          controller.abort();
        },
        Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
      );

      const rawReply = await fetch(url, apiPayload);
      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        const token = localStorage.getItem("token") as string;
        const status = await this.refreshAccessToken(token);

        if (status === ApiStatus.FORBIDDEN) {
          return { status: ApiStatus.LOGOUT, message: "Logout" };
        }

        const authorization = localStorage.getItem("authorization") as string;
        const reply = await this.GET(url, `Bearer ${authorization}`);
        return reply;
      }

      return reply;
    } catch {
      const reply = {
        status: ApiStatus.TIMEOUT,
        message: "Connection broked, please try again later",
      };

      return reply;
    }
  }

  public async generateToken(url: string, authorization: string, payload: Record<string, any>): Promise<boolean> {
    const reply = await this.POST(url, authorization, payload);

    if (reply.status === ApiStatus.SUCCESS) return true;
    else return false;
  }
}
