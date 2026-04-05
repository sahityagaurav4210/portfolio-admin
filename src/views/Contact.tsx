import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
import { Close, ContactEmergency, HelpCenter, ListAlt } from "@mui/icons-material";
import Heading from "../components/Heading";
import useAppCss from "../hooks/useAppCss";
import ContactController from "../controllers/contact.controller";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import useAppMRTFactory from "../hooks/useAppMRTFactory";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ModalCloseButton from "../components/styled/ModalCloseButton";
import ModalHeading from "../components/headings/ModalHeading";

function Contact(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IContactDetails[]>([]);
  const [details, setDetails] = useState<IContactDetails>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCnfDialogOpen, setIsCnfDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [contactToDeleteId, setContactToDeleteId] = useState<string>("");
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

  const handleDeleteBtnClick = useCallback(function (_id: string) {
    setContactToDeleteId(_id);
    setIsCnfDialogOpen(true);
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

  const handleCnfDialogOnSuccess = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();

      if (!contactToDeleteId) {
        setIsCnfDialogOpen(false);
        toast.warning("Please select a proper contact row", getGlobalToastConfig());
        return;
      }

      setIsDeleting(true);

      try {
        const controller = new ContactController();
        const response = await controller.makeDeleteContactReq(contactToDeleteId);

        if (response.status !== ApiStatus.SUCCESS) {
          toast.error(response.message, getGlobalToastConfig());
          return;
        }

        toast.success("Contact deleted successfully", getGlobalToastConfig());
        await getDetails();
      } catch {
        toast.error("Something went wrong while deleting, please try again.", getGlobalToastConfig());
      } finally {
        setIsDeleting(false);
        setIsCnfDialogOpen(false);
        setContactToDeleteId("");
      }
    },
    [contactToDeleteId],
  );

  useEffect(() => {
    setIsLoading(true);
    getDetails();
  }, []);

  useEffect(() => {
    document.title = "Portfolio Admin || Contacts";

    return function () {
      document.title = "Portfolio Admin";
    };
  }, []);

  const columns = useMemo(
    () => getContactColumns(handleViewBtnClick, handleDeleteBtnClick),
    [handleViewBtnClick, handleDeleteBtnClick],
  );

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
        <Box component="div" display="flex" justifyContent="flex-end" p={1}>
          <ModalCloseButton onClick={handleDialogCloseBtnClick}>
            <Close fontSize="small" />
          </ModalCloseButton>
        </Box>

        <DialogTitle>
          <ModalHeading Icon={ListAlt} text="Contact Detail" />
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box component="div" className="py-2">
            <Box component="div" className="flex items-center justify-center gap-x-2 gap-y-4 flex-wrap">
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
          </Box>
        </DialogContent>
      </Dialog>

      {isCnfDialogOpen && (
        <ConfirmationDialog
          Icon={HelpCenter}
          heading="Delete Contact"
          isLoading={isDeleting}
          open={isCnfDialogOpen}
          text={
            <Typography variant="body1" fontWeight={700} textAlign="justify">
              <span className="text-red-700 font-bold">CAUTION:</span> You&apos;re about to delete this contact record.
              Are you sure you want to continue?
            </Typography>
          }
          onSuccess={handleCnfDialogOnSuccess}
          onCancel={() => {
            setIsCnfDialogOpen(false);
            setContactToDeleteId("");
          }}
        />
      )}
    </>
  );
}

export default Contact;
