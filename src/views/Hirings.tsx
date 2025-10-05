import { Box, Dialog, DialogContent, DialogTitle, Divider, Fab, IconButton, Paper, TextField, Typography, } from '@mui/material';
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { IHiringDetails } from '../interfaces/models.interface';
import { ApiController, ApiStatus } from '../api';
import Heading from '../components/Heading';
import { Close, InfoOutlined, ListAlt, Visibility, Work } from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { BtnClick } from '../interfaces';
import { getArrayRecords } from '../helpers';

function Hirings(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IHiringDetails[]>([]);
  const [details, setDetails] = useState<IHiringDetails>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleViewBtnClick = useCallback(function (id: number) {
    setDetails(viewDetails[id - 1]);
    setDetailDialogOpen(true);
  }, [viewDetails]);

  const handleDialogCloseBtnClick = useCallback(function (e: BtnClick) {
    e.preventDefault();
    setDetails(undefined);
    setDetailDialogOpen(false);
  }, []);

  const columns = useMemo(() => [{ accessorKey: "id", header: "S.No." }, { accessorKey: "client_name", header: "Name" }, { accessorKey: "client_email", header: "Email" }, { accessorKey: "client_project_name", header: "Project Name" }, { accessorKey: "budget", header: "Budget" }, {
    accessorKey: "actions", header: "Actions", Cell: ({ row }: Record<string, any>) => {
      return (
        <Fab color='primary' size='small' onClick={() => handleViewBtnClick(row?.original?.id)}>
          <Visibility fontSize='small' />
        </Fab>
      );
    }
  }], [viewDetails]);

  const table = useMaterialReactTable({
    columns,
    data: viewDetails,
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
    muiTablePaperProps: {
      elevation: 3,
      sx: { borderRadius: "8px", overflow: "hidden" },
    },
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    muiTableHeadCellProps: {
      sx: { fontWeight: "bold", color: "#000080" },
    },
    state: { isLoading }
  });

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET("hiring/all", `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS) {
        const list = getArrayRecords<IHiringDetails>(details);
        setViewDetails(list);
      }

      setIsLoading(false);
    }

    setIsLoading(true);
    getDetails();
  }, []);

  return (
    <>
      <Paper variant="elevation" component="div" className="p-4 m-1 border border-slate-400">
        <Heading Icon={Work} text="Hirings" />

        <Divider sx={{ mb: 4 }} />

        <MaterialReactTable table={table} />
      </Paper>

      <Dialog maxWidth="lg" fullWidth open={detailDialogOpen}>
        <DialogTitle>
          <Box component="div" className='flex justify-end'>
            <IconButton onClick={handleDialogCloseBtnClick}>
              <Close fontSize='small' color='error' />
            </IconButton>
          </Box>

          <Heading Icon={ListAlt} text='Details' />
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box component="div">
            <fieldset disabled className='py-4 border border-dashed rounded-md border-slate-400'>
              <legend>
                <Box component="div" className='flex gap-1'>
                  <InfoOutlined />
                  <Typography variant='button'>Hiring Details</Typography>
                </Box>
              </legend>


              <Box component="div" className='flex items-center justify-center gap-x-2 gap-y-4 flex-wrap p-2'>
                <TextField label="Client Project Name" className='uppercase' value={details?.client_project_name.toUpperCase()} disabled fullWidth />
                <TextField label="Client Name" className='uppercase' value={details?.client_name.toUpperCase()} disabled fullWidth />
                <TextField label="Client Email" className='uppercase' value={details?.client_email} disabled fullWidth />
                <TextField label="Client Budget" className='uppercase' value={details?.budget} disabled fullWidth />
                <TextField label="Project Tenure" className='uppercase' value={details?.tenure} disabled fullWidth />
                <TextField label="Hiring Type" className='uppercase' value={details?.hiring_type.toUpperCase()} disabled fullWidth />
                <TextField label="IP Address" className='uppercase' value={details?.ipAddress} disabled fullWidth />
              </Box>

            </fieldset>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(Hirings);