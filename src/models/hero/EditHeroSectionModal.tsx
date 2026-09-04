import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { IEditHeroSectionDialogProp } from "../../interfaces/component_props.interface";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { Grid } from "@mui/system";
import { IHeroSectionPayload } from "../../interfaces/states.interfaces";
import { BtnClick, InputChange } from "../../interfaces";
import { getGlobalToastConfig } from "../../configs/toasts.config";
import { toast } from "react-toastify";
import CWPSAlert from "../../components/CWPSAlert";
import useAppAlert from "../../hooks/useAppAlert";
import useAppTextfieldValue from "../../hooks/useAppTextfieldValue";
import ModalCloseButton from "../../components/styled/ModalCloseButton";
import ModalHeading from "../../components/headings/ModalHeading";
import useAppHeroModal from "../../hooks/useAppHeroModal";
import useHeroPage from "../../hooks/useHeroPage";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import TagsInput from "../../components/core/TagsInput";

function EditHeroSectionModal({
  open,
  handleDialogCloseBtnClick,
  onAddHandler,
}: Readonly<IEditHeroSectionDialogProp>): ReactNode {
  const theme = useTheme();

  // Local form state — seeded from fresh API fetch each time the modal opens
  const [formData, setFormData] = useState<IHeroSectionPayload | undefined>(undefined);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const { editHeroSection } = useAppHeroModal();
  const { editHeroSectionTextfields } = useAppTextfieldValue();

  // Re-use the existing hook only for fetching — we own the local copy in formData
  const { heroSection, fetchHeroSection } = useHeroPage();

  // Every time the modal opens, fetch fresh data and seed the form
  useEffect(
    function () {
      if (open) {
        fetchHeroSection();
      }
    },
    [open],
  );

  // Once heroSection arrives (or changes), push it into formData
  useEffect(
    function () {
      if (heroSection) {
        setFormData({ ...heroSection });
      }
    },
    [heroSection],
  );

  const editFormInputValues = editHeroSectionTextfields(formData);

  // Generic text-field handler for non-array fields
  const handleTextFieldOnChange = useCallback(
    function (e: InputChange) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...(prev as IHeroSectionPayload), [name]: value }));
    },
    [setFormData],
  );

  // ── TagsInput handlers for specialization ──────────────────────────────────
  const handleAddSpecialization = useCallback(
    function (tag: string) {
      setFormData((prev) => {
        if (!prev) return prev;
        const current = prev.specialization ?? [];
        if (current.includes(tag)) return prev; // avoid duplicates
        return { ...prev, specialization: [...current, tag] };
      });
    },
    [],
  );

  const handleRemoveSpecialization = useCallback(
    function (tag: string) {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          specialization: (prev.specialization ?? []).filter((t) => t !== tag),
        };
      });
    },
    [],
  );

  // ── TagsInput handlers for tags ────────────────────────────────────────────
  const handleAddTag = useCallback(
    function (tag: string) {
      setFormData((prev) => {
        if (!prev) return prev;
        const current = prev.tags ?? [];
        if (current.includes(tag)) return prev; // avoid duplicates
        return { ...prev, tags: [...current, tag] };
      });
    },
    [],
  );

  const handleRemoveTag = useCallback(
    function (tag: string) {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tags: (prev.tags ?? []).filter((t) => t !== tag),
        };
      });
    },
    [],
  );

  // Validate form — show alert and return false on failure
  const validateForm = useCallback(
    function (): boolean {
      if (!formData) {
        setAlert((prev) => ({
          ...prev,
          isOpen: true,
          message: "Received a corrupted payload, please try again!!!",
        }));
        return false;
      }

      if (!formData.displayName?.trim()) {
        setAlert((prev) => ({ ...prev, isOpen: true, message: "Display name is required." }));
        return false;
      }

      if (!formData.designation?.trim()) {
        setAlert((prev) => ({ ...prev, isOpen: true, message: "Designation is required." }));
        return false;
      }

      if (!formData.about?.trim()) {
        setAlert((prev) => ({
          ...prev,
          isOpen: true,
          message: "About / description is required.",
        }));
        return false;
      }

      return true;
    },
    [formData, setAlert],
  );

  // Submit button click → validate first, then open confirmation dialog
  const handleSubmitBtnClick = useCallback(
    function (e: BtnClick) {
      e.preventDefault();
      if (!validateForm()) return;
      setIsConfirmOpen(true);
    },
    [validateForm],
  );

  // Called when user clicks OK inside the ConfirmationDialog
  const handleConfirmOk = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();
      setIsSaving(true);

      try {
        const payload: IHeroSectionPayload = {
          displayName: formData!.displayName.trim(),
          designation: formData!.designation.trim(),
          about: formData!.about.trim(),
          activeGithubContributions: Number(formData!.activeGithubContributions),
          experience: Number(formData!.experience),
          projectsDelivered: Number(formData!.projectsDelivered),
          codingQuestionSolved: Number(formData!.codingQuestionSolved),
          linkedInUrl: formData!.linkedInUrl?.trim() || undefined,
          leetcodeUrl: formData!.leetcodeUrl?.trim() || undefined,
          hackerrankUrl: formData!.hackerrankUrl?.trim() || undefined,
          twitterUrl: formData!.twitterUrl?.trim() || undefined,
          // arrays are natively maintained as string[] by TagsInput — just trim & filter blanks
          specialization: (formData!.specialization ?? []).map((s) => s.trim()).filter(Boolean),
          tags: (formData!.tags ?? []).map((s) => s.trim()).filter(Boolean),
        };

        await editHeroSection(payload);
        await onAddHandler();
        setIsConfirmOpen(false);
        handleDialogCloseBtnClick(e);
      } catch (error: any) {
        const message =
          error?.message ||
          "Something went wrong while processing your request, please try again!!!";
        toast.error(message, getGlobalToastConfig());
        setIsConfirmOpen(false);
      } finally {
        setIsSaving(false);
      }
    },
    [formData, editHeroSection, onAddHandler, handleDialogCloseBtnClick],
  );

  const handleConfirmCancel = useCallback(
    function (e: BtnClick) {
      e.preventDefault();
      setIsConfirmOpen(false);
    },
    [],
  );

  return (
    <>
      <Dialog maxWidth="lg" fullWidth open={open}>
        <Box component="div" className="flex justify-end p-1">
          <ModalCloseButton onClick={handleDialogCloseBtnClick}>
            <Close fontSize="medium" />
          </ModalCloseButton>
        </Box>

        <DialogTitle>
          <ModalHeading Icon={Edit} text="Update Hero Section" />
        </DialogTitle>

        <DialogContent sx={{ borderTop: `1px solid ${theme.palette.secondary.A100}` }}>
          <Box component="div" className="my-2">
            <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} />

            <Grid container rowSpacing={2} columnSpacing={2}>
              {/* ── Standard text / number / url fields ── */}
              {editFormInputValues.map((item) => (
                <Grid key={item.name} size={item.size} {...(item.sx ? { sx: item.sx } : {})}>
                  <TextField
                    label={item.label}
                    name={item.name}
                    value={item.value}
                    type={item.type}
                    required={item.required}
                    onChange={handleTextFieldOnChange}
                    fullWidth={item.fullWidth}
                    autoFocus={item.autoFocus}
                    helperText={item.helperText}
                    multiline={item.multiline}
                    {...(item.multiline && item.rows ? { rows: item.rows } : {})}
                    disabled={isSaving}
                  />
                </Grid>
              ))}

              {/* ── Divider before array fields ── */}
              <Grid size={12}>
                <Divider sx={{ my: 0.5 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Specializations &amp; Tags
                </Typography>
              </Grid>

              {/* ── Specializations — TagsInput ── */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Specializations
                </Typography>
                <TagsInput
                  tags={formData?.specialization ?? []}
                  onAddTag={handleAddSpecialization}
                  onRemoveTag={handleRemoveSpecialization}
                  disabled={isSaving}
                />
              </Grid>

              {/* ── Tags — TagsInput ── */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Tags
                </Typography>
                <TagsInput
                  tags={formData?.tags ?? []}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  disabled={isSaving}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Box component="div" className="flex justify-end items-center">
            <Button
              variant="contained"
              disabled={isSaving}
              color="success"
              startIcon={
                isSaving ? (
                  <CircularProgress size={16} color="secondary" />
                ) : (
                  <Edit fontSize="small" />
                )
              }
              sx={{ color: "white", fontWeight: 700 }}
              onClick={handleSubmitBtnClick}
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog — rendered outside the edit dialog to avoid z-index nesting issues */}
      <ConfirmationDialog
        open={isConfirmOpen}
        isLoading={isSaving}
        heading="Confirm Update"
        Icon={Edit}
        text={
          <Typography variant="body2">
            Are you sure you want to save the changes made to the{" "}
            <strong>Hero Section</strong>? This will update the live portfolio.
          </Typography>
        }
        onSuccess={handleConfirmOk}
        onCancel={handleConfirmCancel}
      />
    </>
  );
}

export default memo(EditHeroSectionModal);
