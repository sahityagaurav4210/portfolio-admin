import { Card, CardContent, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { IViewDetails } from '../interfaces/models.interface';
import { ApiController, ApiStatus } from '../api';
import NoDataTableRow from '../components/NoDataTableRow';

function TodayViewsDetails(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IViewDetails[]>([]);

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET("baas/website/today-views-details", `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS)
        setViewDetails(details?.data);
    }

    getDetails();
  }, [])

  return (
    <>
      <Grid2 container spacing={2} px={2} my={2} mt={5}>
        <Grid2 size={12}>
          <Card className="border-l-8 border-blue-500">
            <CardContent
              sx={{ fontFamily: "Roboto" }}
              className="flex items-center"
            >
              <h1 className="text-xl text-amber-600 font-bold">Daily views details</h1>
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
                  <TableCell align='center' className='bg-amber-100'>Sr No.</TableCell>
                  <TableCell align='center' className='bg-amber-100'>Client IP</TableCell>
                  <TableCell align='center' className='bg-amber-100'>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!viewDetails.length ? <NoDataTableRow colspan={3} text='No data available' /> : viewDetails?.map((detail: IViewDetails, index: number) => <React.Fragment key={index}>
                  <TableRow className='odd:bg-amber-50'>
                    <TableCell>{index}</TableCell>
                    <TableCell>{detail.firedBy}</TableCell>
                    <TableCell>{new Date(detail.createdAt).toLocaleDateString("hi-In")}</TableCell>
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

export default TodayViewsDetails