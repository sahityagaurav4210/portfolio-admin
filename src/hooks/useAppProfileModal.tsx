import { ApiStatus } from "../api";
import LayoutController from "../controllers/layout.controller";
import useAppHelperFn from "./useAppHelperFn";

function useAppProfileModal() {
  const { getSafeFormDataPayload } = useAppHelperFn();

  async function editProfile(profile: Record<string, any>, avatar?: File | null) {
    const controller = new LayoutController();
    const payload = getSafeFormDataPayload({ ...profile, avatar });
    const reply = await controller.makePutProfileReq(payload);

    if (reply.status === ApiStatus.SUCCESS && reply.message === "Updated") return reply;
    throw new Error(reply.message || "Failed to update profile");
  }

  async function fetchProfile() {
    const controller = new LayoutController();
    const reply = await controller.makeGetProfileReq();

    if (reply.status === ApiStatus.SUCCESS && reply.data) return reply;

    throw new Error(reply.message || "Failed to fetch profile");
  }

  return { editProfile, fetchProfile };
}

export default useAppProfileModal;
