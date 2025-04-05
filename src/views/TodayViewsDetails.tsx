import {
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import { IViewDetails } from "../interfaces/models.interface";
import { ApiController, ApiStatus } from "../api";
import NoDataTableRow from "../components/NoDataTableRow";

function TodayViewsDetails(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IViewDetails[]>([]);

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET(
        "today-views-details",
        `Bearer ${authorization}`
      );

      if (details.status === ApiStatus.SUCCESS) setViewDetails(details?.data);
    }

    getDetails();
  }, []);

  return (
    <>

      <Grid2 container spacing={2} px={2} my={2}>
        <Grid2 size={12}>
          <TableContainer component={Paper}>
            <Table align="center">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    className="bg-amber-700"
                    style={{ color: "white" }}
                  >
                    Sr No.
                  </TableCell>
                  <TableCell
                    align="center"
                    className="bg-amber-700"
                    style={{ color: "white" }}
                  >
                    IP Address
                  </TableCell>
                  <TableCell
                    align="center"
                    className="bg-amber-700"
                    style={{ color: "white" }}
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!viewDetails.length ? (
                  <NoDataTableRow colspan={3} text="No data available" />
                ) : (
                  viewDetails?.map((detail: IViewDetails, index: number) => (
                    <React.Fragment key={index}>
                      <TableRow className="odd:bg-amber-50">
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{detail.firedBy}</TableCell>
                        <TableCell align="center">
                          {new Date(detail.createdAt).toLocaleString("hi-In")}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      </Grid2>
    </>
  );
}

export default TodayViewsDetails;
