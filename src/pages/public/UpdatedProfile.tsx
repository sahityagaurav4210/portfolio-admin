import { Box, Divider, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Heading from "../../components/Heading";
import { PeopleAlt } from "@mui/icons-material";
import AppImage from "../../components/AppImage";
import useAppPublicPages from "../../hooks/useAppPublicPages";
import { useSearchParams } from "react-router-dom";
import useAppAlert from "../../hooks/useAppAlert";
import InvalidChangePwdReq from "../../views/InvalidChangePwdReq";
import CWPSAlert from "../../components/CWPSAlert";
import VerifyingRequest from "../../views/VerifyingRequest";
import { IProfilePayload } from "../../interfaces/states.interfaces";
import useAppHelperFn from "../../hooks/useAppHelperFn";
import { Grid } from "@mui/system";
import Notes from "../../components/Notes";

function UpdatedProfile(): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { verifyProfileXuidToken, getPublicProfile } = useAppPublicPages();
  const { getResourceUrl } = useAppHelperFn();
  const [queryParams] = useSearchParams();
  const [isXuidValid, setIsXuidValid] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const [profile, setProfile] = useState<IProfilePayload>();
  const notes = useMemo(
    () => [
      "Please note that due to security compliances this page is viewable once.",
      "As it is a public signed page, so therefore senstive information are not shown here.",
    ],
    [],
  );

  async function verifyXuidToken() {
    const token = queryParams.get("xuid");
    const authorizer = queryParams.get("authorizer");

    if (!token || !authorizer) {
      setIsXuidValid(false);
      return;
    }

    try {
      await verifyProfileXuidToken(token, authorizer);
      const profileResponse = await getPublicProfile(token);

      setProfile(profileResponse.data);
      setIsXuidValid(true);
    } catch (error: any) {
      setIsXuidValid(false);
      setAlert((prev) => ({
        ...prev,
        isOpen: true,
        message: error?.message || "Something went wrong while processing your request, please try again!!!",
      }));
    } finally {
      setIsVerifying(false);
    }
  }

  useEffect(function () {
    setIsVerifying(true);
    verifyXuidToken();
  }, []);

  if (!queryParams.get("xuid") || !isXuidValid) {
    return (
      <Box className="flex flex-col justify-between min-h-screen w-full">
        <InvalidChangePwdReq />
      </Box>
    );
  }

  if (isVerifying) {
    return <VerifyingRequest />;
  }

  return (
    <Paper
      variant="elevation"
      elevation={3}
      className="w-full p-2 sm:p-4 m-2 border border-slate-400 overflow-x-auto box-border"
    >
      <Heading text="Public Profile" Icon={PeopleAlt} />
      <Divider sx={{ mb: 4, mt: 1 }} />

      <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} />

      <Box component="div" className="flex items-center mb-4">
        <Grid container>
          <Grid size={{ xs: 12, lg: 4 }} display="flex" justifyContent={isMobile ? "center" : "start"}>
            <AppImage url={getResourceUrl(profile?.avatar || "/404.jpg")} height="5" width="5" />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <Box component="div" className="flex flex-col justify-center flex-wrap">
              <Typography variant={isMobile ? "h4" : "h2"} fontWeight={700}>
                {profile?.name}
              </Typography>

              <Typography variant="body1" px={2}>
                {profile?.email}
              </Typography>

              <Typography variant="body1" px={2} mb={4}>
                {profile?.address}
              </Typography>

              <Typography variant="h6" fontWeight={700}>
                Available Websites
              </Typography>

              {!profile?.websites?.split(",")?.length && (
                <Typography variant="body1" px={2}>
                  No websites added yet.
                </Typography>
              )}

              <ol className="list-decimal list-inside pl-4 space-y-2 marker:font-bold">
                {profile?.websites?.split(",")?.map((website: string) => (
                  <li key={website}>{website}</li>
                ))}
              </ol>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Notes notes={notes} my={2} />
    </Paper>
  );
}

export default React.memo(UpdatedProfile);
