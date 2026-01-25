import {
  Button,
  CircularProgress,
  Divider,
  Fab,
  Grid2 as Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import { Headset, LockOpen, LockReset, Phone, Replay, Security, Verified, Visibility } from "@mui/icons-material";
import CaptchaValidated from "../components/CaptchaValidated";

function Login(): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loginFrmData, setLoginFrmData] = useState<ILoginModel>({
    phone: "",
    password: "",
    captcha: "",
  });
  const [frmLoading, setFrmLoading] = useState<boolean>(false);
  const [isCaptchaAudioLoading, setIsCaptchaAudioLoading] = useState<boolean>(false);
  const [isCaptchaValidated, setIsCaptchaValidated] = useState<boolean>(false);
  const [isCaptchaValidating, setIsCaptchaValidating] = useState<boolean>(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState<boolean>(false);
  const [captchaId, setCaptchaId] = useState<number>(0);
  const [captchaBlobUri, setCaptchaBlobUri] = useState<string>("");
  const [inputType, setInputType] = useState<string>("password");
  const navigate = useNavigate();
  const loginStatus = Boolean(localStorage.getItem("login_status"));

  async function loadCaptcha() {
    const controller = new LoginController();
    const response = await controller.makeGetCaptchaReq("captcha");

    if (response.status !== ApiStatus.SUCCESS) {
      toast.error(response.message, getGlobalToastConfig());
      setIsCaptchaLoading(false);
      return;
    }

    setCaptchaId(response.data.captchaId);
  }

  async function loadCaptchaImage() {
    const controller = new LoginController();
    const response = await controller.makeGetCaptchaImgReq(captchaId);

    if (!(response instanceof Blob)) {
      toast.error(response.message, getGlobalToastConfig());
      setIsCaptchaLoading(false);
      return;
    }

    setCaptchaBlobUri(URL.createObjectURL(response));
    setIsCaptchaLoading(false);
  }

  useEffect(() => {
    if (loginStatus) {
      navigate("/");
      return;
    }

    setIsCaptchaLoading(true);
    loadCaptcha();
  }, []);

  useEffect(() => {
    const captchaTimeout = Number(import.meta.env.VITE_CAPTCHA_TIMEOUT) || 1;
    const timeout = captchaTimeout * 60 * 1000;

    const intervalId = setInterval(() => {
      loadCaptcha();
    }, timeout);

    return function () {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (captchaId) {
      loadCaptchaImage();
    }
  }, [captchaId]);

  async function handleRefCaptcha(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    setIsCaptchaLoading(true);

    const controller = new LoginController();
    const response = await controller.makeGetRefCaptchaReq("ref-captcha", captchaId);

    if (response.status !== ApiStatus.SUCCESS) {
      setIsCaptchaLoading(false);
      toast.error(response.message, getGlobalToastConfig());
      return;
    }

    await loadCaptchaImage();
  }

  async function handleCaptchaAudioBtn(): Promise<void> {
    setIsCaptchaAudioLoading(true);

    const controller = new LoginController();
    const response = await controller.makeGetCaptchaAudioReq(captchaId);

    if (!(response instanceof Blob)) {
      setIsCaptchaAudioLoading(false);
      toast.error(response.message, getGlobalToastConfig());
      return;
    }

    const url = URL.createObjectURL(response);
    const audio = new Audio(url);

    await audio.play();
    setIsCaptchaAudioLoading(false);
  }

  async function handleCaptchaValidateBtn(): Promise<void> {
    if (!loginFrmData.captcha) {
      toast("Please enter a valid captcha", getGlobalToastConfig());
      return;
    }

    setIsCaptchaValidating(true);

    const controller = new LoginController();
    const response = await controller.makeGetCaptchaValidateReq(captchaId, loginFrmData.captcha);

    if (response.status !== ApiStatus.SUCCESS) {
      setIsCaptchaValidating(false);
      toast.error(response.message, getGlobalToastConfig());
      return;
    }

    setIsCaptchaValidated(true);
    setIsCaptchaValidating(false);
  }

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
    const payload = { phone: loginFrmData.phone, password: loginFrmData.password, captchaId };
    const reply = await controller.makePostLoginReq("authentication/login", payload);

    setFrmLoading(false);

    if (reply.status === ApiStatus.SUCCESS) {
      localStorage.setItem("token", reply?.data?.refresh_token);
      localStorage.setItem("authorization", reply?.data?.access_token);
      localStorage.setItem("username", reply?.data?.name);
      localStorage.setItem("userId", reply?.data?._id);
      localStorage.setItem("login_status", "true");
      localStorage.setItem("email", reply?.data?.email);

      toast.success(reply.message, getGlobalToastConfig());
      navigate("/");
    } else {
      toast.error(reply.message, getGlobalToastConfig());
    }
  }

  function handlePwdClick(event: BtnClick) {
    event.preventDefault();
    if (inputType === "password") setInputType("text");
    else setInputType("password");
  }

  return (
    <Grid container className="min-h-screen login-bg py-2 md:py-0">
      <Grid
        size={{ xs: 12, md: 6 }}
        px={1}
        py={4}
        borderRadius={2}
        className="bg-white mx-1 md:mx-auto my-auto border-2 border-spacing-2 border-orange-400 ring-2 ring-offset-2 ring-orange-600"
      >
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight={700}
          className="text-orange-600 underline underline-offset-4 decoration-dotted"
        >
          LOGIN PORTAL
        </Typography>

        <Typography variant="body1" my={2} fontWeight={700} className="text-justify">
          Welcome back! Just pop in your phone number and password below to quickly sign in and get started.
        </Typography>

        <Grid container spacing={1} marginTop={0.25}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone Number"
              type="tel"
              placeholder="Ex: +919646560135"
              fullWidth
              autoFocus
              autoComplete="off"
              className="font-bold"
              focused
              helperText="It should contain country code also"
              error={false}
              id="email"
              inputMode="tel"
              value={loginFrmData?.phone}
              onChange={(e) => setLoginFrmData((prev) => ({ ...prev, phone: e.target.value }))}
              color="warning"
              slotProps={{
                input: {
                  startAdornment: (
                    <Fab tabIndex={-1} color="warning" variant="extended" size="small" sx={{ mr: 1 }}>
                      <Phone fontSize="small" />
                    </Fab>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              color="warning"
              label="Password"
              type={inputType}
              fullWidth
              autoComplete="off"
              placeholder="Ex: Abc!123"
              className="font-bold"
              helperText="It should contain at least one capital, one small, one digit and one special character."
              id="password"
              value={loginFrmData?.password}
              onChange={(e) =>
                setLoginFrmData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <Fab color="warning" variant="extended" size="small" onClick={handlePwdClick}>
                      <Visibility fontSize="small" />
                    </Fab>
                  ),
                },
              }}
            />
          </Grid>

          {isCaptchaValidated ? (
            <Grid size={12}>
              <CaptchaValidated />
            </Grid>
          ) : (
            <>
              <Grid size={{ xs: 8, md: 3 }} display="flex" alignItems="center" mt={2}>
                {isCaptchaLoading ? (
                  <>
                    <CircularProgress size={16} color="secondary" />
                    <Typography variant="body1">Loading captcha, please wait...</Typography>
                  </>
                ) : (
                  <img src={captchaBlobUri} width={200} height={60} alt="Captcha"></img>
                )}
              </Grid>

              <Grid size={{ xs: 2, md: 1 }} display="flex" alignItems="center" mt={2}>
                <Fab color="info" onClick={handleRefCaptcha} disabled={isCaptchaLoading}>
                  {isCaptchaLoading ? <CircularProgress size={16} color="secondary" /> : <Replay fontSize="small" />}
                </Fab>
              </Grid>

              <Grid size={{ xs: 2, md: 1 }} display="flex" alignItems="center" mt={2}>
                <Fab color="info" onClick={handleCaptchaAudioBtn} disabled={isCaptchaAudioLoading || isCaptchaLoading}>
                  {isCaptchaAudioLoading ? (
                    <CircularProgress size={16} color="secondary" />
                  ) : (
                    <Headset fontSize="small" />
                  )}
                </Fab>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} mt={2} offset={isMobile ? 0 : 1}>
                <TextField
                  label="Captcha"
                  type="text"
                  fullWidth
                  color="warning"
                  autoComplete="off"
                  id="captcha"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Fab tabIndex={-1} color="warning" variant="extended" size="small" sx={{ mr: 1 }}>
                          <Security fontSize="small" sx={{ color: "white" }} />
                        </Fab>
                      ),
                    },
                  }}
                  value={loginFrmData?.captcha || ""}
                  onChange={(e) =>
                    setLoginFrmData((prev) => ({
                      ...prev,
                      captcha: e.target.value,
                    }))
                  }
                  helperText="It should contain only alphabets and numeric characters. It must be exactly 6 characters long."
                  sx={{ fontWeight: 700 }}
                />
              </Grid>
            </>
          )}

          <Grid size={4} offset={8} display="flex" justifyContent="flex-end" alignItems="center">
            <LockReset fontSize="small" color="warning" />
            <Link to="/forgot-pwd" className="text-base text-orange-500 underline underline-offset-2 font-semibold">
              Forgot your password
            </Link>
          </Grid>

          <Grid size={12} display="flex" columnGap={2}>
            {!isCaptchaValidated && (
              <Button
                variant="contained"
                onClick={handleCaptchaValidateBtn}
                startIcon={isCaptchaValidating ? <CircularProgress size={16} /> : <Verified fontSize="small" />}
                disabled={isCaptchaValidated || isCaptchaValidating}
                fullWidth
                color="success"
              >
                I am not a robot
              </Button>
            )}

            <Button
              variant="contained"
              onClick={handleLogin}
              startIcon={frmLoading ? <CircularProgress size={16} /> : <LockOpen fontSize="small" />}
              disabled={frmLoading}
              fullWidth
              autoFocus={isCaptchaValidated}
            >
              Login in your account
            </Button>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <FormTermsAndCondition />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Login;
