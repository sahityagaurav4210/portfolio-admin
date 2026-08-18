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
import { AccountBox, AlternateEmail, Close, Home, Person, Save, Web } from "@mui/icons-material";
import { IProfilePayload } from "../interfaces/states.interfaces";
import { BtnClick, InputChange } from "../interfaces";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import ModalCloseButton from "../components/styled/ModalCloseButton";
import ModalHeading from "../components/headings/ModalHeading";
import FileUpload from "../components/FileUpload";
import AppImage from "../components/AppImage";
import useAppHelperFn from "../hooks/useAppHelperFn";
import useAppProfileModal from "../hooks/useAppProfileModal";
import { AppCommonStrings, AppModalStrings } from "../i18n";

function ProfileModal({ open, handleDialogCloseBtnClick, details }: Readonly<IViewDialogProp>): ReactNode {
  const theme = useTheme();
  const { getResourceUrl } = useAppHelperFn();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfilePayload>({
    name: details?.name || "",
    phone: details?.phone || "",
    email: details?.email || "",
    address: details?.address || "",
    websites: details?.websites || "",
    avatar: details?.avatar || "",
  });
  const imageUrl = getResourceUrl(profile?.avatar || details?.avatar);
  const { editProfile, fetchProfile } = useAppProfileModal();

  const alertMsg = useMemo(
    () =>
      isEditMode
        ? AppModalStrings.PROFILE_MODAL.ALERT_MSG.EDIT_MODE
        : AppModalStrings.PROFILE_MODAL.ALERT_MSG.READ_ONLY_MODE,
    [isEditMode],
  );

  const handleEditModeToggleBtn = useCallback(
    function () {
      setIsEditMode((prev) => !prev);
    },
    [isEditMode],
  );

  const handleInpOnChange = useCallback(
    function (event: InputChange) {
      const { name, value } = event.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
    },
    [profile],
  );

  const handleSaveChangesBtn = useCallback(
    async function (event: BtnClick) {
      event.preventDefault();
      setIsEditing(true);
      const { avatar, _id, phone, ...payload } = profile;

      try {
        await editProfile(payload, profilePic);
        const updatedProfile = await fetchProfile();

        setProfile(updatedProfile.data);
        toast.success(AppModalStrings.PROFILE_MODAL.PROFILE_UPDATED, getGlobalToastConfig());
      } catch (error: any) {
        const message = error?.message || AppCommonStrings.ERROR;
        toast.error(message, getGlobalToastConfig());
      } finally {
        setIsEditMode(false);
        setIsEditing(false);
      }
    },
    [profile, profilePic],
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
              helperText={isEditMode && AppModalStrings.PROFILE_MODAL.FORM_VALIDATION.NAME}
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
              helperText={isEditMode && AppModalStrings.PROFILE_MODAL.FORM_VALIDATION.EMAIL}
              slotProps={{ input: { startAdornment: <AlternateEmail fontSize="small" sx={{ mr: 0.5 }} /> } }}
            />

            <TextField
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleInpOnChange}
              disabled={!isEditMode}
              fullWidth
              multiline
              helperText={isEditMode && AppModalStrings.PROFILE_MODAL.FORM_VALIDATION.ADDRESS}
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
              helperText={isEditMode && AppModalStrings.PROFILE_MODAL.FORM_VALIDATION.WEBSITES}
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
          {AppModalStrings.PROFILE_MODAL.SUBMIT_BTN_TXT}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(ProfileModal);
