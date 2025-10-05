import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { memo, ReactNode, useCallback, useState } from 'react';
import Heading from '../../components/Heading';
import { Add, Close, Link, Send } from '@mui/icons-material';
import { IGlobalDialogProp } from '../../interfaces/component_props.interface';
import { IAlert, ISkillForm } from '../../interfaces/models.interface';
import { BtnClick, InputChange } from '../../interfaces';
import { Grid } from '@mui/system';
import { toast } from 'react-toastify';
import { getGlobalToastConfig } from '../../configs/toasts.config';
import { ApiController, ApiStatus } from '../../api';
import { AppPatterns } from '../../constants';

function AddSkillModal({ open, handleDialogCloseBtnClick, onAddHandler }: IGlobalDialogProp): ReactNode {
  const [skillFormData, setSkillFormData] = useState<ISkillForm>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>();

  const handleTextFieldOnChange = useCallback(function (e: InputChange) {
    setSkillFormData((prev) => ({ ...(prev as ISkillForm), [e.target.name]: e.target.value }));
  }, [setSkillFormData]);

  const handleAlertOnClose = useCallback(function () {
    setAlert(prev => ({ ...(prev as IAlert), isOpen: false, message: "" }));
  }, []);

  const handleAddBtnClick = useCallback(async function (e: BtnClick) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { description, name, url } = skillFormData as ISkillForm;

      if (!AppPatterns.skillName.test(name)) {
        const message = "Invalid skill name";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      if (url && !AppPatterns.skillUrl.test(url)) {
        const message = "Invalid skill url, it should begin with http:// or https://";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      if (!AppPatterns.skillDesc.test(description)) {
        const message = "Invalid skill description, it should be minimum 10 characters long.";
        setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
        return;
      }

      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization") as string;
      const reply = await controller.POST("portfolio/skills/add", `Bearer ${authorization}`, skillFormData);

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

  return (
    <Dialog maxWidth="md" fullWidth open={open}>
      <DialogTitle>
        <Box component="div" className='flex justify-end'>
          <IconButton onClick={handleDialogCloseBtnClick}>
            <Close fontSize='small' color='error' />
          </IconButton>
        </Box>
        <Heading Icon={Add} text='Add' />
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
          <Grid size={6} sx={{ py: 1 }}>
            <TextField label="Name" name='name' value={skillFormData?.name} required onChange={handleTextFieldOnChange} fullWidth autoFocus />
          </Grid>

          <Grid size={6} sx={{ py: 1 }}>
            <TextField label="Experience" type='number' name='experience' className='uppercase' required value={skillFormData?.experience} onChange={handleTextFieldOnChange} fullWidth />
          </Grid>

          <Grid size={6} sx={{ py: 1 }}>
            <TextField label="Url" type='url' name='url' fullWidth className='uppercase' value={skillFormData?.url} onChange={handleTextFieldOnChange} />
          </Grid>

          <Grid size={6} sx={{ py: 1, display: "flex", alignItems: "center" }}>
            <Button variant='contained' startIcon={<Link fontSize='small' />} color='warning' LinkComponent="a" href={import.meta.env.VITE_FTP_URL} target='_blank'>FTP PORTAL</Button>
          </Grid>

          <Grid size={12} sx={{ py: 1 }}>
            <TextField label="Description" type='text' name='description' value={skillFormData?.description} multiline onChange={handleTextFieldOnChange} fullWidth required placeholder='Ex:- Description' sx={{ textAlign: "justify" }} helperText="Only characters, digits, comma, parenthesis, periods are allowed." />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box component="div" className='flex justify-end items-center'>
          <Button variant='contained' disabled={isSaving} color='success' startIcon={!isSaving ? <Send fontSize='small' /> : <CircularProgress size={16} color='secondary' />} sx={{ color: "white", fontWeight: 700 }} onClick={handleAddBtnClick}>Submit</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default memo(AddSkillModal);