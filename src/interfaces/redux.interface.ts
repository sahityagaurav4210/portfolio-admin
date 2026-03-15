import { IAuthUserPayload } from "./states.interfaces";

export interface IAuthState {
  user: IAuthUserPayload | null;
}