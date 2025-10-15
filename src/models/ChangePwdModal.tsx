import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';
import Heading from '../components/Heading';
import PasswordIcon from '@mui/icons-material/Password';
import { Grid } from '@mui/system';
import { IChangePwdProp } from '../interfaces/component_props.interface';

function ChangePwdModal({ open }: IChangePwdProp): React.ReactNode {
  return (
    <Dialog maxWidth="md" fullWidth open={open}>
      <DialogTitle>
        <Heading Icon={PasswordIcon} text='Change Password' />
      </DialogTitle>

      <DialogContent>
        <Grid container rowSpacing={2}>
          <Grid size={12}>
            <TextField label="Current Password" required fullWidth />
          </Grid>

          <Grid size={12}>
            <TextField label="New Password" required fullWidth />
          </Grid>

          <Grid size={12}>
            <TextField label="Confirm Password" required fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(ChangePwdModal);