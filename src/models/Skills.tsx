import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2 as Grid, TextField, Typography } from "@mui/material";
import { DialogProps } from "@toolpad/core";
import { ReactNode, useEffect, useState } from "react";
import { ISkillForm, ISkills } from "../interfaces/models.interface";
import TextFieldLabel from "../components/TextFieldLabel";
import { Add, Close, Edit } from "@mui/icons-material";
import { TbHandFingerRight } from "react-icons/tb";
import { ApiController, ApiStatus } from "../api";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { toast } from "react-toastify";
import { IApiReply } from "../interfaces/api.interface";
import { AppModalStrings } from "../i18n";

export default function SkillModal({ payload, open, onClose }: DialogProps<ISkills>): ReactNode {
  const [skill, setSkill] = useState<ISkillForm>({ name: "", experience: 0, description: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    if (payload.type == 'edit' && payload?.index > -1)
      setSkill(payload.skills[payload.index]);
  }, []);

  async function handleAddBtn(): Promise<void> {
    const controller = new ApiController();
    let addPayload: Record<string, any>;
    let details: IApiReply;

    if (payload.type == 'edit' && payload.index < 0) {
      toast.error("Please select the skill to edit", getGlobalToastConfig());
      return;
    }

    if (payload.type == 'add')
      addPayload = { skillSection: [...payload.skills, skill] };
    else {
      if (payload.index > -1)
        payload.skills[payload.index] = skill;
      addPayload = { skillSection: payload.skills };
    }

    if (skill.description.length < 5) {
      toast.warn(AppModalStrings.SKILL_MODAL.VALIDATION.DESC.MIN, getGlobalToastConfig());
      return;
    }

    if (skill.description.length > 1000) {
      toast.warn(AppModalStrings.SKILL_MODAL.VALIDATION.DESC.MAX, getGlobalToastConfig());
      return;
    }

    const url = skill.url;
    const name = skill.name;

    if (url && url.length > 200) {
      toast.warn(AppModalStrings.SKILL_MODAL.VALIDATION.URL.MAX, getGlobalToastConfig());
      return;
    }

    if (url && url.length < 5) {
      toast.warn(AppModalStrings.SKILL_MODAL.VALIDATION.URL.MIN, getGlobalToastConfig());
      return;
    }

    if (name.length > 32) {
      toast.warn(AppModalStrings.SKILL_MODAL.VALIDATION.NAME.MAX, getGlobalToastConfig());
      return;
    }

    if (name.length < 2) {
      toast.warn(AppModalStrings.SKILL_MODAL.VALIDATION.NAME.MIN, getGlobalToastConfig());
      return;
    }

    if (!url) delete skill.url;

    setIsLoading(prev => !prev);

    const authorization = localStorage.getItem("authorization") as string;
    if (payload.skillId)
      details = await controller.PUT(`portfolio/${payload.skillId}`, `Bearer ${authorization}`, addPayload);
    else
      details = await controller.POST('portfolio/create', `Bearer ${authorization}`, addPayload);

    setIsLoading(prev => !prev);

    if (details.status === ApiStatus.SUCCESS) {
      if (payload.windowRef.current)
        payload.windowRef.current.location.href = `${import.meta.env.VITE_FRONTEND_URL}/skills`;
      onClose();
      return;
    }

    toast.error(details.message, getGlobalToastConfig());
  }

  return (
    <Dialog fullWidth open={open} closeAfterTransition maxWidth='md'>
      <DialogTitle variant="h4" color="primary" className="underline underline-offset-4 decoration-dashed">Skills</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} my={1}>
          <Grid size={12}>
            <Typography variant="subtitle2">Add a new skill to your profile to highlight your strengths and expand your professional toolkit.</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={1} my={2} marginBottom={1}>
          <Grid size={7}>
            <TextField placeholder="Ex:- Node.js" label={<TextFieldLabel text="Name" required />} value={skill.name} onChange={event => setSkill(prev => ({ ...prev, [event.target.id]: event.target.value }))} id="name" variant="outlined" helperText="Enter your skill name above" fullWidth color="warning" spellCheck={false} tabIndex={1} className="outline-none"></TextField>
          </Grid>

          <Grid size={5}>
            <TextField placeholder="Ex:- 1" label={<TextFieldLabel text="Experience" required />} value={skill.experience} type="number" onChange={event => setSkill(prev => ({ ...prev, [event.target.id]: event.target.value }))} id="experience" variant="outlined" helperText="Enter the experience (in years) you've in that skill." fullWidth color="warning" tabIndex={2} className="outline-none"></TextField>
          </Grid>

          <Grid size={12}>
            <TextField placeholder="Node.js" label={<TextFieldLabel text="Description" required />} value={skill.description} type="text" minRows={3} onChange={event => setSkill(prev => ({ ...prev, [event.target.id]: event.target.value }))} id="description" variant="outlined" helperText="Write something about your skill in short" fullWidth color="warning" multiline spellCheck={false} tabIndex={3} className="outline-none"></TextField>
          </Grid>

          <Grid size={12}>
            <TextField placeholder="www.google.com" label={<TextFieldLabel text="Skill photo" />} value={skill.url} type="url" onChange={event => setSkill(prev => ({ ...prev, [event.target.id]: event.target.value }))} id="url" variant="outlined" helperText="Provide a pic of your skill" fullWidth color="warning" spellCheck={false} tabIndex={3} className="outline-none"></TextField>
          </Grid>

        </Grid>

        <Divider />

        <Grid container >
          <Grid size={12} >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TbHandFingerRight className="mx-1 text-neutral-500" size={12} />
              <Typography fontFamily="Roboto" variant="caption" className="text-neutral-400">
                All fields marked with asterik (*) are mandatory to fill.
              </Typography>
            </Box>
          </Grid>

          <Grid size={12} >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TbHandFingerRight className="mx-1 text-neutral-500" size={12} />
              <Typography fontFamily="Roboto" variant="caption" className="text-neutral-400">
                Skill description can be of atmost 1000 characters.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className="bg-neutral-50">
        <Button variant="contained" color="warning" className="mx-1" startIcon={isLoading ? <CircularProgress /> : payload.type == "add" ? <Add /> : <Edit />} tabIndex={5} onClick={handleAddBtn} disabled={isLoading}>{payload.type == "add" ? 'Add' : 'Edit'}</Button>
        <Button onClick={() => onClose()} variant="outlined" color="info" startIcon={<Close />} tabIndex={4}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}