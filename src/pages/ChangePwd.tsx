import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Paper,
  TextField,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import { Visibility, VisibilityOff, Edit } from "@mui/icons-material";
import PasswordIcon from "@mui/icons-material/Password";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAppCss from "../hooks/useAppCss";
import Notes from "../components/Notes";
import { IChangePwd } from "../interfaces/models.interface";
import { BtnClick, InputChange } from "../interfaces";
import useAppAlert from "../hooks/useAppAlert";
import CWPSAlert from "../components/CWPSAlert";
import { ApiStatus } from "../api";
import LayoutController from "../controllers/layout.controller";
import Footer from "../views/Footer";
import ModalHeading from "../components/headings/ModalHeading";
import InvalidChangePwdReq from "../views/InvalidChangePwdReq";
import { toast } from "react-toastify";
import { getGlobalToastConfig } from "../configs/toasts.config";

function ChangePwd(): React.ReactNode {
  const [changePwdForm, setChangePwdForm] = useState<IChangePwd>();
  const { RequiredFieldCss, AlignItemsCss, FlexCss, JustifyItemsEndCss } = useAppCss();
  const notes = useMemo(
    () => [
      "All fields marked with asterisk are mandatory to fill.",
      "Password must be atleast 8 characters long.",
      "Password must contain atleast one captial, one small, one digit and one special character.",
      "Only @,$,! and % special characters are allowed.",
    ],
    [],
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const [isXuidValid, setIsXuidValid] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const { alert, handleAlertOnClose, setAlert } = useAppAlert();
  const [isVisible, setIsVisible] = useState(false);
  const [isNewPwdVisible, setIsNewPwdVisible] = useState(false);
  const [isCnfPwdVisible, setIsCnfPwdVisible] = useState(false);

  const handleInputOnChange = useCallback(function (e: InputChange) {
    const { name, value } = e.target;
    setChangePwdForm((prev) => ({ ...(prev as IChangePwd), [name]: value }));
  }, []);

  async function verifyXuidToken() {
    const xuid = queryParams.get("xuid") as string;
    const xuidAuthorizer = queryParams.get("authorizer") as string;
    const controller = new LayoutController();

    try {
      const response = await controller.makeGetVerifyXuidTokenReq(xuid, xuidAuthorizer);

      if (response.status !== ApiStatus.SUCCESS) throw new Error(response.message);
      setIsXuidValid(true);
    } catch (error: any) {
      setAlert((prev) => ({
        ...prev,
        isOpen: true,
        message: error?.message || "Something went wrong while processing your request, please try again!!!",
      }));
      setIsXuidValid(false);
    } finally {
      setIsVerifying(false);
    }
  }

  const handleChangePwdButton = useCallback(
    async function (e: BtnClick) {
      e.preventDefault();
      setIsEditing(true);

      if (!changePwdForm) {
        setAlert((prev) => ({
          ...prev,
          isOpen: true,
          message: "Please fill-up the form completely and correctly!!!",
        }));
        setIsEditing(false);
        return;
      }

      const { newPwd, cnfNewPwd, oldPwd } = changePwdForm;

      if (newPwd !== cnfNewPwd) {
        setAlert((prev) => ({
          ...prev,
          isOpen: true,
          message: "Your password do not match, please correct it!!!",
        }));
        setIsEditing(false);
        return;
      }

      try {
        const controller = new LayoutController();
        const payload = { newPwd, oldPwd, token: queryParams.get("xuid") as string };
        const response = await controller.makePublicChangePwdReq(payload);

        if (response.status !== ApiStatus.SUCCESS) throw new Error(response.message);

        toast.success("Your password has been changed successfully!!!", getGlobalToastConfig());
        await navigate("/auth/login");
      } catch (error: any) {
        const message = error?.message || "Something went wrong while processing your request, please try again!!!";

        setAlert((prev) => ({ ...prev, isOpen: true, message }));
      } finally {
        setIsEditing(false);
      }
    },
    [changePwdForm, navigate, setAlert],
  );

  function handlePwdClick(event: BtnClick) {
    event.preventDefault();
    setIsVisible((prev) => !prev);
  }

  function handleNewPwdClick(event: BtnClick) {
    event.preventDefault();
    setIsNewPwdVisible((prev) => !prev);
  }

  function handleCnfPwdClick(event: BtnClick) {
    event.preventDefault();
    setIsCnfPwdVisible((prev) => !prev);
  }

  useEffect(() => {
    setIsVerifying(true);

    setTimeout(() => {
      verifyXuidToken();
    }, 2000);
  }, []);

  if (!queryParams.get("xuid") || !isXuidValid) {
    return (
      <Box className="flex flex-col justify-between min-h-screen w-full">
        <InvalidChangePwdReq />
        <Footer />
      </Box>
    );
  }

  if (isVerifying) {
    return (
      <Box component="div" className="flex flex-col justify-between min-h-screen w-full">
        <Box component="div" className="h-full flex items-center justify-center gap-x-2">
          <CircularProgress size={16} color="secondary" />
          <Typography variant="body1" color="secondary">
            Verifying request...
          </Typography>
        </Box>

        <Footer />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col justify-between min-h-screen w-full">
      <Paper variant="elevation" elevation={3} component="div" className="mx-2 md:mx-auto my-4 border border-slate-400">
        <Container maxWidth="xl" className="my-10 flex-grow">
          <Box mb={4}>
            <ModalHeading Icon={PasswordIcon} text="Change Password" />
          </Box>

          <CWPSAlert alert={alert} handleAlertOnClose={handleAlertOnClose} />

          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                label="Current Password"
                type={isVisible ? "text" : "password"}
                inputMode="text"
                autoFocus
                required
                fullWidth
                sx={RequiredFieldCss}
                helperText="Please enter your current password, i.e., the one which you've used during the sign-in process."
                name="oldPwd"
                value={changePwdForm?.oldPwd || ""}
                onChange={handleInputOnChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Fab color="warning" variant="extended" size="small" onClick={handlePwdClick}>
                        {isVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </Fab>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="New Password"
                required
                fullWidth
                sx={RequiredFieldCss}
                helperText="Please enter your new password. It should match the criteria given below."
                name="newPwd"
                value={changePwdForm?.newPwd || ""}
                onChange={handleInputOnChange}
                type={isNewPwdVisible ? "text" : "password"}
                inputMode="text"
                slotProps={{
                  input: {
                    endAdornment: (
                      <Fab color="warning" variant="extended" size="small" onClick={handleNewPwdClick}>
                        {isNewPwdVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </Fab>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Confirm Password"
                required
                fullWidth
                sx={RequiredFieldCss}
                helperText="Please re-enter your new password. It should match with your new password."
                name="cnfNewPwd"
                value={changePwdForm?.cnfNewPwd || ""}
                onChange={handleInputOnChange}
                type={isCnfPwdVisible ? "text" : "password"}
                inputMode="text"
                slotProps={{
                  input: {
                    endAdornment: (
                      <Fab color="warning" variant="extended" size="small" onClick={handleCnfPwdClick}>
                        {isCnfPwdVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </Fab>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box component="div" sx={{ mb: 4 }}>
            <Notes notes={notes} />
          </Box>

          <Box component="div" sx={{ ...FlexCss, ...AlignItemsCss, ...JustifyItemsEndCss }}>
            <Button
              disabled={
                isEditing ||
                changePwdForm?.cnfNewPwd !== changePwdForm?.newPwd ||
                !changePwdForm?.cnfNewPwd ||
                !changePwdForm.newPwd
              }
              onClick={handleChangePwdButton}
              startIcon={isEditing ? <CircularProgress size={16} color="secondary" /> : <Edit fontSize="small" />}
              variant="contained"
              color="success"
              sx={{ color: "white" }}
            >
              Change Password
            </Button>
          </Box>
        </Container>
      </Paper>

      <Footer />
    </Box>
  );
}

export default React.memo(ChangePwd);
