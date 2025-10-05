import { memo, ReactNode, useCallback, useState } from 'react';
import { IEditSkillDialogProp } from '../../interfaces/component_props.interface';
import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { Close, Edit, Link, ListAlt } from '@mui/icons-material';
import Heading from '../../components/Heading';
import { Grid } from '@mui/system';
import { IAlert, ISkillForm } from '../../interfaces/models.interface';
import { BtnClick, InputChange } from '../../interfaces';
import { ApiController, ApiStatus } from '../../api';
import { getGlobalToastConfig } from '../../configs/toasts.config';
import { toast } from 'react-toastify';
import { AppPatterns } from '../../constants';

function EditSkillModal({ open, handleDialogCloseBtnClick, details, onAddHandler }: IEditSkillDialogProp): ReactNode {
  const [skillFormData, setSkillFormData] = useState<ISkillForm | undefined>(details);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>();

  const handleTextFieldOnChange = useCallback(function (e: InputChange) {
    const { name, value } = e.target;
    setSkillFormData((prev) => ({ ...(prev as ISkillForm), [name]: value }));
  }, [setSkillFormData]);

  const handleEditBtnClick = useCallback(async function (e: BtnClick) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization") as string;
      const { _id, id, ...payload } = skillFormData || {};
      const { name, url, experience, description } = payload as Record<string, any>;

      if (!AppPatterns.skillName.test(name)) {
        const message = "Invalid skill name";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      if (!AppPatterns.skillUrl.test(url)) {
        const message = "Invalid skill url, it should begin with http:// or https://";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      if (!AppPatterns.skillExp.test(experience)) {
        const message = "Invalid experience, it should be a positive natural number.";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      if (!AppPatterns.skillDesc.test(description)) {
        const message = "Invalid skill description, it should be minimum 10 characters long.";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      const reply = await controller.PUT(`portfolio/skills/update/${_id}`, `Bearer ${authorization}`, payload);

      if (reply.status === ApiStatus.SUCCESS) {
        await onAddHandler();
        handleDialogCloseBtnClick(e);
      }
      else throw new Error(reply.message);
    } catch (error: any) {
      const message = error?.message || "Something went wrong while processing your request, please try again!!!";
      toast.error(message, getGlobalToastConfig());
    }
    finally {
      setIsSaving(false);
    }
  }, [skillFormData]);

  const handleAlertOnClose = useCallback(function () {
    setAlert(prev => ({ ...(prev as IAlert), isOpen: false, message: "" }));
  }, []);

  return (
    <Dialog maxWidth="md" fullWidth open={open}>
      <DialogTitle>
        <Box component="div" className='flex justify-end'>
          <IconButton onClick={handleDialogCloseBtnClick}>
            <Close fontSize='small' color='error' />
          </IconButton>
        </Box>

        <Heading Icon={ListAlt} text='Details' />
      </DialogTitle>

      <DialogContent>
        {
          alert?.isOpen &&
          <Container maxWidth="xs" sx={{ my: 2 }}>
            <Alert variant='filled' severity='warning' onClose={handleAlertOnClose} className='flex items-center' icon={false}>
              <Box component="div" className='flex items-center gap-2'>
                <Typography variant='caption' fontWeight={700} className='bg-orange-700 p-1 rounded-sm'>WARNING</Typography>
                <Typography variant='subtitle2' textAlign="justify">{alert.message}</Typography>
              </Box>
            </Alert>
          </Container>
        }

        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 1 }}>
            <TextField label="Name" name='name' value={skillFormData?.name} required onChange={handleTextFieldOnChange} fullWidth autoFocus helperText="Only characters, digits and some special characters are allowed" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: 0, md: 1 } }}>
            <TextField label="Experience (in months)" type='number' name='experience' required value={skillFormData?.experience} onChange={handleTextFieldOnChange} fullWidth helperText="Only positive natural numbers are allowed. Please enter the amount in months." />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField label="Url" type='url' name='url' fullWidth value={skillFormData?.url} onChange={handleTextFieldOnChange} helperText="Only string in url format is allowed. It should start with http or https" />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ py: 1, display: "flex", alignItems: "center" }}>
            <Button variant='contained' startIcon={<Link fontSize='small' />} color='warning' LinkComponent="a" href={import.meta.env.VITE_FTP_URL} target='_blank'>FTP PORTAL</Button>
          </Grid>

          <Grid size={12}>
            <TextField label="Description" type='text' name='description' value={skillFormData?.description} multiline onChange={handleTextFieldOnChange} fullWidth required placeholder='Ex:- Description' sx={{ textAlign: "justify" }} helperText="Only characters, digits, comma, parenthesis, periods are allowed." />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box component="div" className='flex justify-end items-center'>
          <Button variant='contained' disabled={isSaving} color='warning' startIcon={!isSaving ? <Edit fontSize='small' /> : <CircularProgress size={16} color='secondary' />} sx={{ color: "white", fontWeight: 700 }} onClick={handleEditBtnClick}>Edit</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default memo(EditSkillModal);