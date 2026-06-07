import { ApiStatus } from "../api";
import LayoutController from "../controllers/layout.controller";
import { IApiReply } from "../interfaces/api.interface";

function useAppPublicPages() {
  async function verifyProfileXuidToken(token: string, authorizer: string): Promise<IApiReply> {
    const controller = new LayoutController();
    const response = await controller.makeGetVerifyProfileXuidTokenReq(token, authorizer);

    if (response.status !== ApiStatus.SUCCESS) throw new Error(response.message);

    return response;
  }

  async function getPublicProfile(token: string): Promise<IApiReply> {
    const controller = new LayoutController();
    const response = await controller.makeGetPublicProfileReq(token);

    if (response.status !== ApiStatus.SUCCESS) throw new Error(response.message);

    return response;
  }

  return { verifyProfileXuidToken, getPublicProfile };
}

export default useAppPublicPages;
