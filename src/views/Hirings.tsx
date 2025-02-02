import { Card, CardContent, Chip, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { IHiringDetails } from '../interfaces/models.interface';
import NoDataTableRow from '../components/NoDataTableRow';
import { ApiController, ApiStatus } from '../api';

function Hirings(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IHiringDetails[]>([]);

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET("hiring/all", `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS)
        setViewDetails(details?.data);
    }

    getDetails();
  }, []);

  return (
    <>
      <Grid2 container spacing={2} px={2} my={2} mt={5}>
        <Grid2 size={12}>
          <Card className="border-l-8 border-blue-500">
            <CardContent
              sx={{ fontFamily: "Roboto" }}
              className="flex items-center"
            >
              <h1 className="text-xl text-amber-600 font-bold">Hirings</h1>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} px={2} my={2} mt={5}>
        <Grid2 size={12}>
          <TableContainer component={Paper}>
            <Table align='center'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Sr No.</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Client Name</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Client Email</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Client Budget</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Project Name</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Hiring Type</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>IP Address</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Tenure</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!viewDetails.length ? <NoDataTableRow colspan={8} text='No data available' /> : viewDetails?.map((detail: IHiringDetails, index: number) => <React.Fragment key={index}>
                  <TableRow className='odd:bg-amber-50'>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center'>{detail.client_name}</TableCell>
                    <TableCell align='center'>{detail.client_email}</TableCell>
                    <TableCell align='center'><Chip label={detail.budget} color='secondary' variant='outlined'></Chip></TableCell>
                    <TableCell align='center'>{detail.client_project_name}</TableCell>
                    <TableCell align='center'><Chip label={detail.hiring_type} color='secondary' variant='outlined'></Chip></TableCell>
                    <TableCell align='center'>{detail.ipAddress}</TableCell>
                    <TableCell align='center'>{detail.tenure || 0}&nbsp;months</TableCell>
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

export default Hirings