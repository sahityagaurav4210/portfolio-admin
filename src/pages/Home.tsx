import {
  Button,
  Grid,
  Typography
} from "@mui/material";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { AddCircleOutline } from "@mui/icons-material";
import { ITableCol } from "../interfaces/component_props.interface";
import TableRow from "../components/TableRow";
import skills from "../data/skills.data";

function Home(): ReactNode {

  return (
    <>
      <Navbar username="Gaurav" />
      <Grid container spacing={2} px={2} mt={1}>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography
            variant="h4"
            fontFamily="Roboto"
            fontWeight="bolder"
            style={{
              textDecoration: "underline",
              textUnderlineOffset: "0.25rem",
              textDecorationStyle: "dashed",
            }}
          >
            Your skills
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop="0.08rem">
        <Grid item xs={11} display="flex" justifyContent="flex-end" mx="auto">
          <Button sx={{ backgroundColor: "#3f6212", color: "white" }}>
            <AddCircleOutline sx={{ marginX: "0.08rem" }} /> Add
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={11} mx="auto">
          <table
            width="100%"
            style={{
              fontFamily: "Roboto",
              marginTop: "0.25rem",
              border: "1px solid #f59e0b",
              borderCollapse: "collapse",
              borderRadius: "10px",
            }}
          >
            <thead style={{ backgroundColor: "#f59e0b" }}>
              <tr>
                <th style={{ padding: "0.25rem", height: "2rem" }}>Name</th>
                <th style={{ padding: "0.25rem", height: "2rem" }}>
                  Experience
                </th>
                <th style={{ padding: "0.25rem", height: "2rem" }}>
                  Description
                </th>
                <th style={{ padding: "0.25rem", height: "2rem" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {skills.map((skill: Array<ITableCol>) => <TableRow columns={skill} />)}
            </tbody>
          </table>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
