import { ReactNode, useState } from "react";
import { ITableCol, ITableRowProp } from "../interfaces/component_props.interface";
import { Button, Dialog, DialogTitle, Grid, IconButton, Stack } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

function TableRow({ columns }: ITableRowProp): ReactNode {
  const [deleteModalState, setDeleteModalState] = useState<boolean>(false);
  return (
    <>
      <tr style={{ borderBottom: "1px solid #f59e0b" }}>
        {columns.map((col: ITableCol) => <td style={col.style}>{col.text}</td>)}

        <td
          style={{
            padding: "0.25rem",
            textAlign: "center",
            width: "10%",
            marginTop: "1rem",
            backgroundColor: "#EFF3EA",
          }}
        >
          <Stack spacing={2} direction="row" justifyContent="center">
            <IconButton color="warning">
              <Edit />
            </IconButton>

            <IconButton color="error" onClick={() => setDeleteModalState(!deleteModalState)}>
              <Delete />
            </IconButton>
          </Stack>
        </td>
      </tr>

      <Dialog open={deleteModalState}>
        <DialogTitle fontWeight="bolder" fontSize="1.5rem" className="underline underline-offset-1">Confirmation</DialogTitle>
        <Grid container style={{ position: "relative" }}>

          <Grid item xs={12} fontFamily="Roboto" p={2}>
            <p>Are you sure about deleting this record?</p>
          </Grid>

          <Grid item xs={12} fontFamily="Roboto" p={1}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="contained" color="error">Yes, delete</Button>
              <Button variant="contained" color="success" onClick={() => setDeleteModalState(!deleteModalState)}>Close</Button>
            </Stack>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}

export default TableRow;
