import { IAuthUserPayload, IAuthUserProfilePayload } from "./states.interfaces";

export interface IAuthState {
  user: IAuthUserPayload | null;
}

export interface IAuthUserProfileState {
  profile: IAuthUserProfilePayload | null;
}