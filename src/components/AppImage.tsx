import React from 'react';
import { IAppImgContainerProp } from '../interfaces/component_props.interface';
import { Box } from '@mui/material';

function AppImage({ url }: IAppImgContainerProp) {
  return (
    <Box component="div" className='max-w-xs'>
      <img src={url} alt="Image" className='rounded-xl' loading='lazy' />
    </Box>
  );
}

export default React.memo(AppImage);