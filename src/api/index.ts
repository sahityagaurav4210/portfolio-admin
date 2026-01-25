import { AppUserAgent } from "../constants";
import { FTPController } from "../controllers/ftp.controller";
import { ApiPayload, GETCallbackFn, POSTCallbackFn, QueryString } from "../interfaces";
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

export function getApiHeaders(acceptPayloadType?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: acceptPayloadType || "*/*",
    "x-user-id": AppUserAgent,
  };
}

export class CWPBApiController {
  private urlBuilder(url: string, qs?: Record<string, string | number>): string {
    const queryKeys = Object.keys(qs || {});
    const queryValues = Object.values(qs || {});

    let uri = url;

    for (let index = 0; index < queryKeys.length; index++) {
      if (index === 0) {
        uri += `?${queryKeys[index]}=${queryValues[index]}`;
        continue;
      }

      uri += `&${queryKeys[index]}=${queryValues[index]}`;
    }

    return uri;
  }

  private async makeApiRequest(url: string, apiConfig: RequestInit, controller: AbortController): Promise<Response> {
    const timeoutId = setTimeout(
      () => {
        controller.abort();
      },
      Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
    );

    const rawReply = await fetch(url, apiConfig);
    clearTimeout(timeoutId);

    return rawReply;
  }

  private async handleTokenExpiry(
    url: string,
    callback: Function,
    qs?: QueryString,
    payload?: ApiPayload,
  ): Promise<IApiReply> {
    const refAccessToken = localStorage.getItem("token") || "";
    const ftpController = new FTPController();
    const tokenRefReply = await ftpController.refreshAccessToken(refAccessToken);

    if (tokenRefReply === ApiStatus.FORBIDDEN) return { status: ApiStatus.LOGOUT, message: "Session expired" };
    if (tokenRefReply === ApiStatus.EXCEPTION)
      return { status: ApiStatus.EXCEPTION, message: "Something went wrong at our end." };

    const retry = await callback(url, qs, payload);
    return (await retry.json()) as IApiReply;
  }

  public async GET(url: string, queryStrings?: Record<string, string | number>): Promise<Response> {
    let uri = this.urlBuilder(url, queryStrings);
    const headers = getApiHeaders("application/json");
    const controller = new AbortController();
    const apiConfig: RequestInit = {
      method: HttpVerbs.GET,
      headers,
      credentials: "include",
      signal: controller.signal,
    };

    const rawReply = await this.makeApiRequest(uri, apiConfig, controller);
    return rawReply;
  }

  public async POST(url: string, queryStrings?: QueryString, body?: ApiPayload): Promise<Response> {
    let uri = this.urlBuilder(url, queryStrings);
    const controller = new AbortController();
    const headers = getApiHeaders("application/json");
    const apiConfig: RequestInit = {
      method: HttpVerbs.POST,
      headers,
      body: JSON.stringify(body),
      credentials: "include",
      signal: controller.signal,
    };

    const rawReply = await this.makeApiRequest(uri, apiConfig, controller);
    return rawReply;
  }

  public async PUT(url: string, queryStrings?: QueryString, body?: ApiPayload): Promise<Response> {
    let uri = this.urlBuilder(url, queryStrings);
    const controller = new AbortController();
    const headers = getApiHeaders("application/json");
    const apiConfig: RequestInit = {
      method: HttpVerbs.PUT,
      headers,
      body: JSON.stringify(body),
      credentials: "include",
      signal: controller.signal,
    };

    const rawReply = await this.makeApiRequest(uri, apiConfig, controller);
    return rawReply;
  }

  public async DELETE(url: string): Promise<Response> {
    const controller = new AbortController();
    const headers = getApiHeaders("application/json");
    const apiConfig: RequestInit = {
      method: HttpVerbs.DELETE,
      headers,
      credentials: "include",
      signal: controller.signal,
    };

    const rawReply = await this.makeApiRequest(url, apiConfig, controller);
    return rawReply;
  }

  public async getSafeReply(
    rawReply: Response,
    url: string,
    callbackFn: GETCallbackFn,
    qs?: QueryString,
  ): Promise<IApiReply> {
    let reply: IApiReply;

    reply = (await rawReply.json()) as IApiReply;

    if (reply.status === ApiStatus.FORBIDDEN && reply.message === "Token expired") {
      reply = await this.handleTokenExpiry(url, callbackFn, qs);
    }

    return reply;
  }

  public async getSafePostReply(
    rawReply: Response,
    url: string,
    callbackFn: POSTCallbackFn,
    qs?: QueryString,
    payload?: Record<string, any>,
  ): Promise<IApiReply> {
    let reply: IApiReply;

    reply = (await rawReply.json()) as IApiReply;

    if (reply.status === ApiStatus.FORBIDDEN && reply.message === "Token expired") {
      reply = await this.handleTokenExpiry(url, callbackFn, qs, payload);
    }

    return reply;
  }

  public async getSafePutReply(
    rawReply: Response,
    url: string,
    callbackFn: POSTCallbackFn,
    qs?: QueryString,
    payload?: Record<string, any>,
  ): Promise<IApiReply> {
    let reply: IApiReply;

    if (rawReply.status === 204) return { status: ApiStatus.SUCCESS, message: "Updated" };

    reply = (await rawReply.json()) as IApiReply;

    if (reply.status === ApiStatus.FORBIDDEN && reply.message === "Token expired") {
      const refAccessToken = localStorage.getItem("token") || "";
      const ftpController = new FTPController();

      const tokenRefReply = await ftpController.refreshAccessToken(refAccessToken);

      if (tokenRefReply === ApiStatus.FORBIDDEN) return { status: ApiStatus.LOGOUT, message: "Session expired" };
      if (tokenRefReply === ApiStatus.EXCEPTION)
        return {
          status: ApiStatus.EXCEPTION,
          message: "Something went wrong at our end.",
        };

      rawReply = await callbackFn(url, qs, payload);

      if (rawReply.status === 204) reply = { status: ApiStatus.SUCCESS, message: "Updated" };
      else reply = { status: ApiStatus.LOGOUT, message: "Session expired, please try again!!!" };
    }

    return reply;
  }
}
