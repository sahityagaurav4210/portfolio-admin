import { IApiReply } from "../interfaces/api.interface";

export function getArrayRecords<T>(apiRes: IApiReply): Array<T> {
  const response = Array.from(apiRes.data || []) as T[];
  const list = response.map((item: T, index: number) => ({
    ...item,
    id: index + 1,
  }));
  return list;
}
