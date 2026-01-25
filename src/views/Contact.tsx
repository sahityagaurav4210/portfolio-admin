import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { IContactDetails } from "../interfaces/models.interface";
import { ApiStatus } from "../api";
import { getArrayRecords } from "../helpers";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { BtnClick } from "../interfaces";
import { Close, ContactEmergency, InfoOutlined, ListAlt } from "@mui/icons-material";
import Heading from "../components/Heading";
import useAppCss from "../hooks/useAppCss";
import ContactController from "../controllers/contact.controller";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import useAppMRTFactory from "../hooks/useAppMRTFactory";

function Contact(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IContactDetails[]>([]);
  const [details, setDetails] = useState<IContactDetails>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { GlobalTableCss } = useAppCss();
  const { getContactColumns } = useAppMRTFactory();

  const handleViewBtnClick = useCallback(
    function (id: number) {
      setDetails(viewDetails[id - 1]);
      setDetailDialogOpen(true);
    },
    [viewDetails],
  );

  const handleDialogCloseBtnClick = useCallback(function (e: BtnClick) {
    e.preventDefault();
    setDetails(undefined);
    setDetailDialogOpen(false);
  }, []);

  async function getDetails() {
    const controller = new ContactController();
    const details = await controller.makeGetContactListReq();

    if (details.status === ApiStatus.SUCCESS) {
      const list = getArrayRecords<IContactDetails>(details);
      setViewDetails(list);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.error(details.message, getGlobalToastConfig());
  }

  useEffect(() => {
    setIsLoading(true);
    getDetails();
  }, []);

  const columns = useMemo(() => getContactColumns(handleViewBtnClick), [handleViewBtnClick]);

  const table = useMaterialReactTable({
    columns,
    data: viewDetails,
    ...GlobalTableCss,
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    state: { isLoading },
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
          <Box component="div" className="flex justify-end">
            <IconButton onClick={handleDialogCloseBtnClick}>
              <Close fontSize="small" color="error" />
            </IconButton>
          </Box>

          <Heading Icon={ListAlt} text="Details" />
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box component="div">
            <fieldset disabled className="py-4 border border-dashed rounded-md border-slate-400">
              <legend>
                <Box component="div" className="flex gap-1">
                  <InfoOutlined />
                  <Typography variant="button">Contact Details</Typography>
                </Box>
              </legend>

              <Box component="div" className="flex items-center justify-center gap-x-2 gap-y-4 flex-wrap p-2">
                <TextField
                  label="First Name"
                  className="uppercase"
                  value={details?.first_name?.toUpperCase()}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  className="uppercase"
                  value={details?.last_name?.toUpperCase()}
                  disabled
                  fullWidth
                />
                <TextField label="Email" className="uppercase" value={details?.email} disabled fullWidth />
                <TextField label="Identity" className="uppercase" value={details?.ipAddress} disabled fullWidth />
                <TextField
                  label="Message"
                  className="uppercase"
                  value={details?.message}
                  disabled
                  fullWidth
                  multiline
                />
              </Box>
            </fieldset>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Contact;
