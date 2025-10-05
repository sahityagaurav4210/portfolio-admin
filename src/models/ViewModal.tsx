import { memo, ReactNode } from 'react';
import { IViewDialogProp } from '../interfaces/component_props.interface';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { Close, InfoOutlined, ListAlt } from '@mui/icons-material';
import Heading from '../components/Heading';

function ViewModal({ open, handleDialogCloseBtnClick, text, details }: IViewDialogProp): ReactNode {
  return (
    <Dialog maxWidth="lg" fullWidth open={open}>
      <DialogTitle>
        <Box component="div" className='flex justify-end'>
          <IconButton onClick={handleDialogCloseBtnClick}>
            <Close fontSize='small' color='error' />
          </IconButton>
        </Box>

        <Heading Icon={ListAlt} text='Details' />
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box component="div">
          <fieldset disabled className='py-4 border border-dashed rounded-md border-slate-400'>
            <legend>
              <Box component="div" className='flex gap-1'>
                <InfoOutlined />
                <Typography variant='button'>{text}</Typography>
              </Box>
            </legend>


            <Box component="div" className='flex items-center justify-center gap-x-2 gap-y-4 flex-wrap p-2'>
              <TextField label="Name" className='uppercase' value={details?.name.toUpperCase()} disabled fullWidth />
              <TextField label="Experience" className='uppercase' value={details?.experience} disabled fullWidth />
              <TextField label="Url" className='uppercase' value={details?.url} disabled fullWidth />
              <TextField label="Description" className='uppercase' value={details?.description} disabled fullWidth multiline />
            </Box>

          </fieldset>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ViewModal);