import { ApiStatus, HttpVerbs } from "../api";
import { AppUserAgent } from "../constants";
import { IApiReply } from "../interfaces/api.interface";
import TokenController from "./token.controller";

class HiringController {
  public async makeSoftDeleteHiringReq(hiringId: string): Promise<IApiReply> {
    let reply: IApiReply;

    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const authorization = localStorage.getItem("authorization");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hiring/soft-delete/${hiringId}`,
        {
          method: HttpVerbs.DELETE,
          headers: {
            Accept: "application/json",
            "x-user-id": AppUserAgent,
            Authorization: `Bearer ${authorization}`,
          },
          signal: controller.signal,
        }
      );

      reply = (await rawReply.json()) as IApiReply;
      const refAccessToken = localStorage.getItem("token") || "";
      const tokenController = new TokenController();

      reply = await tokenController.refreshToken(
        reply,
        refAccessToken,
        this.makePermanentDeleteHiringReq,
        hiringId
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
    let reply: IApiReply;

    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const authorization = localStorage.getItem("authorization");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hiring/delete/${hiringId}`,
        {
          method: HttpVerbs.DELETE,
          headers: {
            Accept: "application/json",
            "x-user-id": AppUserAgent,
            Authorization: `Bearer ${authorization}`,
          },
          signal: controller.signal,
        }
      );

      reply = (await rawReply.json()) as IApiReply;
      const refAccessToken = localStorage.getItem("token") || "";
      const tokenController = new TokenController();

      reply = await tokenController.refreshToken(
        reply,
        refAccessToken,
        this.makePermanentDeleteHiringReq,
        hiringId
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
    let reply: IApiReply;

    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, Number(import.meta.env.VITE_API_TIMEOUT) || 5000);

      const authorization = localStorage.getItem("authorization");

      const rawReply = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/hiring/all`,
        {
          method: HttpVerbs.GET,
          headers: {
            Accept: "application/json",
            "x-user-id": AppUserAgent,
            Authorization: `Bearer ${authorization}`,
          },
          signal: controller.signal,
        }
      );

      reply = (await rawReply.json()) as IApiReply;
      const refAccessToken = localStorage.getItem("token") || "";
      const tokenController = new TokenController();

      reply = await tokenController.refreshToken(
        reply,
        refAccessToken,
        this.makeGetHiringRecordsReq
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
