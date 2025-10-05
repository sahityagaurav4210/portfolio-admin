import { Box, Button, Divider, Fab, Paper, } from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ApiController, ApiStatus } from '../api';
import { Add, Edit, Visibility, Widgets } from '@mui/icons-material';
import { ISkillForm } from '../interfaces/models.interface';
import { getArrayRecords } from '../helpers';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { BtnClick } from '../interfaces';
import Heading from '../components/Heading';
import AddSkillModal from '../models/skills/AddSkillModal';
import ViewModal from '../models/ViewModal';
import EditSkillModal from '../models/skills/EditSkillModal';

function Skills(): ReactNode {
  const [skills, setSkills] = useState<ISkillForm[]>([]);
  const [details, setDetails] = useState<ISkillForm>();
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [addDialogBoxView, setAddDialogBoxView] = useState<boolean>(false);
  const [editDialogBoxView, setEditDialogBoxView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getDetails() {
    const controller = new ApiController();

    const authorization = localStorage.getItem("authorization") as string;
    const details = await controller.GET(`portfolio/skills/list`, `Bearer ${authorization}`);

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

  const handleViewBtnClick = useCallback(function (id: number) {
    setDetails(skills[id - 1]);
    setDetailDialogOpen(true);
  }, [skills]);

  const handleEditBtnClick = useCallback(function (id: number) {
    setDetails(skills[id - 1]);
    setEditDialogBoxView(true);
  }, [skills]);

  const handleAddDialogBoxClickBtn = useCallback(function () {
    setAddDialogBoxView(false);
  }, [addDialogBoxView]);

  const handleAddBtnClick = useCallback(function () {
    setAddDialogBoxView(true);
  }, [addDialogBoxView]);

  const handleDialogCloseBtnClick = useCallback(function (e: BtnClick) {
    e.preventDefault();
    setDetails(undefined);

    setDetailDialogOpen(false);
    setEditDialogBoxView(false);
  }, []);


  const columns = useMemo(() => [
    { accessorKey: "id", header: "S.No." },
    { accessorKey: "name", header: "Skill Name" },
    { accessorKey: "experience", header: "Experience" },
    {
      accessorKey: "actions", header: "Actions", Cell: ({ row }: Record<string, any>) => {
        return (
          <Box component="div" className='flex gap-2'>
            <Fab color='primary' size='small' onClick={() => handleViewBtnClick(row?.original?.id)}>
              <Visibility fontSize='small' />
            </Fab>

            <Fab color='warning' size='small' onClick={() => handleEditBtnClick(row?.original?.id)}>
              <Edit fontSize='small' />
            </Fab>
          </Box>
        );
      }
    }
  ], [skills]);

  const table = useMaterialReactTable({
    columns,
    data: skills,
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
      <Paper variant="elevation" component="div" className="p-4 m-0 sm:m-1 border border-slate-400">
        <Heading Icon={Widgets} text="Skills" />

        <Divider sx={{ mb: 4 }} />

        <Box component="div" className='flex items-center justify-end my-2'>
          <Button size='small' startIcon={<Add fontSize='small' />} variant='contained' onClick={handleAddBtnClick}>Add</Button>
        </Box>

        <MaterialReactTable table={table} />
      </Paper>

      {
        detailDialogOpen &&
        <ViewModal
          details={details}
          handleDialogCloseBtnClick={handleDialogCloseBtnClick}
          open={detailDialogOpen}
          text='Skill Details'
        />
      }

      {
        addDialogBoxView &&
        <AddSkillModal
          open={addDialogBoxView}
          handleDialogCloseBtnClick={handleAddDialogBoxClickBtn}
          onAddHandler={getDetails}
        />
      }

      {
        editDialogBoxView &&
        <EditSkillModal
          open={editDialogBoxView}
          handleDialogCloseBtnClick={handleDialogCloseBtnClick}
          details={details}
          onAddHandler={getDetails}
        />
      }
    </>
  );
}

export default Skills;