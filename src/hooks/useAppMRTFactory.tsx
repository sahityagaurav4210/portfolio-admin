import { MRT_ColumnDef } from "material-react-table";
import { IContactDetails } from "../interfaces/models.interface";
import ContactActions from "../components/actions/ContactActions";

function useAppMRTFactory() {
  const getContactColumns = (handleViewBtnClick: (id: number) => void): MRT_ColumnDef<IContactDetails>[] => [
    { accessorKey: "id", header: "S.No." },
    { accessorKey: "first_name", header: "First Name" },
    { accessorKey: "last_name", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => <ContactActions row={row} handleViewBtnClick={handleViewBtnClick} />,
    },
  ];

  return { getContactColumns };
}

export default useAppMRTFactory;
