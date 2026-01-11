import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import React, { ReactNode, useState } from "react";
import { IIPLocModalProp } from "../interfaces/component_props.interface";
import {
  Cancel,
  Flag,
  LocalActivity,
  LocationCity,
  LocationOn,
  Public,
  RadioButtonUnchecked,
  Search,
} from "@mui/icons-material";
import Heading from "../components/Heading";
import { Grid } from "@mui/system";
import { IApiReply } from "../interfaces/api.interface";
import { BtnClick } from "../interfaces";
import NetworkingController from "../controllers/networking.controller";
import { ApiStatus } from "../api";
import useAppAlert from "../hooks/useAppAlert";
import CWPSAlert from "../components/CWPSAlert";

function IPLocModal({
  clientIp,
  isOpen,
  handleModalOnClose,
}: Readonly<IIPLocModalProp>): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipLocDetails, setIpLocDetails] = useState<IApiReply>();
  const { alert, handleAlertOnClose, setAlert } = useAppAlert();

  async function fetchIpLocationDetails(event: BtnClick) {
    event.preventDefault();
    setIsLoading(true);

    const controller = new NetworkingController();
    const response = await controller.makeGetClientIpLocReq(clientIp);

    if (response.status !== ApiStatus.SUCCESS) {
      setAlert((prev) => ({
        ...prev,
        isOpen: true,
        message: response.message,
      }));

      setIsLoading(false);
      return;
    }

    setIpLocDetails(response);
    setIsLoading(false);
  }

  return (
    <Dialog maxWidth="md" fullWidth open={isOpen}>
      <DialogTitle>
        <Box component="div" display="flex" justifyContent="flex-end">
          <IconButton onClick={handleModalOnClose}>
            <Cancel fontSize="medium" color="error" />
          </IconButton>
        </Box>

        <Heading Icon={LocalActivity} text="IP Location Details" />
      </DialogTitle>

      <DialogContent dividers>
        <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} />

        <Grid container my={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="IP Address"
              className="uppercase"
              value={clientIp}
              disabled
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <Public fontSize="small" sx={{ mx: 0.5 }} />,
                },
              }}
            />
          </Grid>
        </Grid>

        <Box component="div" display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            startIcon={
              isLoading ? (
                <CircularProgress size={16} color="secondary" />
              ) : (
                <Search fontSize="small" />
              )
            }
            disabled={isLoading}
            onClick={fetchIpLocationDetails}
          >
            Fetch
          </Button>
        </Box>

        {ipLocDetails?.data && (
          <>
            <Divider sx={{ my: 1 }} />

            <Grid container columnSpacing={1}>
              <Grid size={{ xs: 12, md: 4 }} my={2}>
                <TextField
                  label="Country"
                  value={ipLocDetails?.data?.country}
                  disabled
                  fullWidth
                  multiline
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Flag fontSize="small" sx={{ mx: 0.5 }} />
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} my={2}>
                <TextField
                  label="Region"
                  value={ipLocDetails?.data?.region || "Not available"}
                  disabled
                  fullWidth
                  multiline
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Flag fontSize="small" sx={{ mx: 0.5 }} />
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} my={2}>
                <TextField
                  label="City"
                  value={ipLocDetails?.data?.city || "Not available"}
                  disabled
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <LocationCity fontSize="small" sx={{ mx: 0.5 }} />
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} my={2}>
                <TextField
                  label="Latitude"
                  value={ipLocDetails?.data?.ll[0] || "Not available"}
                  disabled
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <LocationOn fontSize="small" sx={{ mx: 0.5 }} />
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} my={2}>
                <TextField
                  label="Longitude"
                  value={ipLocDetails?.data?.ll[1] || "Not available"}
                  disabled
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <LocationOn fontSize="small" sx={{ mx: 0.5 }} />
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} my={2}>
                <TextField
                  label="Correction Radius (in km)"
                  value={ipLocDetails?.data?.area || "Not available"}
                  disabled
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <RadioButtonUnchecked
                          fontSize="small"
                          sx={{ mx: 0.5 }}
                        />
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(IPLocModal);
