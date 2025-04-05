import { Chip, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { IContactDetails } from '../interfaces/models.interface';
import NoDataTableRow from '../components/NoDataTableRow';
import { ApiController, ApiStatus } from '../api';

function Contact(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IContactDetails[]>([]);

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET("contract/all", `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS)
        setViewDetails(details?.data);
    }

    getDetails();
  }, []);

  return (
    <>
      <Grid2 container spacing={2} px={2} my={2}>
        <Grid2 size={12}>
          <TableContainer component={Paper}>
            <Table align='center'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Sr No.</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Client Name</TableCell>
                  <TableCell align='center' className='bg-amber-700 max-w-max' style={{ color: "white", }}>Client Email</TableCell>
                  <TableCell align='center' className='bg-amber-700 max-w-max' style={{ color: "white", }}>IP Address</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white", minWidth: "200px" }}>Message</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!viewDetails.length ? <NoDataTableRow colspan={8} text='No data available' /> : viewDetails?.map((detail: IContactDetails, index: number) => <React.Fragment key={index}>
                  <TableRow className='odd:bg-amber-50'>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center'>{`${detail.first_name} ${detail.last_name || ""}`.trim()}</TableCell>
                    <TableCell align='center'>{detail.email}</TableCell>
                    <TableCell align='center'><Chip label={detail.ipAddress} color='secondary' variant='outlined'></Chip></TableCell>
                    <TableCell align='center'>{detail.message}</TableCell>
                  </TableRow>
                </React.Fragment>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      </Grid2>
    </>
  )
}

export default Contact;