import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fab, IconButton, TextField } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import Heading from '../components/Heading';
import PasswordIcon from '@mui/icons-material/Password';
import { Grid } from '@mui/system';
import { IChangePwdProp } from '../interfaces/component_props.interface';
import { Close, Edit, Visibility } from '@mui/icons-material';
import useAppCss from '../hooks/useAppCss';
import Notes from '../components/Notes';
import { IChangePwd } from '../interfaces/models.interface';
import { BtnClick, InputChange } from '../interfaces';
import useAppAlert from '../hooks/useAppAlert';
import CWPSAlert from '../components/CWPSAlert';
import { IAlert } from '../interfaces/hooks.interface';
import { ApiController, ApiStatus } from '../api';
import { useNavigate } from 'react-router-dom';

function ChangePwdModal({ open, callback }: IChangePwdProp): React.ReactNode {
  const [changePwdForm, setChangePwdForm] = useState<IChangePwd>();
  const { RequiredFieldCss, AlignItemsCss, FlexCss, JustifyItemsEndCss } = useAppCss();
  const notes = useMemo(() => ["All fields marked with asterisk are mandatory to fill.", "Password must be atleast 8 characters long.", "Password must contain atleast one captial, one small, one digit and one special character.", "Only @,$,! and % special characters are allowed."], []);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const [isVisible, setIsVisible] = useState(false);

  const handleInputOnChange = useCallback(function (e: InputChange) {
    const { name, value } = e.target;
    setChangePwdForm(prev => ({ ...(prev as IChangePwd), [name]: value }));
  }, [changePwdForm]);

  const handleChangePwdButton = useCallback(async function (e: BtnClick) {
    e.preventDefault();
    setIsEditing(true);

    if (!changePwdForm) {
      setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message: "Please fill-up the form completely and correctly!!!" }));
      setIsEditing(false);
      return;
    }

    const { newPwd, cnfNewPwd, oldPwd } = changePwdForm as IChangePwd;

    if (newPwd !== cnfNewPwd) {
      setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message: "Your password do not match, please correct it!!!" }));
      setIsEditing(false);
      return;
    }

    try {
      const controller = new ApiController();
      const authorization = localStorage.getItem("authorization");
      const token = localStorage.getItem("token") as string;

      const payload = { newPwd, oldPwd };
      const response = await controller.PUT("user/change-pwd", `Bearer ${authorization}`, payload);

      if (response.status !== ApiStatus.SUCCESS) throw new Error("Something went wrong while processing your request, please try again!!!");

      await controller.logout("authentication/logout", { token, authorization: `Bearer ${authorization}` });
      callback();
      localStorage.clear();
      navigate("/auth/login");
    } catch (error: any) {
      const message = error?.message || "Something went wrong while processing your request, please try again!!!";

      setAlert(prev => ({ ...(prev as IAlert), isOpen: true, message }));
    }
    finally {
      setIsEditing(false);
    }
  }, [changePwdForm]);

  function handlePwdClick(event: BtnClick) {
    event.preventDefault();
    setIsVisible(prev => !prev);
  }

  return (
    <Dialog maxWidth="md" fullWidth open={open}>
      <DialogTitle>
        <Box component="div" className='flex justify-end'>
          <IconButton onClick={callback}>
            <Close fontSize='small' color='error' />
          </IconButton>
        </Box>
        <Heading Icon={PasswordIcon} text='Change Password' />
      </DialogTitle>

      <DialogContent>
        <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} />

        <Grid container rowSpacing={2}>
          <Grid size={12} mt={2}>
            <TextField
              label="Current Password"
              type={!isVisible ? 'password' : "text"}
              inputMode='text'
              autoFocus
              required
              fullWidth
              sx={RequiredFieldCss}
              helperText="Please enter your current password, i.e., the one which you've used during the sign-in process."
              name='oldPwd'
              value={changePwdForm?.oldPwd}
              onChange={handleInputOnChange}
              slotProps={{ input: { endAdornment: <Fab color="warning" variant="extended" size="small" onClick={handlePwdClick}><Visibility fontSize="small" /></Fab> } }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="New Password"
              required
              fullWidth
              sx={RequiredFieldCss}
              helperText="Please enter your new password. It should match the criteria given below."
              name='newPwd'
              value={changePwdForm?.newPwd}
              onChange={handleInputOnChange}
              type={!isVisible ? 'password' : "text"}
              inputMode='text'
              slotProps={{ input: { endAdornment: <Fab color="warning" variant="extended" size="small" onClick={handlePwdClick}><Visibility fontSize="small" /></Fab> } }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Confirm Password"
              required
              fullWidth
              sx={RequiredFieldCss}
              helperText="Please re-enter your new password. It should match with your new password."
              name='cnfNewPwd'
              value={changePwdForm?.cnfNewPwd}
              onChange={handleInputOnChange}
              type={!isVisible ? 'password' : "text"}
              inputMode='text'
              slotProps={{ input: { endAdornment: <Fab color="warning" variant="extended" size="small" onClick={handlePwdClick}><Visibility fontSize="small" /></Fab> } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box component="div">
          <Notes notes={notes} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Box component="div" sx={{ ...FlexCss, ...AlignItemsCss, ...JustifyItemsEndCss }}>
          <Button
            disabled={isEditing || changePwdForm?.cnfNewPwd !== changePwdForm?.newPwd || !changePwdForm || !changePwdForm.cnfNewPwd || !changePwdForm.newPwd}
            onClick={handleChangePwdButton}
            startIcon={!isEditing ? <Edit fontSize='small' /> : <CircularProgress size={16} color='secondary' />}
            variant='contained'
            color='success'
            sx={{ color: "white" }}
          >
            Change
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ChangePwdModal);