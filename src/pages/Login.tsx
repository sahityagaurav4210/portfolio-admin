import { Button, CircularProgress, Grid, TextField, } from "@mui/material";
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

function Login(): ReactNode {
  const [loginFrmData, setLoginFrmData] = useState<ILoginModel>({ phone: '', password: '' });
  const [frmLoading, setFrmLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const loginStatus = Boolean(localStorage.getItem("login_status"));

  useEffect(() => {
    if (loginStatus) {
      navigate("/home");
      return;
    }
  }, [])

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
      localStorage.setItem("token", reply?.data?.refresh_token)
      localStorage.setItem("authorization", reply?.data?.access_token)
      localStorage.setItem("username", reply?.data?.name)
      localStorage.setItem("login_status", "true");
      toast.success(reply.message, getGlobalToastConfig());
      navigate("/home");
    }
    else {
      toast.error(reply.message, getGlobalToastConfig())
      setLoginFrmData({});
    }
  }

  return (
    <>
      <Grid container height="100vh" className="bg-neutral-50">
        <Grid
          item
          bgcolor="white"
          xs={12}
          md={6}
          border={1}
          p={1}
          py={4}
          borderRadius={2}
          sx={{
            margin: "auto",
            marginX: { xs: 1, md: "auto" },
            boxShadow: "0px 0px 0.25rem 0.25rem grey",
          }}
        >
          <h1 className="text-3xl font-bold text-center text-orange-400" style={{ fontFamily: "Roboto" }}>LOGIN FORM</h1>
          <Grid container spacing={1} marginTop={0.25}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                type="tel"
                placeholder="Ex: +919646560135"
                fullWidth
                focused
                helperText="It should contain country code also"
                error={false}
                id="email"
                value={loginFrmData?.phone}
                onChange={e => setLoginFrmData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                placeholder="Ex: Abc!123"
                helperText="It should contain at least one capital, one small, one digit and one special character."
                id="password"
                value={loginFrmData?.password}
                onChange={e => setLoginFrmData(prev => ({ ...prev, password: e.target.value }))}
              />
            </Grid>

            <Grid item xs={4}>
              <Button
                variant="contained"
                sx={{ width: { xs: "100%", md: "50%" } }}
                onClick={handleLogin}
                startIcon={frmLoading && <CircularProgress size={16} />}
                disabled={frmLoading}
              >
                LOGIN
              </Button>
            </Grid>

            <Grid
              item
              xs={8}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Link to="/forgot-pwd" className="text-base text-blue-500 underline underline-offset-2 font-semibold">Forgot your password</Link>
            </Grid>

            <FormTermsAndCondition />
          </Grid>
        </Grid>
      </Grid >
    </>
  );
}

export default Login;
