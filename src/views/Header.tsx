import React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import ImgContainer from '../components/ImgContainer';

function Header(): React.ReactNode {
  return (
    <Stack direction="row" m={2} gap={2} alignItems="center">
      <ImgContainer url='/portfolio-builder.jpg' />

      <Stack direction="column">
        <Typography variant="h5" fontWeight={700}>CODING WORKS</Typography>
        <Divider />
        <Typography variant="button" fontWeight={700}>PORTFOLIO ADMIN</Typography>
      </Stack>

    </Stack>
  );
}

export default React.memo(Header);