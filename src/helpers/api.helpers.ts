import { IApiReply } from "../interfaces/api.interface";

export function getArrayRecords<T>(apiRes: IApiReply): Array<T> {
  const response = apiRes.data || [];
  const list = response.map((item: T, index: number) => ({
    ...item,
    id: index + 1,
  }));
  return list;
}

export function getApiBaseUrl(environment: string): string {
  const baseUrl =
    environment === "local" ? "/api/v1" : import.meta.env.VITE_API_BASE_URL;

  return baseUrl;
}
