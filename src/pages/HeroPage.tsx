import { Box, Button, Card, CardContent, CardHeader, Chip, Divider, Paper, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";
import Heading from "../components/Heading";
import {
  AddHome,
  Edit,
  GitHub,
  Help,
  InfoOutlined,
  MilitaryTech,
  Person,
  Warning,
  Widgets,
  Work,
} from "@mui/icons-material";
import { Grid } from "@mui/system";
import useHeroPage from "../hooks/useHeroPage";
import EditHeroSectionModal from "../models/hero/EditHeroSectionModal";

function HeroPage(): ReactNode {
  const { heroSection, fetchHeroSection } = useHeroPage();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  console.log(heroSection, "section");

  return (
    <>
    <Paper variant="elevation" component="div" className="p-4 m-1 border border-slate-400">
      <Heading Icon={AddHome} text="Hero Section" />
      <Divider />

      <Box component="div" className="flex justify-end items-center my-1">
        <Button
          variant="contained"
          startIcon={<Edit fontSize="small" />}
          type="button"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="h6" className="pl-1">
        Information
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Display Name"
              subheader="Name to be displayed on the navbar of the main web portal."
              avatar={<Person fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {heroSection?.displayName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Designation"
              subheader="The current designation being hold by the user."
              avatar={<MilitaryTech fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {heroSection?.designation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Description"
              subheader="A short description of the user."
              avatar={<Person fontSize="small" />}
            />

            <CardContent>
              <Typography variant="body1">{heroSection?.about}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Typography variant="h6" className="pl-1">
        Analytics
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Total GitHub Contributions"
              subheader="Total active github contributions owned by a user."
              avatar={<GitHub fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {heroSection?.activeGithubContributions ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Years of experience"
              subheader="Total years of expertise owned by this user."
              avatar={<Work fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {heroSection?.experience ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Projects delivered"
              subheader="Total number of projects delivered by this user."
              avatar={<Widgets fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {heroSection?.projectsDelivered ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Coding Question Solved"
              subheader="Total number of questions solved by this user."
              avatar={<Help fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {heroSection?.codingQuestionSolved ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Specializations"
              subheader="Total number of specializations of this user."
              avatar={<Widgets fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {heroSection?.specialization?.length ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Tags"
              subheader="Total number of tags of this user."
              avatar={<Widgets fontSize="small" />}
            />

            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {heroSection?.tags?.length ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Typography variant="h6" className="pl-1">
        Links
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }} className="text-blue-700">
                LinkedIn
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {heroSection?.linkedInUrl}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }} className="text-orange-600">
                Leetcode
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {heroSection?.leetcodeUrl ?? "Not available"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }} className="text-emerald-600">
                Hackerrank
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {heroSection?.hackerrankUrl ?? "Not available"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardContent>
              <Typography variant="h2" sx={{ fontWeight: 700 }} className="text-blue-700">
                Twitter
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {heroSection?.twitterUrl ?? "Not available"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Typography variant="h6" className="pl-1">
        Tags
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Specializations"
              subheader="Area of expertise of this user."
              avatar={<Widgets fontSize="small" />}
            />

            <CardContent>
              {heroSection?.specialization?.map((item) => (
                <Chip
                  label={item?.trim()}
                  key={item}
                  sx={{
                    mr: 1,
                    mb: 1,
                    borderRadius: "8px",
                  }}
                  color="success"
                  icon={<InfoOutlined fontSize="small" />}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="border border-slate-400">
            <CardHeader
              title="Tags"
              subheader="Some important highlights of profile of the user."
              avatar={<Widgets fontSize="small" />}
            />

            <CardContent>
              {heroSection?.tags?.map((item) => (
                <Chip
                  label={item?.trim()}
                  key={item}
                  sx={{
                    mr: 1,
                    mb: 1,
                    borderRadius: "8px",
                  }}
                  color="success"
                  icon={<InfoOutlined fontSize="small" />}
                />
              ))}

              {!heroSection?.tags?.length && (
                <Chip
                  label="Not Available"
                  sx={(theme) => ({
                    mr: 1,
                    mb: 1,
                    borderRadius: "8px",
                    color: "whitesmoke",
                    border: `1px solid ${theme.palette.error.main}`,
                    outline: "none",
                  })}
                  color="error"
                  icon={<Warning fontSize="small" />}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>

      <EditHeroSectionModal
        open={isEditModalOpen}
        details={heroSection}
        handleDialogCloseBtnClick={() => setIsEditModalOpen(false)}
        onAddHandler={fetchHeroSection}
      />
    </>
  );
}

export default React.memo(HeroPage);
