import { ApiStatus } from "../api";
import LayoutController from "../controllers/layout.controller";

function useAppProfileModal() {
  async function editProfile(profile: Record<string, any>, avatar?: File | null) {
    const controller = new LayoutController();
    let payload: FormData;

    payload = new FormData();
    payload.append("name", profile.name);
    payload.append("email", profile.email);
    payload.append("address", profile.address);
    payload.append("websites", profile.websites);

    if (avatar) {
      payload.append("avatar", avatar);
    }

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
