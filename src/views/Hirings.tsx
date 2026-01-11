import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IHiringDetails } from "../interfaces/models.interface";
import { ApiStatus } from "../api";
import Heading from "../components/Heading";
import {
  AccessTime,
  AlternateEmail,
  Badge,
  Cancel,
  CurrencyRupee,
  Delete,
  Description,
  HelpCenter,
  ListAlt,
  LocationOn,
  Visibility,
  Work,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { BtnClick } from "../interfaces";
import { getArrayRecords } from "../helpers";
import { Grid } from "@mui/system";
import IPLocModal from "../models/IPLocModal";
import useAppCss from "../hooks/useAppCss";
import ConfirmationDialog from "../components/ConfirmationDialog";
import HiringController from "../controllers/hiring.controller";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { useNavigate } from "react-router-dom";

function Hirings(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IHiringDetails[]>([]);
  const [details, setDetails] = useState<IHiringDetails>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [ipLocDialogOpen, setIpLocDialogOpen] = useState<boolean>(false);
  const [clientIp, setClientIp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCnfDialogOpen, setIsCnfDialogOpen] = useState<boolean>(false);
  const [hiringId, setHiringId] = useState("");
  const { GlobalTableCss } = useAppCss();

  const navigate = useNavigate();

  async function getDetails() {
    const controller = new HiringController();
    const response = await controller.makeGetHiringRecordsReq();

    setIsLoading(false);

    if (response.status === ApiStatus.LOGOUT) {
      await navigate("/auth/login");
      return;
    }

    if (response.status === ApiStatus.SUCCESS) {
      const list = getArrayRecords<IHiringDetails>(response);
      setViewDetails(list);
    }
  }

  const handleViewBtnClick = useCallback(
    function (id: number) {
      setDetails(viewDetails[id - 1]);
      setDetailDialogOpen(true);
    },
    [viewDetails]
  );

  const handleDialogCloseBtnClick = useCallback(function (e: BtnClick) {
    e.preventDefault();
    setDetails(undefined);
    setDetailDialogOpen(false);
  }, []);

  const handleCnfDialogOnSuccess = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();

      if (!hiringId) {
        setIsDeleting(false);
        setIsCnfDialogOpen(false);

        toast.warning(
          "Please select a proper hiring table row",
          getGlobalToastConfig()
        );
        return;
      }

      const controller = new HiringController();
      const response = await controller.makeSoftDeleteHiringReq(hiringId);

      if (response.status === ApiStatus.LOGOUT) {
        setIsDeleting(false);
        setIsCnfDialogOpen(false);

        return await navigate("/auth/login");
      }

      if (response.status !== ApiStatus.SUCCESS) {
        setIsDeleting(false);
        setIsCnfDialogOpen(false);

        toast.error(response.message, getGlobalToastConfig());
        return;
      }

      setIsDeleting(false);
      setIsCnfDialogOpen(false);
      await getDetails();
    },
    [isCnfDialogOpen, isDeleting, getDetails]
  );

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "S.No." },
      { accessorKey: "client_name", header: "Name" },
      { accessorKey: "client_email", header: "Email" },
      { accessorKey: "client_project_name", header: "Project Name" },
      { accessorKey: "budget", header: "Budget" },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }: Record<string, any>) => (
          <Box component="div" display="flex" columnGap={1} alignItems="center">
            <Fab
              color="primary"
              size="small"
              onClick={() => handleViewBtnClick(row?.original?.id)}
            >
              <Visibility fontSize="small" />
            </Fab>

            <Fab
              color="warning"
              size="small"
              onClick={() => {
                setClientIp(row?.original?.ipAddress);
                setIpLocDialogOpen(true);
              }}
            >
              <LocationOn fontSize="small" />
            </Fab>

            <Fab
              color="error"
              size="small"
              onClick={() => {
                setHiringId(row?.original?._id);
                setIsCnfDialogOpen(true);
              }}
            >
              <Delete fontSize="small" />
            </Fab>
          </Box>
        ),
      },
    ],
    [viewDetails]
  );

  const table = useMaterialReactTable({
    columns,
    data: viewDetails,
    ...GlobalTableCss,
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
    state: { isLoading },
  });

  useEffect(() => {
    setIsLoading(true);
    getDetails();
  }, []);

  return (
    <>
      <Paper
        variant="elevation"
        component="div"
        className="p-4 m-1 border border-slate-400"
      >
        <Heading Icon={Work} text="Hirings" />

        <Divider sx={{ mb: 4 }} />

        <MaterialReactTable table={table} />
      </Paper>

      <Dialog maxWidth="lg" fullWidth open={detailDialogOpen}>
        <DialogTitle>
          <Box component="div" className="flex justify-end">
            <IconButton onClick={handleDialogCloseBtnClick} color="error">
              <Cancel fontSize="medium" />
            </IconButton>
          </Box>

          <Heading Icon={ListAlt} text="Details" />
        </DialogTitle>

        <DialogContent dividers>
          <Grid container columnSpacing={1}>
            <Grid size={{ xs: 12, md: 4 }} my={2}>
              <TextField
                label="Client Project Name"
                className="uppercase"
                value={details?.client_project_name.toUpperCase()}
                disabled
                fullWidth
                multiline
                slotProps={{
                  input: {
                    startAdornment: <Badge fontSize="small" sx={{ mx: 0.5 }} />,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} my={2}>
              <TextField
                label="Client Name"
                className="uppercase"
                value={details?.client_name.toUpperCase()}
                disabled
                fullWidth
                multiline
                slotProps={{
                  input: {
                    startAdornment: <Badge fontSize="small" sx={{ mx: 0.5 }} />,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} my={2}>
              <TextField
                label="Client Email"
                className="uppercase"
                value={details?.client_email}
                disabled
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <AlternateEmail fontSize="small" sx={{ mx: 0.5 }} />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} my={2}>
              <TextField
                label="Client Budget"
                className="uppercase"
                value={details?.budget}
                disabled
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <CurrencyRupee fontSize="small" sx={{ mx: 0.5 }} />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} my={2}>
              <TextField
                label="Project Tenure (in months)"
                className="uppercase"
                value={details?.tenure}
                disabled
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <AccessTime fontSize="small" sx={{ mx: 0.5 }} />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} my={2}>
              <TextField
                label="Hiring Type"
                className="uppercase"
                value={details?.hiring_type.toUpperCase()}
                disabled
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: <Work fontSize="small" sx={{ mx: 0.5 }} />,
                  },
                }}
              />
            </Grid>

            <Grid size={12} my={2}>
              <TextField
                label="Project Description"
                value={details?.project_desc}
                disabled
                fullWidth
                multiline
                slotProps={{
                  input: {
                    startAdornment: (
                      <Description fontSize="small" sx={{ mx: 0.5 }} />
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {ipLocDialogOpen && (
        <IPLocModal
          clientIp={clientIp}
          handleModalOnClose={() => setIpLocDialogOpen(false)}
          isOpen={ipLocDialogOpen}
        />
      )}

      {isCnfDialogOpen && (
        <ConfirmationDialog
          Icon={HelpCenter}
          heading="Confirmation"
          isLoading={isDeleting}
          open={isCnfDialogOpen}
          text={
            <Typography variant="body1" fontWeight={700} textAlign="justify">
              <span className="text-red-700 font-bold">CAUTION:</span> You're
              deleting a hiring record. Are you sure you want to continue?
            </Typography>
          }
          onSuccess={handleCnfDialogOnSuccess}
          onCancel={() => setIsCnfDialogOpen(false)}
        />
      )}
    </>
  );
}

export default memo(Hirings);
