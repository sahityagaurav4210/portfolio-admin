import { memo, ReactNode } from 'react';
import { INotesProp } from '../interfaces/component_props.interface';
import { Box, Typography } from '@mui/material';
import useAppCss from '../hooks/useAppCss';
import { ArrowRight } from '@mui/icons-material';

function Notes({ notes }: INotesProp): ReactNode {
  const { FlexCss, AlignItemsCss } = useAppCss();

  return (
    notes.map(item => <Box component="div" sx={{ ...FlexCss, ...AlignItemsCss }} columnGap={0.25}>
      <ArrowRight fontSize='small' />
      <Typography variant='caption' color='error'>{item}</Typography>
    </Box>)
  );
}

export default memo(Notes);