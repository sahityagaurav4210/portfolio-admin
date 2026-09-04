import { Box, Button, Chip, Divider, Fab, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ApiStatus } from "../api";
import {
  AccountTree,
  Add,
  Code,
  Delete,
  Edit,
  HelpCenter,
  Launch,
  Sell,
  Visibility,
  Warning,
} from "@mui/icons-material";
import { IProjects } from "../interfaces/models.interface";
import { checkLogoutApiResponse, getArrayRecords } from "../helpers";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { BtnClick } from "../interfaces";
import Heading from "../components/Heading";
import AddProjectModal from "../models/projects/AddProjectModal";
import ViewProjectModal from "../models/projects/ViewProjectModal";
import EditProjectModal from "../models/projects/EditProjectModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
import useAppCss from "../hooks/useAppCss";
import ProjectsController from "../controllers/projects.controller";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { useNavigate } from "react-router-dom";
import { getProjectPriorityLabel } from "../constants";

function ProjectsPage(): ReactNode {
  const [projects, setProjects] = useState<IProjects[]>([]);
  const [details, setDetails] = useState<IProjects>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [addDialogBoxView, setAddDialogBoxView] = useState<boolean>(false);
  const [editDialogBoxView, setEditDialogBoxView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCnfDialogOpen, setIsCnfDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string>("");
  const { GlobalTableCss } = useAppCss();

  const navigate = useNavigate();

  async function getDetails() {
    const controller = new ProjectsController();
    const details = await controller.makeGetProjectsListReq();
    const isLogout = checkLogoutApiResponse(details.status, details.message);

    if (isLogout) {
      await navigate("/auth/login");
      localStorage.clear();
      return;
    }

    if (details.status === ApiStatus.SUCCESS) {
      const list = getArrayRecords<IProjects>(details);
      setProjects(list);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    getDetails();
  }, []);

  const handleViewBtnClick = useCallback(
    function (id: number) {
      setDetails(projects[id - 1]);
      setDetailDialogOpen(true);
    },
    [projects],
  );

  const handleEditBtnClick = useCallback(
    function (id: number) {
      setDetails(projects[id - 1]);
      setEditDialogBoxView(true);
    },
    [projects],
  );

  const handleAddDialogBoxClickBtn = useCallback(function () {
    setAddDialogBoxView(false);
  }, []);

  const handleAddBtnClick = useCallback(function () {
    setAddDialogBoxView(true);
  }, []);

  const handleDialogCloseBtnClick = useCallback(function (e: BtnClick) {
    e.preventDefault();
    setDetails(undefined);
    setDetailDialogOpen(false);
    setEditDialogBoxView(false);
  }, []);

  const handleDeleteBtnClick = useCallback(function (_id: string) {
    setProjectToDeleteId(_id);
    setIsCnfDialogOpen(true);
  }, []);

  const handleCnfDialogOnSuccess = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();

      if (!projectToDeleteId) {
        setIsCnfDialogOpen(false);
        toast.warning("Please select a proper project row", getGlobalToastConfig());
        return;
      }

      setIsDeleting(true);

      try {
        const controller = new ProjectsController();
        const response = await controller.deleteExistingProjectById(projectToDeleteId);
        const isLogout = checkLogoutApiResponse(response.status, response.message);

        if (isLogout) {
          await navigate("/auth/login");
          localStorage.clear();
          return;
        }

        if (response.status !== ApiStatus.SUCCESS) {
          toast.error(response.message, getGlobalToastConfig());
          return;
        }

        toast.success("Project deleted successfully", getGlobalToastConfig());
        await getDetails();
      } catch {
        toast.error("Something went wrong while deleting, please try again.", getGlobalToastConfig());
      } finally {
        setIsDeleting(false);
        setIsCnfDialogOpen(false);
        setProjectToDeleteId("");
      }
    },
    [projectToDeleteId],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "S.No.",
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Project Name",
        Cell: ({ row }: Record<string, any>) => (
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {row?.original?.name}
          </Typography>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 120,
        Cell: ({ row }: Record<string, any>) => {
          const isPersonal = row?.original?.type?.toLowerCase() === "personal";
          return (
            <Chip
              label={isPersonal ? "Personal" : "Professional"}
              color={isPersonal ? "primary" : "secondary"}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, textTransform: "capitalize" }}
            />
          );
        },
      },
      {
        accessorKey: "projectDomain",
        header: "Domain",
        size: 130,
        Cell: ({ row }: Record<string, any>) => {
          const domain = row?.original?.projectDomain;
          if (!domain) {
            return (
              <Chip
                label="Not Available"
                size="small"
                color="error"
                variant="outlined"
                icon={<Warning fontSize="small" color="error" />}
                sx={{ fontSize: "0.75rem", height: 24, p: 1 }}
              />
            );
          }
          return (
            <Chip
              label={domain}
              color="info"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, textTransform: "capitalize" }}
            />
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 130,
        Cell: ({ row }: Record<string, any>) => {
          const priorityVal = row?.original?.priority;
          const label = getProjectPriorityLabel(priorityVal);
          let priorityColor: "default" | "primary" | "warning" | "error" = "default";

          if (typeof priorityVal === "number") {
            if (priorityVal >= 30) {
              priorityColor = "error";
            } else if (priorityVal >= 20) {
              priorityColor = "warning";
            } else if (priorityVal >= 10) {
              priorityColor = "primary";
            }
          }

          return <Chip label={label} size="small" variant="outlined" color={priorityColor} sx={{ fontWeight: 600 }} />;
        },
      },

      {
        accessorKey: "tech_stack",
        header: "Tech Stack",
        Cell: ({ row }: Record<string, any>) => {
          const techStack: string[] = row?.original?.tech_stack ?? [];
          if (!techStack.length) {
            return (
              <Chip
                label="Not Available"
                size="small"
                color="error"
                variant="outlined"
                icon={<Warning fontSize="small" color="error" />}
                sx={{ fontSize: "0.75rem", height: 24, p: 1 }}
              />
            );
          }

          const visibleTags = techStack.slice(0, 3);
          const hiddenCount = techStack.length - 3;

          return (
            <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
              {visibleTags.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  color="success"
                  variant="outlined"
                  icon={<Sell fontSize="small" color="success" />}
                  sx={{ fontSize: "0.75rem", height: 24 }}
                />
              ))}
              {hiddenCount > 0 && (
                <Tooltip title={techStack.slice(3).join(", ")} arrow>
                  <Chip
                    label={`+${hiddenCount}`}
                    size="small"
                    variant="filled"
                    sx={{ fontSize: "0.75rem", height: 24, cursor: "pointer" }}
                  />
                </Tooltip>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 140,
        Cell: ({ row }: Record<string, any>) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {row?.original?.ongoing ? (
              <Chip
                label="Ongoing"
                color="warning"
                size="small"
                variant="filled"
                sx={{ height: 22, fontSize: "0.7rem" }}
              />
            ) : (
              <Chip
                label="Completed"
                color="success"
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: "0.7rem" }}
              />
            )}
            {row?.original?.disabled && (
              <Chip
                label="Disabled"
                color="error"
                size="small"
                variant="filled"
                sx={{ height: 22, fontSize: "0.7rem" }}
              />
            )}
          </Stack>
        ),
      },
      {
        accessorKey: "links",
        header: "Links",
        size: 100,
        Cell: ({ row }: Record<string, any>) => {
          const live = row?.original?.liveLink;
          const code = row?.original?.codeLink;
          if (!live && !code) {
            return (
              <Chip
                label="Not Available"
                size="small"
                color="error"
                variant="outlined"
                icon={<Warning fontSize="small" color="error" />}
                sx={{ fontSize: "0.75rem", height: 24, p: 1 }}
              />
            );
          }
          return (
            <Box display="flex" gap={0.5}>
              {live && (
                <Tooltip title="Live Demo" arrow>
                  <IconButton
                    size="small"
                    color="success"
                    component="a"
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Launch fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {code && (
                <Tooltip title="Source Code" arrow>
                  <IconButton
                    size="small"
                    color="primary"
                    component="a"
                    href={code}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Code fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }: Record<string, any>) => (
          <Box component="div" className="flex gap-2">
            <Tooltip title="View Project" arrow>
              <Fab color="primary" size="small" onClick={() => handleViewBtnClick(row?.original?.id)}>
                <Visibility fontSize="small" />
              </Fab>
            </Tooltip>

            <Tooltip title="Edit Project" arrow>
              <Fab color="warning" size="small" onClick={() => handleEditBtnClick(row?.original?.id)}>
                <Edit fontSize="small" />
              </Fab>
            </Tooltip>

            <Tooltip title="Delete Project" arrow>
              <Fab color="error" size="small" onClick={() => handleDeleteBtnClick(row?.original?._id)}>
                <Delete fontSize="small" />
              </Fab>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [projects, handleViewBtnClick, handleEditBtnClick, handleDeleteBtnClick],
  );

  const table = useMaterialReactTable({
    columns,
    data: projects,
    ...GlobalTableCss,
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    state: { isLoading },
  });

  return (
    <>
      <Paper
        variant="elevation"
        component="div"
        className="p-2 sm:p-4 m-2 border border-slate-400 overflow-x-auto box-border"
      >
        <Heading Icon={AccountTree} text="Projects" />

        <Divider sx={{ mb: 4 }} />

        <Box component="div" className="flex items-center justify-end my-2">
          <Button size="small" startIcon={<Add fontSize="small" />} variant="contained" onClick={handleAddBtnClick}>
            Add Project
          </Button>
        </Box>

        <MaterialReactTable table={table} />
      </Paper>

      {detailDialogOpen && (
        <ViewProjectModal
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
        <AddProjectModal
          open={addDialogBoxView}
          handleDialogCloseBtnClick={handleAddDialogBoxClickBtn}
          onAddHandler={getDetails}
        />
      )}

      {editDialogBoxView && (
        <EditProjectModal
          open={editDialogBoxView}
          handleDialogCloseBtnClick={handleDialogCloseBtnClick}
          details={details}
          onAddHandler={getDetails}
        />
      )}

      {isCnfDialogOpen && (
        <ConfirmationDialog
          Icon={HelpCenter}
          heading="Delete Project"
          isLoading={isDeleting}
          open={isCnfDialogOpen}
          text={
            <Typography variant="body1" fontWeight={700} textAlign="justify">
              <span className="text-red-700 font-bold">CAUTION:</span> You&apos;re about to delete this project. Are you
              sure you want to continue?
            </Typography>
          }
          onSuccess={handleCnfDialogOnSuccess}
          onCancel={() => {
            setIsCnfDialogOpen(false);
            setProjectToDeleteId("");
          }}
        />
      )}
    </>
  );
}

export default ProjectsPage;
