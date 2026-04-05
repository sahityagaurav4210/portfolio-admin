import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { memo, ReactNode, useCallback, useState } from "react";
import { Add, Close, Send } from "@mui/icons-material";
import { IGlobalDialogProp } from "../../interfaces/component_props.interface";
import { ISkillForm } from "../../interfaces/models.interface";
import { BtnClick, InputChange } from "../../interfaces";
import { Grid } from "@mui/system";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../../configs/toasts.config";
import { ApiStatus } from "../../api";
import { AppPatterns } from "../../constants";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SkillController from "../../controllers/skills.controller";
import CWPSAlert from "../../components/CWPSAlert";
import useAppAlert from "../../hooks/useAppAlert";
import useAppTextfieldValue from "../../hooks/useAppTextfieldValue";
import FileUpload from "../../components/FileUpload";
import ModalCloseButton from "../../components/styled/ModalCloseButton";
import ModalHeading from "../../components/headings/ModalHeading";
import useAppHelperFn from "../../hooks/useAppHelperFn";

function AddSkillModal({ open, handleDialogCloseBtnClick, onAddHandler }: Readonly<IGlobalDialogProp>): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [skillFormData, setSkillFormData] = useState<ISkillForm>();
  const [skillFile, setSkillFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true);
  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const formats = ["header", "bold", "italic", "underline", "link", "image", "list", "bullet", "align", "color", "background"];
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };
  const { editSkillModalTextfields } = useAppTextfieldValue();
  const { getDescriptionCount } = useAppHelperFn();
  const addFormInputValues = editSkillModalTextfields(skillFormData);

  const handleTextFieldOnChange = useCallback(
    function (e: InputChange) {
      setSkillFormData((prev) => ({ ...(prev as ISkillForm), [e.target.name]: e.target.value }));
    },
    [setSkillFormData],
  );

  const handleAddBtnClick = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();
      setIsSaving(true);

      try {
        const { description, name } = skillFormData as ISkillForm;

        if (!skillFormData) {
          const message = "Please fill-up the form completely and correctly.";
          setAlert((prev) => ({ ...prev, isOpen: true, message }));
          return;
        }

        if (!AppPatterns.skillName.test(name)) {
          const message = "Invalid skill name";
          setAlert((prev) => ({ ...prev, isOpen: true, message }));
          return;
        }

        if (!AppPatterns.skillDesc.test(description)) {
          const message = "Invalid skill description, it should be minimum 10 characters long.";
          setAlert((prev) => ({ ...prev, isOpen: true, message }));
          return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("experience", String(skillFormData.experience));
        formData.append("description", description);
        if (skillFile) formData.append("skill", skillFile);

        const controller = new SkillController();
        const reply = await controller.makePostSkillReq(formData);

        if (reply.status === ApiStatus.SUCCESS) {
          await onAddHandler();
          handleDialogCloseBtnClick(e);
        } else throw new Error(reply.message);
      } catch (error: any) {
        const message = error?.message || "Something went wrong while processing your request, please try again!!!";
        toast.error(message, getGlobalToastConfig());
      } finally {
        setIsSaving(false);
      }
    },
    [skillFormData, skillFile],
  );

  return (
    <Dialog maxWidth="lg" fullWidth open={open}>
      <Box component="div" className="flex justify-end p-1">
        <ModalCloseButton onClick={handleDialogCloseBtnClick}>
          <Close fontSize="medium" />
        </ModalCloseButton>
      </Box>

      <DialogTitle>
        <ModalHeading Icon={Add} text="Add skill" />
      </DialogTitle>

      <DialogContent sx={{ borderTop: `1px solid ${theme.palette.secondary.A100}` }}>
        <Box component="div" className="my-2">
          <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} maxWidth="md" />

          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid size={12}>
              <FileUpload
                onFileChange={setSkillFile}
                accept="image/*"
                maxSizeMB={5}
                disabled={isSaving}
                label="Upload skill icon (drag & drop or click to browse)"
                onReadyChange={ready => setIsReady(ready)}
              />
            </Grid>

            {addFormInputValues.map((item) => (
              <Grid size={item.size} {...(item.sx ? { sx: item.sx } : {})}>
                <TextField
                  label={item.label}
                  name={item.name}
                  value={item.value}
                  required={item.required}
                  onChange={handleTextFieldOnChange}
                  fullWidth={item.fullWidth}
                  autoFocus={item.autoFocus}
                  helperText={item.helperText}
                />
              </Grid>
            ))}

            <Grid size={12}>
              <Box sx={{ position: "relative", mt: 1 }}>
                {/* Floating label — mimics MUI outlined TextField */}
                <Typography
                  component="label"
                  variant="caption"
                  sx={{
                    position: "absolute",
                    top: -9,
                    left: 10,
                    px: 0.5,
                    bgcolor: "background.paper",
                    color: "text.secondary",
                    zIndex: 1,
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  Description
                </Typography>

                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.23)",
                    borderRadius: 1,
                    transition: "border-color 0.2s, border-width 0.1s",
                    "&:hover": { borderColor: "text.primary" },
                    "&:focus-within": { borderColor: "primary.main", borderWidth: "2px" },
                    "& .ql-toolbar": {
                      border: "none",
                      borderBottom: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "4px 4px 0 0",
                      fontFamily: "inherit",
                    },
                    "& .ql-container": {
                      border: "none",
                      borderRadius: "0 0 4px 4px",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                    },
                    "& .ql-editor": {
                      minHeight: "100px",
                      px: 1.75,
                      py: 1.25,
                    },
                    "& .ql-editor.ql-blank::before": {
                      fontStyle: "normal",
                      color: "rgba(0,0,0,0.42)",
                    },
                  }}
                >
                  <ReactQuill
                    value={skillFormData?.description}
                    onChange={(value) => setSkillFormData((prev) => ({ ...(prev as ISkillForm), description: value }))}
                    placeholder="Ex:- description"
                    formats={formats}
                    modules={modules}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={isMobile ? 6 : 2} offset={isMobile ? 6 : 10} display="flex" justifyContent="flex-end">
              <Typography variant="caption" fontWeight={700} color="warning">
                {1000 - getDescriptionCount(skillFormData?.description || "")} characters left
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box component="div" className="flex justify-end items-center">
          <Button
            variant="contained"
            disabled={isSaving || !isReady || 1000 - getDescriptionCount(skillFormData?.description || "") < 0}
            color="success"
            startIcon={isSaving ? <CircularProgress size={16} color="secondary" /> : <Send fontSize="small" />}
            sx={{ color: "white", fontWeight: 700 }}
            onClick={handleAddBtnClick}
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default memo(AddSkillModal);
