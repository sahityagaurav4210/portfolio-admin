import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, ReactNode, useCallback, useState } from "react";
import Heading from "../../components/Heading";
import { Add, Cancel, Link, Send } from "@mui/icons-material";
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

function AddSkillModal({ open, handleDialogCloseBtnClick, onAddHandler }: Readonly<IGlobalDialogProp>): ReactNode {
  const theme = useTheme();
  const [skillFormData, setSkillFormData] = useState<ISkillForm>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const formats = ["header", "bold", "italic", "underline", "link", "image", "list", "bullet"];
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };
  const { editSkillModalTextfields } = useAppTextfieldValue();
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
        const { description, name, url } = skillFormData as ISkillForm;

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

        if (url && !AppPatterns.skillUrl.test(url)) {
          const message = "Invalid skill url, it should begin with http:// or https://";
          setAlert((prev) => ({ ...prev, isOpen: true, message }));
          return;
        }

        if (!AppPatterns.skillDesc.test(description)) {
          const message = "Invalid skill description, it should be minimum 10 characters long.";
          setAlert((prev) => ({ ...prev, isOpen: true, message }));
          return;
        }

        const controller = new SkillController();
        const reply = await controller.makePostSkillReq(skillFormData);

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
    [skillFormData],
  );

  return (
    <Dialog maxWidth="lg" fullWidth open={open}>
      <DialogTitle>
        <Box component="div" className="flex justify-end">
          <IconButton onClick={handleDialogCloseBtnClick}>
            <Cancel fontSize="medium" color="error" />
          </IconButton>
        </Box>
        <Heading Icon={Add} text="Add your skill" />
      </DialogTitle>

      <DialogContent sx={{ borderTop: `1px solid ${theme.palette.secondary.A100}` }}>
        <Box component="div" className="my-2">
          <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} maxWidth="md" />

          <Grid container rowSpacing={2} columnSpacing={2}>
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

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                startIcon={<Link fontSize="small" />}
                color="warning"
                LinkComponent="a"
                href={import.meta.env.VITE_FTP_URL}
                target="_blank"
              >
                FTP PORTAL
              </Button>
            </Grid>

            <Grid size={12}>
              <ReactQuill
                value={skillFormData?.description}
                onChange={(value) => setSkillFormData((prev) => ({ ...(prev as ISkillForm), description: value }))}
                placeholder="Ex:- description"
                formats={formats}
                modules={modules}
                style={{ minHeight: "50px" }}
              />
            </Grid>

            <Grid size={2} offset={10} display="flex" justifyContent="flex-end">
              <Typography variant="caption" fontWeight={700} color="warning">
                {1000 - Number(skillFormData?.description?.length || 0)} characters left
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box component="div" className="flex justify-end items-center">
          <Button
            variant="contained"
            disabled={isSaving || 1000 - Number(skillFormData?.description?.length || 0) < 0}
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
