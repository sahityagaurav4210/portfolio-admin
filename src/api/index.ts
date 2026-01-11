import { AppUserAgent } from "../constants";
import { IApiReply } from "../interfaces/api.interface";

export enum ApiStatus {
  SUCCESS = "success",
  ERROR = "error",
  EXCEPTION = "exception",
  VALIDATION = "validation",
  CONFLICT = "already exists",
  UNDEFINED = "not defined",
  UNAUTHORISED = "unauthorised",
  NOT_FOUND = "not found",
  FORBIDDEN = "forbidden",
  TIMEOUT = "api time out",
  LOGOUT = "Logout",
}

export enum HttpVerbs {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export function getApiHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "*/*",
    "x-user-id": AppUserAgent,
  };
}

export class ApiController {
  public async GET(
    loginUri: string,
    authorization?: string
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();
      const headers = authorization
        ? { ...getApiHeaders(), Authorization: authorization }
        : getApiHeaders();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${loginUri}`,
        {
          method: HttpVerbs.GET,
          headers,
          signal: controller.signal,
        }
      );

      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        const token = localStorage.getItem("token") as string;
        const status = await this.refreshAccessToken(token);

        if (status === ApiStatus.FORBIDDEN) {
          return { status: ApiStatus.LOGOUT, message: "Logout" };
        }

        const authorization = localStorage.getItem("authorization") as string;
        const reply = await this.GET(loginUri, `Bearer ${authorization}`);
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

  public async POST(
    loginUri: string,
    authorization?: string,
    payload?: Record<string, any>
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();
      const headers = authorization
        ? { ...getApiHeaders(), Authorization: authorization }
        : getApiHeaders();
      const commons = {
        method: HttpVerbs.POST,
        headers,
        signal: controller.signal,
      };
      const apiPayload = payload
        ? { ...commons, body: JSON.stringify(payload) }
        : commons;

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${loginUri}`,
        apiPayload
      );

      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        const token = localStorage.getItem("token") as string;
        const status = await this.refreshAccessToken(token);

        if (status === ApiStatus.FORBIDDEN) {
          return { status: ApiStatus.LOGOUT, message: "Logout" };
        }

        const authorization = localStorage.getItem("authorization") as string;
        const reply = await this.GET(loginUri, `Bearer ${authorization}`);
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

  public async PUT(
    loginUri: string,
    authorization?: string,
    payload?: Record<string, any>
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();
      const headers = authorization
        ? { ...getApiHeaders(), Authorization: authorization }
        : getApiHeaders();
      const commons = {
        method: HttpVerbs.PUT,
        headers,
        signal: controller.signal,
      };
      const apiPayload = payload
        ? { ...commons, body: JSON.stringify(payload) }
        : commons;

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${loginUri}`,
        apiPayload
      );

      if (rawReply.status === 204) {
        return { status: ApiStatus.SUCCESS, message: "Updated" };
      }

      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        const token = localStorage.getItem("token") as string;
        const status = await this.refreshAccessToken(token);

        if (status === ApiStatus.FORBIDDEN) {
          return { status: ApiStatus.LOGOUT, message: "Logout" };
        }

        const authorization = localStorage.getItem("authorization") as string;
        const reply = await this.GET(loginUri, `Bearer ${authorization}`);
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

  public async logout(
    loginUri: string,
    tokens: Record<string, any>
  ): Promise<IApiReply> {
    try {
      const controller = new AbortController();
      const headers = {
        ...getApiHeaders(),
        Authorization: tokens.authorization,
        "x-ref-token": tokens.token,
      };
      const commons = {
        method: HttpVerbs.POST,
        headers,
        signal: controller.signal,
      };
      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${loginUri}`,
        commons
      );

      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        const token = localStorage.getItem("token") as string;
        await this.refreshAccessToken(token);

        const authorization = localStorage.getItem("authorization") as string;
        const reply = await this.GET(loginUri, `Bearer ${authorization}`);
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

  private async refreshAccessToken(token: string): Promise<void | string> {
    try {
      const controller = new AbortController();
      const headers = { ...getApiHeaders(), "x-ref-token": token };

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const rawReply = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/authentication/tokens/refresh-access-token`,
        {
          method: HttpVerbs.GET,
          headers,
          signal: controller.signal,
        }
      );

      const reply = (await rawReply.json()) as IApiReply;

      if (reply.status === ApiStatus.FORBIDDEN) {
        return reply.status;
      }
      localStorage.setItem("authorization", reply?.data?.access_token);
    } catch {}
  }
}
