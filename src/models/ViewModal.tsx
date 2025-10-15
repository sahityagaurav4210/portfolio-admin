import { memo, ReactNode } from 'react';
import { IViewDialogProp } from '../interfaces/component_props.interface';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { Close, InfoOutlined, ListAlt } from '@mui/icons-material';
import Heading from '../components/Heading';
import AppImage from '../components/AppImage';

function ViewModal({ open, handleDialogCloseBtnClick, text, details }: IViewDialogProp): ReactNode {
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

      <DialogContent sx={{ mt: 2 }}>
        <Box component="div" className='flex items-center justify-center'>
          <AppImage url={details?.url || '/404.jpg'} />
        </Box>

        <Box component="div">
          <fieldset disabled className='py-4 border border-dashed rounded-md border-slate-400 my-2'>
            <legend>
              <Box component="div" className='flex gap-1'>
                <InfoOutlined />
                <Typography variant='button'>{text}</Typography>
              </Box>
            </legend>


            <Box component="div" className='flex items-center justify-center gap-x-2 gap-y-4 flex-wrap p-2'>
              <TextField label="Name" value={details?.name.toUpperCase()} disabled fullWidth />
              <TextField label="Experience (in months)" value={details?.experience} disabled fullWidth />
            </Box>
          </fieldset>

          <fieldset disabled className='p-2 border border-dashed rounded-md border-slate-400'>
            <legend>
              <Box component="div" className='flex gap-1'>
                <InfoOutlined />
                <Typography variant='button'>SKILL DESCRIPTION</Typography>
              </Box>
            </legend>

            <Box component="div" dangerouslySetInnerHTML={{ __html: details?.description }} className='text-justify'></Box>
          </fieldset>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ViewModal);