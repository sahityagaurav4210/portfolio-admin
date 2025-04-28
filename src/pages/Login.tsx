import { Button, CircularProgress, Divider, Fab, Grid, TextField, } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import FormTermsAndCondition from "../components/FormTermsAndCondition";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ILoginModel } from "../interfaces/models.interface";
import { getGlobalToastConfig } from "../configs/toasts.config";
import { AppPatterns } from "../constants";
import { AppStrings } from "../i18n";
import { LoginController } from "../controllers/login.controller";
import { ApiStatus } from "../api";
import { BtnClick } from "../interfaces";
import { LockOpen, LockReset, Phone, Visibility } from "@mui/icons-material";

function Login(): ReactNode {
  const [loginFrmData, setLoginFrmData] = useState<ILoginModel>({ phone: '', password: '' });
  const [frmLoading, setFrmLoading] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("password");
  const navigate = useNavigate();
  const loginStatus = Boolean(localStorage.getItem("login_status"));

  useEffect(() => {
    if (loginStatus) {
      navigate("/");
      return;
    }
  }, []);

  async function handleLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    const { phone, password } = loginFrmData || {};

    if (!phone || !password) {
      toast.warning(AppStrings.LOGIN.ERR_MSGS.FIELD_REQ, getGlobalToastConfig());
      return;
    }

    if (!AppPatterns.phone.test(phone)) {
      toast.warning(AppStrings.LOGIN.ERR_MSGS.INV_PHONE, getGlobalToastConfig());
      return;
    }
    if (!AppPatterns.pwd.test(password)) {
      toast.warning(AppStrings.LOGIN.ERR_MSGS.INV_PWD, getGlobalToastConfig());
      return;
    }

    setFrmLoading(true);

    const controller = new LoginController();
    const reply = await controller.makePostLoginReq("authentication/login", loginFrmData);

    setFrmLoading(false);

    if (reply.status === ApiStatus.SUCCESS) {
      localStorage.setItem("token", reply?.data?.refresh_token);
      localStorage.setItem("authorization", reply?.data?.access_token);
      localStorage.setItem("username", reply?.data?.name);
      localStorage.setItem("userId", reply?.data?._id);
      localStorage.setItem("login_status", "true");
      toast.success(reply.message, getGlobalToastConfig());
      navigate("/");
    }
    else {
      toast.error(reply.message, getGlobalToastConfig());
      setLoginFrmData({});
    }
  }

  function handlePwdClick(event: BtnClick) {
    event.preventDefault();
    if (inputType === "password")
      setInputType("text");
    else setInputType("password");
  }
  return (
    <>
      <Grid container height="100vh" className="login-bg">
        <Grid
          item
          bgcolor="white"
          xs={12}
          md={6}
          p={1}
          py={4}
          borderRadius={2}
          sx={{
            margin: "auto",
            marginX: { xs: 1, md: "auto" },
          }}
        >
          <h1 className="text-3xl font-bold text-center text-orange-500 underline underline-offset-2 decoration-dashed" style={{ fontFamily: "Roboto" }}>LOGIN FORM</h1>
          <p className="text-xs mt-4 px-1 font-bold" >Welcome back! Just pop in your phone number and password below to quickly sign in and get started.</p>

          <Grid container spacing={1} marginTop={0.25}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                type="tel"
                placeholder="Ex: +919646560135"
                fullWidth
                autoComplete="off"
                focused
                helperText="It should contain country code also"
                error={false}
                id="email"
                inputMode="tel"
                value={loginFrmData?.phone}
                onChange={e => setLoginFrmData(prev => ({ ...prev, phone: e.target.value }))}
                color="warning"
                slotProps={{ input: { startAdornment: <Fab tabIndex={-1} color="warning" variant="extended" size="small" sx={{ mr: 1 }} ><Phone fontSize="small" /></Fab> } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                color="warning"
                label="Password"
                type={inputType}
                fullWidth
                autoComplete="off"
                placeholder="Ex: Abc!123"
                helperText="It should contain at least one capital, one small, one digit and one special character."
                id="password"
                value={loginFrmData?.password}
                onChange={e => setLoginFrmData(prev => ({ ...prev, password: e.target.value }))}
                slotProps={{ input: { endAdornment: <Fab color="warning" variant="extended" size="small" onClick={handlePwdClick}><Visibility fontSize="small" /></Fab> } }}
              />
            </Grid>

            <Grid item xs={4} md={6}>
              <Button
                variant="contained"
                sx={{ width: { xs: "100%", md: "50%" } }}
                onClick={handleLogin}
                startIcon={frmLoading ? <CircularProgress size={16} /> : <LockOpen fontSize="small" />}
                disabled={frmLoading}
                color="warning"
                fullWidth
              >
                LOGIN
              </Button>
            </Grid>

            <Grid
              item
              xs={8}
              md={6}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <LockReset fontSize="small" color="warning" />
              <Link to="/forgot-pwd" className="text-base text-orange-500 underline underline-offset-2 font-semibold">Forgot your password</Link>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <FormTermsAndCondition />
          </Grid>
        </Grid>
      </Grid >
    </>
  );
}

export default Login;
