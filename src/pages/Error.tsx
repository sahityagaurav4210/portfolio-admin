import { Grid } from '@mui/system';
import ErrorImg from '../assets/error.jpg';
import { ReactNode } from 'react';
import { Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useRouteError } from 'react-router-dom';

function Error(): ReactNode {
  const errorMsg = useRouteError() as Error;

  return <>
    <Grid container rowSpacing={2}>
      <Grid size={12}>
        <img src={ErrorImg} alt="error" className='h-full max-h-96 mx-auto' loading='lazy' />
      </Grid>

      <Grid size={12}>
        <Typography variant='subtitle1' fontFamily={"Roboto"} fontWeight={900} textAlign={"center"}>OOPS!!, An error occurred while processing your request, please try again after sometime.</Typography>
      </Grid>

      <Grid size={12}>
        <Typography variant='caption' fontFamily={"Roboto"} textAlign={"center"}> <span className='text-red-600 font-bold'>Error Message: </span> {errorMsg.message || "Not available"}</Typography>
      </Grid>

      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <Button variant='contained' startIcon={<Home fontSize='small' />} href='/'>Go to home</Button>
      </Grid>
    </Grid>
  </>;
}

export default Error;