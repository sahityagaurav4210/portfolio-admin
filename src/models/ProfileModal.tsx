import { memo, ReactNode, useCallback, useMemo, useState } from "react";
import { IViewDialogProp } from "../interfaces/component_props.interface";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AccountBox, AlternateEmail, Close, Home, Person, Phone, Save, Web } from "@mui/icons-material";
import { IProfilePayload } from "../interfaces/states.interfaces";
import { BtnClick, InputChange } from "../interfaces";
import LayoutController from "../controllers/layout.controller";
import { ApiStatus } from "../api";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import ModalCloseButton from "../components/styled/ModalCloseButton";
import ModalHeading from "../components/headings/ModalHeading";
import FileUpload from "../components/FileUpload";
import AppImage from "../components/AppImage";
import useAppHelperFn from "../hooks/useAppHelperFn";

function ProfileModal({ open, handleDialogCloseBtnClick, details }: Readonly<IViewDialogProp>): ReactNode {
  const theme = useTheme();
  const { getResourceUrl } = useAppHelperFn();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const imageUrl = getResourceUrl(details?.avatar);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfilePayload>({
    name: details?.name || "",
    phone: details?.phone || "",
    email: details?.email || "",
    address: details?.address || "",
    websites: details?.websites || "",
  });

  const alertMsg = useMemo(
    () =>
      isEditMode
        ? "This form is in now edit mode. You can now edit your profile."
        : "This form is in read-only mode. Please toggle the edit mode in order to edit your profile.",
    [isEditMode]
  );

  const handleEditModeToggleBtn = useCallback(
    function () {
      setIsEditMode((prev) => !prev);
    },
    [isEditMode]
  );

  const handleInpOnChange = useCallback(
    function (event: InputChange) {
      const { name, value } = event.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
    },
    [profile]
  );

  const handleSaveChangesBtn = useCallback(
    async function (event: BtnClick) {
      event.preventDefault();
      setIsEditing(true);

      try {
        const controller = new LayoutController();
        let payload: FormData;

        payload = new FormData();
        payload.append("name", profile.name);
        payload.append("email", profile.email);
        payload.append("phone", profile.phone);
        payload.append("address", profile.address);
        payload.append("websites", profile.websites);

        if (profilePic) {
          payload.append("avatar", profilePic);
        }

        const reply = await controller.makePutProfileReq(payload);

        if (reply.status === ApiStatus.SUCCESS && reply.message === "Updated") {
          const profile = await controller.makeGetProfileReq();

          setIsEditMode(false);
          setProfile(profile.data);
          toast.success("Profile updated successfully", getGlobalToastConfig());
          return;
        }

        throw new Error(reply.message);
      } catch (error: any) {
        const message = error?.message || "Something went wrong at our end, please try again!!!";
        toast.error(message, getGlobalToastConfig());
      } finally {
        setIsEditing(false);
      }
    },
    [profile, profilePic]
  );

  return (
    <Dialog maxWidth="lg" fullWidth open={open}>
      <Box component="div" className="flex justify-end p-1">
        <ModalCloseButton onClick={handleDialogCloseBtnClick}>
          <Close fontSize="medium" />
        </ModalCloseButton>
      </Box>

      <DialogTitle>
        <ModalHeading Icon={AccountBox} text="Your profile" />
      </DialogTitle>

      <DialogContent sx={{ borderTop: `1px solid ${theme.palette.secondary.A100}` }}>
        <Container maxWidth="md" sx={{ mx: "auto", my: 1 }}>
          <Alert severity="info" variant="filled" className="flex items-center">
            {alertMsg}
          </Alert>
        </Container>

        <Box component="div" className="my-1 flex items-center justify-end">
          <Typography variant="subtitle1" fontWeight={700} color="warning">
            Toggle edit mode
          </Typography>
          <Switch color="warning" checked={isEditMode} onClick={handleEditModeToggleBtn} />
        </Box>

        <Box component="div" my={2} display="flex" justifyContent="center">
          {isEditMode ? (
            <Box width="100%">
              <FileUpload
                label="Select or drag a new profile picture"
                accept="image/*"
                maxSizeMB={5}
                disabled={isEditing}
                onFileChange={(f) => setProfilePic(f)}
              />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <AppImage url={imageUrl} width="120px" height="120px" />
            </Box>
          )}
        </Box>

        <Box component="div" my={1}>
          <Box component="div" className="flex items-center justify-center gap-x-2 gap-y-4 flex-wrap p-2">
            <TextField
              label="Name"
              name="name"
              value={profile.name}
              disabled={!isEditMode}
              onChange={handleInpOnChange}
              fullWidth
              color="primary"
              helperText={isEditMode && "Only alphabets, digits and a space is allowed."}
              slotProps={{ input: { startAdornment: <Person fontSize="small" sx={{ mr: 0.5 }} /> } }}
            />

            <TextField
              type="email"
              inputMode="email"
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleInpOnChange}
              disabled={!isEditMode}
              fullWidth
              color="primary"
              helperText={isEditMode && "Please enter the email in an email format."}
              slotProps={{ input: { startAdornment: <AlternateEmail fontSize="small" sx={{ mr: 0.5 }} /> } }}
            />

            <TextField
              label="Phone"
              name="phone"
              value={profile.phone}
              disabled
              fullWidth
              helperText={isEditMode && "Due to some technical reasons this field is non-editable."}
              slotProps={{ input: { startAdornment: <Phone fontSize="small" sx={{ mr: 0.5 }} /> } }}
            />

            <TextField
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleInpOnChange}
              disabled={!isEditMode}
              fullWidth
              multiline
              helperText={isEditMode && "Please enter your detailed address here. It can be of atmost 512 characters."}
              slotProps={{ input: { startAdornment: <Home fontSize="small" sx={{ mr: 0.5 }} /> } }}
            />

            <TextField
              label="Available Websites"
              name="websites"
              value={profile.websites}
              onChange={handleInpOnChange}
              disabled={!isEditMode}
              fullWidth
              multiline
              helperText={
                isEditMode &&
                "Please separate your multiple website url with a comma. Your url must start with http or https."
              }
              slotProps={{ input: { startAdornment: <Web fontSize="small" sx={{ mr: 0.5 }} /> } }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="success"
          startIcon={isEditing ? <CircularProgress size={16} color="secondary" /> : <Save fontSize="small" />}
          disabled={!isEditMode || isEditing}
          onClick={handleSaveChangesBtn}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(ProfileModal);
