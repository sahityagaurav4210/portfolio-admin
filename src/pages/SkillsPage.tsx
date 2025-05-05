import { Button, Fab, Grid2, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import NoDataTableRow from '../components/NoDataTableRow';
import { ApiController, ApiStatus } from '../api';
import { useDialogs } from '@toolpad/core';
import SkillModal from '../models/Skills';
import { Add, Edit } from '@mui/icons-material';
import { ISkillForm } from '../interfaces/models.interface';
import { Grid } from '@mui/system';

function Skills(): ReactNode {
  const [skillsDetails, setSkillsDetails] = useState<ISkillForm[]>([]);
  const [skillId, setSkillId] = useState<string>('');
  const dialogs = useDialogs();
  const windowRef = useRef<Window | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [skills, setSkills] = useState<ISkillForm[]>([]);

  useEffect(() => {
    async function getDetails() {
      const controller = new ApiController();
      const userId = localStorage.getItem('userId');

      const authorization = localStorage.getItem("authorization") as string;
      const details = await controller.GET(`portfolio/${userId}`, `Bearer ${authorization}`);

      if (details.status === ApiStatus.SUCCESS) {
        setSkillsDetails(details?.data?.skillSection || []);
        setSkillId(details?.data._id || '');
      }
    }
    getDetails();
  }, []);

  useEffect(() => {
    const skillCopy = [...skillsDetails];
    const factor = currentPage > 0 ? (currentPage - 1) * 4 : 0;
    setSkills(skillCopy.slice(factor, factor + 4));
  }, [currentPage, skillsDetails]);

  function handlePaginationChange(event: React.ChangeEvent<unknown>, value: number) {
    event.preventDefault();
    console.log("hello ji....", value);

    setCurrentPage(value);
  }

  async function handleSkillAddModal() {
    windowRef.current = window;
    await dialogs.open(SkillModal, { skillId, skills: skillsDetails, windowRef, type: "add", index: -1 });
  }

  async function handleSkillEditModal(index: number) {
    windowRef.current = window;
    await dialogs.open(SkillModal, { skillId, skills: skillsDetails, windowRef, index, type: "edit" });
  }

  return (
    <>
      <Grid2 container px={2}>
        <Grid2 size={2}>
          <p className='text-lg font-bold text-orange-600'>Showing page {currentPage}</p>
        </Grid2>

        <Grid2 size={10} sx={{ display: "flex", justifyContent: "end" }}>
          <Button onClick={handleSkillAddModal} variant='contained' color='warning' startIcon={<Add />}>Add</Button>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} my={2}>
        <Grid2 size={12}>
          <TableContainer component={Paper} className='border border-orange-600 border-dashed'>
            <Table align='center'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }}>Sr No.</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white", maxWidth: 80 }}>Name</TableCell>
                  <TableCell align='center' className='bg-amber-700 max-w-max' style={{ color: "white", }}>Experience</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }} sx={{ minWidth: 200, maxWidth: 450 }}>Description</TableCell>
                  <TableCell align='center' className='bg-amber-700' style={{ color: "white" }} sx={{ maxWidth: 50 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody onClick={async (event) => {
                const tr = (event.target as HTMLElement).closest('tr');
                const index = tr?.dataset.index;

                if (index)
                  await handleSkillEditModal(Number(index));
              }} className='w-full'>
                {!skills.length ? <NoDataTableRow colspan={8} text='No data available' /> : skills?.map((detail: ISkillForm, index: number) => <React.Fragment key={index}>
                  <TableRow className='odd:bg-amber-100 min-w-full' data-index={index}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center' sx={{ maxWidth: 80 }}>{detail.name}</TableCell>
                    <TableCell align='center'>{detail.experience}</TableCell>
                    <TableCell align='justify' sx={{ minWidth: 200, maxWidth: 450 }}>{detail.description}</TableCell>
                    <TableCell align='center' sx={{ maxWidth: 50, minWidth: 25, p: 0.25 }}>
                      <Fab color="warning" aria-label="edit" size='small'>
                        <Edit />
                      </Fab>
                    </TableCell>
                  </TableRow>
                </React.Fragment>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>

        <Grid size={12} display={"flex"} justifyContent={"center"}>
          <Pagination page={currentPage} count={Math.round(skillsDetails.length / 5) + 1} sx={{ mt: 2 }} onChange={handlePaginationChange}></Pagination>
        </Grid>
      </Grid2>
    </>
  );
}

export default Skills;