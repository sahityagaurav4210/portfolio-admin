import {
  Divider,
  Paper,
} from "@mui/material";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";
import { IViewDetails } from "../interfaces/models.interface";
import { ApiController, ApiStatus } from "../api";
import Heading from "../components/Heading";
import { ListAlt } from "@mui/icons-material";
import { getArrayRecords } from "../helpers";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

function TodayViewsDetails(): ReactNode {
  const [viewDetails, setViewDetails] = useState<IViewDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET("today-views-details", `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS) {
        const list = getArrayRecords<IViewDetails>(details);
        setViewDetails(list);
      }

      setIsLoading(false);
    }

    setIsLoading(true);
    getDetails();
  }, []);

  const columns = useMemo(() => [
    { accessorKey: "id", header: "S.No." },
    { accessorKey: "firedBy", header: "Client Identity" },
    {
      accessorKey: "createdAt", header: "Date", Cell: ({ cell }: Record<string, any>) => {
        return new Date(cell?.getValue()).toLocaleString("hi-In");
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
        <Heading Icon={ListAlt} text="Views" />
        <Divider sx={{ mb: 4 }} />

        <MaterialReactTable table={table} />

      </Paper>

    </>
  );
}

export default memo(TodayViewsDetails);
