import { Box, Dialog, DialogContent, DialogTitle, Divider, Fab, IconButton, Paper, TextField, Typography } from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { IContactDetails } from '../interfaces/models.interface';
import { ApiController, ApiStatus } from '../api';
import { getArrayRecords } from '../helpers';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { BtnClick } from '../interfaces';
import { Close, ContactEmergency, InfoOutlined, ListAlt, Visibility } from '@mui/icons-material';
import Heading from '../components/Heading';

function Contact(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IContactDetails[]>([]);
  const [details, setDetails] = useState<IContactDetails>();
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

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET("contract/all", `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS) {
        const list = getArrayRecords<IContactDetails>(details);
        setViewDetails(list);
      }

      setIsLoading(false);
    }

    setIsLoading(true);
    getDetails();
  }, []);

  const columns = useMemo(() => [
    { accessorKey: "id", header: "S.No." },
    { accessorKey: "first_name", header: "First Name" },
    { accessorKey: "last_name", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "actions", header: "Actions", Cell: ({ row }: Record<string, any>) => {
        return (
          <Fab color='primary' size='small' onClick={() => handleViewBtnClick(row?.original?.id)}>
            <Visibility fontSize='small' />
          </Fab>
        );
      }
    }
  ], [viewDetails]);

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

  return (
    <>
      <Paper variant="elevation" component="div" className="p-4 m-1 border border-slate-400">
        <Heading Icon={ContactEmergency} text="Contacts" />

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
                  <Typography variant='button'>Contact Details</Typography>
                </Box>
              </legend>


              <Box component="div" className='flex items-center justify-center gap-x-2 gap-y-4 flex-wrap p-2'>
                <TextField label="First Name" className='uppercase' value={details?.first_name.toUpperCase()} disabled fullWidth />
                <TextField label="Last Name" className='uppercase' value={details?.last_name?.toUpperCase()} disabled fullWidth />
                <TextField label="Email" className='uppercase' value={details?.email} disabled fullWidth />
                <TextField label="Identity" className='uppercase' value={details?.ipAddress} disabled fullWidth />
                <TextField label="Message" className='uppercase' value={details?.message} disabled fullWidth multiline />
              </Box>

            </fieldset>
          </Box>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default Contact;