import { Box, Divider, Fab, Paper } from "@mui/material";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";
import { IViewDetails } from "../interfaces/models.interface";
import { ApiStatus } from "../api";
import Heading from "../components/Heading";
import { ListAlt, LocationOn } from "@mui/icons-material";
import { getArrayRecords } from "../helpers";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import IPLocModal from "../models/IPLocModal";
import useAppCss from "../hooks/useAppCss";
import ViewsController from "../controllers/views.controller";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";

function TodayViewsDetails(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IViewDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientIp, setClientIp] = useState<string>("");
  const [ipLocDialogOpen, setIpLocDialogOpen] = useState<boolean>(false);
  const { GlobalTableCss } = useAppCss();

  async function getDetails() {
    const controller = new ViewsController();
    const details = await controller.makeGetViewsListReq();

    if (details.status === ApiStatus.SUCCESS) {
      const list = getArrayRecords<IViewDetails>(details);
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

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "S.No." },
      { accessorKey: "firedBy", header: "Client Identity" },
      {
        accessorKey: "createdAt",
        header: "Date",
        Cell: ({ cell }: Record<string, any>) => {
          return new Date(cell?.getValue()).toLocaleString("hi-In");
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }: Record<string, any>) => {
          return (
            <Box component="div" display="flex" columnGap={1}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  setClientIp(row?.original?.firedBy);
                  setIpLocDialogOpen(true);
                }}
              >
                <LocationOn fontSize="small" />
              </Fab>
            </Box>
          );
        },
      },
    ],
    [viewDetails]
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
      <Paper variant="elevation" component="div" className="p-4 mx-1 border border-slate-400">
        <Heading Icon={ListAlt} text="Views" />

        <Divider sx={{ mb: 4 }} />

        <MaterialReactTable table={table} />
      </Paper>

      {ipLocDialogOpen && (
        <IPLocModal clientIp={clientIp} handleModalOnClose={() => setIpLocDialogOpen(false)} isOpen={ipLocDialogOpen} />
      )}
    </>
  );
}

export default memo(TodayViewsDetails);
