import { ApiStatus } from "../api";

export interface IApiReply {
    status: ApiStatus;
    message: string;
    data?: any;
    entryBy?: string;
}