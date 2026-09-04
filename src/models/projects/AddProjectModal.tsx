import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { memo, ReactNode, useCallback, useState } from "react";
import { Add, Close, Send } from "@mui/icons-material";
import { IGlobalDialogProp } from "../../interfaces/component_props.interface";
import { IProjects, ProjectDomain } from "../../interfaces/models.interface";
import { BtnClick, InputChange } from "../../interfaces";
import { Grid } from "@mui/system";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../../configs/toasts.config";
import { PROJECT_PRIORITY_OPTIONS } from "../../constants";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import CWPSAlert from "../../components/CWPSAlert";
import useAppAlert from "../../hooks/useAppAlert";
import FileUpload from "../../components/FileUpload";
import ModalCloseButton from "../../components/styled/ModalCloseButton";
import ModalHeading from "../../components/headings/ModalHeading";
import useAppHelperFn from "../../hooks/useAppHelperFn";
import useAppProjectModal from "../../hooks/useAppProjectModal";
import useAppEditorConfiguration from "../../hooks/useAppEditorConfiguration";
import TagsInput from "../../components/core/TagsInput";

const INITIAL_PROJECT_STATE: Partial<IProjects> = {
  name: "",
  type: "personal",
  projectDomain: ProjectDomain.OTHERS,
  priority: 0,
  text: "",
  tech_stack: [],
  codeLink: "",
  liveLink: "",
  documentation_link: "",
  note: "",
  disabled: false,
  ongoing: false,
  showDivider: true,
};

function AddProjectModal({ open, handleDialogCloseBtnClick, onAddHandler }: Readonly<IGlobalDialogProp>): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [projectData, setProjectData] = useState<Partial<IProjects>>(INITIAL_PROJECT_STATE);
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true);

  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const { addProject } = useAppProjectModal();
  const { formats, modules } = useAppEditorConfiguration();
  const { getDescriptionCount } = useAppHelperFn();

  const handleTextFieldOnChange = useCallback(
    function (e: InputChange) {
      const { name, value } = e.target;
      setProjectData((prev) => ({ ...(prev as Partial<IProjects>), [name]: value }));
    },
    [setProjectData],
  );

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const nextType = event.target.value;
    setProjectData((prev) => ({ ...prev, type: nextType }));
  };

  const handleSwitchChange = (name: keyof IProjects) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setProjectData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTechTag = useCallback(function (tag: string) {
    setProjectData((prev) => {
      const current = prev?.tech_stack ?? [];
      if (current.includes(tag)) return prev;
      return { ...prev, tech_stack: [...current, tag] };
    });
  }, []);

  const handleRemoveTechTag = useCallback(function (tag: string) {
    setProjectData((prev) => ({
      ...prev,
      tech_stack: (prev?.tech_stack ?? []).filter((t) => t !== tag),
    }));
  }, []);

  const handleAddBtnClick = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();
      setIsSaving(true);

      try {
        if (!projectData?.name?.trim()) {
          setAlert((prev) => ({ ...prev, isOpen: true, message: "Please enter a valid project name." }));
          return;
        }

        if (!projectData?.type) {
          setAlert((prev) => ({
            ...prev,
            isOpen: true,
            message: "Please select a project type (personal or professional).",
          }));
          return;
        }

        const descriptionLen = getDescriptionCount(projectData.text || "");
        if (descriptionLen < 10) {
          setAlert((prev) => ({
            ...prev,
            isOpen: true,
            message: "Project description / details must be at least 10 characters long.",
          }));
          return;
        }

        const payload: Partial<IProjects> = {
          name: projectData.name.trim(),
          type: projectData.type,
          projectDomain: projectData.projectDomain ?? ProjectDomain.OTHERS,
          priority: Number.isInteger(Number(projectData.priority)) ? Number(projectData.priority) : 0,
          text: projectData.text,
          tech_stack: projectData.tech_stack ?? [],
          codeLink: projectData.codeLink?.trim() || "",
          liveLink: projectData.liveLink?.trim() || "",
          documentation_link: projectData.documentation_link?.trim() || "",
          note: projectData.note?.trim() || undefined,
          disabled: Boolean(projectData.disabled),
          ongoing: Boolean(projectData.ongoing),
          showDivider: Boolean(projectData.showDivider),
        };

        await addProject(payload, cardImageFile);
        toast.success("Project created successfully!", getGlobalToastConfig());
        await onAddHandler();
        handleDialogCloseBtnClick(e);
      } catch (error: any) {
        const message = error?.message || "Something went wrong while processing your request, please try again!";
        toast.error(message, getGlobalToastConfig());
      } finally {
        setIsSaving(false);
      }
    },
    [projectData, cardImageFile, addProject, onAddHandler, handleDialogCloseBtnClick, setAlert, getDescriptionCount],
  );

  return (
    <Dialog maxWidth="lg" fullWidth open={open}>
      <Box component="div" className="flex justify-end p-1">
        <ModalCloseButton onClick={handleDialogCloseBtnClick}>
          <Close fontSize="medium" />
        </ModalCloseButton>
      </Box>

      <DialogTitle>
        <ModalHeading Icon={Add} text="Add Project" />
      </DialogTitle>

      <DialogContent sx={{ borderTop: `1px solid ${theme.palette.secondary.A100}` }}>
        <Box component="div" className="my-2">
          <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} maxWidth="md" />

          <Grid container rowSpacing={2} columnSpacing={2}>
            {/* ── Card Image File Upload ── */}
            <Grid size={12}>
              <FileUpload
                onFileChange={setCardImageFile}
                accept="image/*"
                maxSizeMB={5}
                disabled={isSaving}
                label="Upload project card image (drag & drop or click to browse)"
                onReadyChange={(ready) => setIsReady(ready)}
              />
            </Grid>

            {/* ── Project Name ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Project Name"
                name="name"
                value={projectData.name ?? ""}
                required
                fullWidth
                autoFocus
                onChange={handleTextFieldOnChange}
                helperText="Enter the official name of the project."
                disabled={isSaving}
              />
            </Grid>

            {/* ── Project Type Dropdown ── */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth required>
                <InputLabel id="project-type-select-label">Project Type</InputLabel>
                <Select
                  labelId="project-type-select-label"
                  id="project-type-select"
                  value={projectData.type ?? "personal"}
                  label="Project Type"
                  onChange={handleTypeChange}
                  disabled={isSaving}
                >
                  <MenuItem value="personal">Personal Project</MenuItem>
                  <MenuItem value="professional">Professional Project</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* ── Project Domain Dropdown ── */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth required>
                <InputLabel id="project-domain-select-label">Project Domain</InputLabel>
                <Select
                  labelId="project-domain-select-label"
                  id="project-domain-select"
                  value={projectData.projectDomain ?? ProjectDomain.OTHERS}
                  label="Project Domain"
                  onChange={(e) =>
                    setProjectData((prev) => ({ ...prev, projectDomain: e.target.value as ProjectDomain }))
                  }
                  disabled={isSaving}
                >
                  <MenuItem value={ProjectDomain.TELECOMMUNICATION}>Telecommunication</MenuItem>
                  <MenuItem value={ProjectDomain.GOVT}>Government</MenuItem>
                  <MenuItem value={ProjectDomain.CORPORATE}>Corporate</MenuItem>
                  <MenuItem value={ProjectDomain.FINTECH}>Fintech</MenuItem>
                  <MenuItem value={ProjectDomain.EDTECH}>Edtech</MenuItem>
                  <MenuItem value={ProjectDomain.OTHERS}>Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* ── Priority (Autocomplete) ── */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Autocomplete
                id="project-priority-add"
                options={PROJECT_PRIORITY_OPTIONS}
                getOptionLabel={(option) => option.label}
                value={
                  PROJECT_PRIORITY_OPTIONS.find((opt) => opt.value === (projectData.priority ?? 0)) ??
                  PROJECT_PRIORITY_OPTIONS[0]
                }
                onChange={(_, newValue) => {
                  setProjectData((prev) => ({
                    ...prev,
                    priority: newValue ? newValue.value : 0,
                  }));
                }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={isSaving}
                renderInput={(params) => (
                  <TextField {...params} label="Priority" required fullWidth helperText="Select priority level." />
                )}
              />
            </Grid>

            {/* ── Live URL ── */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Live Demo Link"
                name="liveLink"
                type="url"
                value={projectData.liveLink ?? ""}
                fullWidth
                onChange={handleTextFieldOnChange}
                helperText="https://example.com"
                disabled={isSaving}
              />
            </Grid>

            {/* ── Code / GitHub URL ── */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Source Code Link"
                name="codeLink"
                type="url"
                value={projectData.codeLink ?? ""}
                fullWidth
                onChange={handleTextFieldOnChange}
                helperText="https://github.com/org/repo"
                disabled={isSaving}
              />
            </Grid>

            {/* ── Documentation URL ── */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Documentation Link"
                name="documentation_link"
                type="url"
                value={projectData.documentation_link ?? ""}
                fullWidth
                onChange={handleTextFieldOnChange}
                helperText="https://docs.example.com"
                disabled={isSaving}
              />
            </Grid>

            {/* ── Special Note ── */}
            <Grid size={12}>
              <TextField
                label="Note / Remarks"
                name="note"
                value={projectData.note ?? ""}
                fullWidth
                onChange={handleTextFieldOnChange}
                helperText="Optional highlights or special notes about the project."
                disabled={isSaving}
                multiline
              />
            </Grid>

            {/* ── Tech Stack ── */}
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                Tech Stack
              </Typography>
              <TagsInput
                tags={projectData.tech_stack ?? []}
                onAddTag={handleAddTechTag}
                onRemoveTag={handleRemoveTechTag}
                disabled={isSaving}
              />
            </Grid>

            {/* ── Switches / Toggles ── */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(projectData.ongoing)}
                    onChange={handleSwitchChange("ongoing")}
                    color="warning"
                    disabled={isSaving}
                  />
                }
                label="Ongoing Project"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(projectData.disabled)}
                    onChange={handleSwitchChange("disabled")}
                    color="error"
                    disabled={isSaving}
                  />
                }
                label="Disabled / Hidden"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(projectData.showDivider)}
                    onChange={handleSwitchChange("showDivider")}
                    color="primary"
                    disabled={isSaving}
                  />
                }
                label="Show Divider"
              />
            </Grid>

            {/* ── Rich Text Description (text) ── */}
            <Grid size={12}>
              <Box sx={{ position: "relative", mt: 1 }}>
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
                  Project Details / Overview *
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
                      minHeight: "120px",
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
                    value={projectData.text ?? ""}
                    onChange={(value) => setProjectData((prev) => ({ ...(prev as Partial<IProjects>), text: value }))}
                    placeholder="Provide detailed description of this project..."
                    formats={formats}
                    modules={modules}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={isMobile ? 6 : 2} offset={isMobile ? 6 : 10} display="flex" justifyContent="flex-end">
              <Typography variant="caption" fontWeight={700} color="warning">
                {2000 - getDescriptionCount(projectData.text || "")} characters left
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box component="div" className="flex justify-end items-center">
          <Button
            variant="contained"
            disabled={isSaving || !isReady || 2000 - getDescriptionCount(projectData.text || "") < 0}
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

export default memo(AddProjectModal);
