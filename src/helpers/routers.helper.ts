import { ApiController } from "../api";

async function getRouteStatus(url: string): Promise<boolean> {
  const api = new ApiController();
  const { data } = await api.GET(`page-status?url=${url}`);
  return data[0]?.status || false;
}

export { getRouteStatus };