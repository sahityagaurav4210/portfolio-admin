import { Box, Button, Divider, Fab, Paper, Typography } from "@mui/material";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ApiStatus } from "../api";
import { Add, Delete, Edit, HelpCenter, Visibility, Widgets } from "@mui/icons-material";
import { ISkillForm } from "../interfaces/models.interface";
import { getArrayRecords } from "../helpers";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { BtnClick } from "../interfaces";
import Heading from "../components/Heading";
import AddSkillModal from "../models/skills/AddSkillModal";
import ViewModal from "../models/ViewModal";
import EditSkillModal from "../models/skills/EditSkillModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
import useAppCss from "../hooks/useAppCss";
import SkillController from "../controllers/skills.controller";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";

function Skills(): ReactNode {
  const [skills, setSkills] = useState<ISkillForm[]>([]);
  const [details, setDetails] = useState<ISkillForm>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [addDialogBoxView, setAddDialogBoxView] = useState<boolean>(false);
  const [editDialogBoxView, setEditDialogBoxView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCnfDialogOpen, setIsCnfDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [skillToDeleteId, setSkillToDeleteId] = useState<string>("");
  const { GlobalTableCss } = useAppCss();

  async function getDetails() {
    const controller = new SkillController();

    const details = await controller.makeGetSkillListReq();

    if (details.status === ApiStatus.SUCCESS) {
      const list = getArrayRecords<ISkillForm>(details);
      setSkills(list);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    getDetails();
  }, []);

  useEffect(() => {
    document.title = "Portfolio Admin || Skills";

    return function () {
      document.title = "Portfolio Admin";
    };
  }, []);

  const handleViewBtnClick = useCallback(
    function (id: number) {
      setDetails(skills[id - 1]);
      setDetailDialogOpen(true);
    },
    [skills],
  );

  const handleEditBtnClick = useCallback(
    function (id: number) {
      setDetails(skills[id - 1]);
      setEditDialogBoxView(true);
    },
    [skills],
  );

  const handleAddDialogBoxClickBtn = useCallback(
    function () {
      setAddDialogBoxView(false);
    },
    [addDialogBoxView],
  );

  const handleAddBtnClick = useCallback(
    function () {
      setAddDialogBoxView(true);
    },
    [addDialogBoxView],
  );

  const handleDialogCloseBtnClick = useCallback(function (e: BtnClick) {
    e.preventDefault();
    setDetails(undefined);

    setDetailDialogOpen(false);
    setEditDialogBoxView(false);
  }, []);

  const handleDeleteBtnClick = useCallback(
    function (_id: string) {
      setSkillToDeleteId(_id);
      setIsCnfDialogOpen(true);
    },
    [],
  );

  const handleCnfDialogOnSuccess = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();

      if (!skillToDeleteId) {
        setIsCnfDialogOpen(false);
        toast.warning("Please select a proper skill row", getGlobalToastConfig());
        return;
      }

      setIsDeleting(true);

      try {
        const controller = new SkillController();
        const response = await controller.makeDeleteSkillReq(skillToDeleteId);

        if (response.status !== ApiStatus.SUCCESS) {
          toast.error(response.message, getGlobalToastConfig());
          return;
        }

        toast.success("Skill deleted successfully", getGlobalToastConfig());
        await getDetails();
      } catch {
        toast.error("Something went wrong while deleting, please try again.", getGlobalToastConfig());
      } finally {
        setIsDeleting(false);
        setIsCnfDialogOpen(false);
        setSkillToDeleteId("");
      }
    },
    [skillToDeleteId],
  );

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "S.No." },
      { accessorKey: "name", header: "Skill Name" },
      { accessorKey: "experience", header: "Experience" },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }: Record<string, any>) => {
          return (
            <Box component="div" className="flex gap-2">
              <Fab color="primary" size="small" onClick={() => handleViewBtnClick(row?.original?.id)}>
                <Visibility fontSize="small" />
              </Fab>

              <Fab color="warning" size="small" onClick={() => handleEditBtnClick(row?.original?.id)}>
                <Edit fontSize="small" />
              </Fab>

              <Fab
                color="error"
                size="small"
                onClick={() => handleDeleteBtnClick(row?.original?._id)}
              >
                <Delete fontSize="small" />
              </Fab>
            </Box>
          );
        },
      },
    ],
    [skills],
  );

  const table = useMaterialReactTable({
    columns,
    data: skills,
    ...GlobalTableCss,
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    state: { isLoading },
  });

  return (
    <>
      <Paper variant="elevation" component="div" className="p-2 sm:p-4 m-2 border border-slate-400 overflow-x-auto box-border">
        <Heading Icon={Widgets} text="Skills" />

        <Divider sx={{ mb: 4 }} />

        <Box component="div" className="flex items-center justify-end my-2">
          <Button size="small" startIcon={<Add fontSize="small" />} variant="contained" onClick={handleAddBtnClick}>
            Add
          </Button>
        </Box>

        <MaterialReactTable table={table} />
      </Paper>

      {detailDialogOpen && (
        <ViewModal
          details={details}
          handleDialogCloseBtnClick={handleDialogCloseBtnClick}
          open={detailDialogOpen}
          onEditHandler={() => {
            setDetailDialogOpen(false);
            setEditDialogBoxView(true);
          }}
        />
      )}

      {addDialogBoxView && (
        <AddSkillModal
          open={addDialogBoxView}
          handleDialogCloseBtnClick={handleAddDialogBoxClickBtn}
          onAddHandler={getDetails}
        />
      )}

      {editDialogBoxView && (
        <EditSkillModal
          open={editDialogBoxView}
          handleDialogCloseBtnClick={handleDialogCloseBtnClick}
          details={details}
          onAddHandler={getDetails}
        />
      )}

      {isCnfDialogOpen && (
        <ConfirmationDialog
          Icon={HelpCenter}
          heading="Delete Skill"
          isLoading={isDeleting}
          open={isCnfDialogOpen}
          text={
            <Typography variant="body1" fontWeight={700} textAlign="justify">
              <span className="text-red-700 font-bold">CAUTION:</span> You&apos;re about to delete this skill. Are you sure you want to continue?
            </Typography>
          }
          onSuccess={handleCnfDialogOnSuccess}
          onCancel={() => {
            setIsCnfDialogOpen(false);
            setSkillToDeleteId("");
          }}
        />
      )}
    </>
  );
}

export default Skills;
