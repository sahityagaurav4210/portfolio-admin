import {
  Box,
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "#f1f5f9",
      }}
    >
      {/* ── Left panel: logo background ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: { md: 1, lg: 1.2 },
          minHeight: "100vh",
          position: "relative",
          backgroundImage: "url('/login-bg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "cover",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.78) 100%)",
          },
        }}
      >
      </Box>

      {/* ── Right panel: form ── */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%", lg: "38%", xl: "32%" },
          minWidth: { md: 360 },
          // maxWidth: { md: 480 },
          flexShrink: 0,
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "center",
          minHeight: { xs: "auto", md: "100vh" },
          py: { xs: 5, md: 4 },
          px: { xs: 2.5, sm: 4, md: 4 },
          bgcolor: "white",
          boxShadow: { md: "-6px 0 32px rgba(0,0,0,0.07)" },
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%" }}>

          {/* Mobile: circular logo avatar */}
          <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 3 }}>
            <Box
              component="img"
              src="/logo.jpeg"
              alt="Logo"
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid",
                borderColor: "warning.main",
                boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
              }}
            />
          </Box>

          {/* Headings */}
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800} color="warning.main" mb={0.5}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3.5}>
            Sign in to your admin account to continue.
          </Typography>

          {/* Form */}
          <Grid container spacing={2}>
            {/* Phone */}
            <Grid size={12}>
              <TextField
                label="Phone Number"
                type="tel"
                placeholder="Ex: +919646560135"
                fullWidth
                autoFocus
                autoComplete="off"
                helperText="Include your country code"
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

            {/* Password */}
            <Grid size={12}>
              <TextField
                color="warning"
                label="Password"
                type={inputType}
                fullWidth
                autoComplete="off"
                placeholder="Ex: Abc!123"
                helperText="Min. one capital, one small, one digit, one special character."
                id="password"
                value={loginFrmData?.password}
                onChange={(e) => setLoginFrmData((prev) => ({ ...prev, password: e.target.value }))}
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

            {/* Captcha section */}
            {isCaptchaValidated ? (
              <Grid size={12}>
                <CaptchaValidated />
              </Grid>
            ) : (
              <>
                {/* Captcha image + action buttons in one flex row */}
                <Grid size={12}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box flex={1} display="flex" alignItems="center">
                      {isCaptchaLoading ? (
                        <>
                          <CircularProgress size={16} color="secondary" />
                          <Typography variant="body2" ml={1}>Loading…</Typography>
                        </>
                      ) : (
                        <img src={captchaBlobUri} width={180} height={56} alt="Captcha" style={{ display: "block" }} />
                      )}
                    </Box>

                    <Fab color="info" size="small" onClick={handleRefCaptcha} disabled={isCaptchaLoading}>
                      {isCaptchaLoading ? <CircularProgress size={16} color="secondary" /> : <Replay fontSize="small" />}
                    </Fab>

                    <Fab color="info" size="small" onClick={handleCaptchaAudioBtn} disabled={isCaptchaAudioLoading || isCaptchaLoading}>
                      {isCaptchaAudioLoading ? (
                        <CircularProgress size={16} color="secondary" />
                      ) : (
                        <Headset fontSize="small" />
                      )}
                    </Fab>
                  </Box>
                </Grid>

                <Grid size={12}>
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
                    onChange={(e) => setLoginFrmData((prev) => ({ ...prev, captcha: e.target.value }))}
                    helperText="Exactly 6 alphanumeric characters."
                    sx={{ fontWeight: 700 }}
                  />
                </Grid>
              </>
            )}

            {/* Forgot password */}
            <Grid size={12} display="flex" justifyContent="flex-end" alignItems="center" gap={0.5}>
              <LockReset fontSize="small" color="warning" />
              <Link to="/auth/forgot-pwd" className="text-sm text-orange-500 underline underline-offset-2 font-semibold">
                Forgot password?
              </Link>
            </Grid>

            {/* Action buttons */}
            <Grid size={12} display="flex" columnGap={1.5}>
              {!isCaptchaValidated && (
                <Button
                  variant="contained"
                  onClick={handleCaptchaValidateBtn}
                  startIcon={isCaptchaValidating ? <CircularProgress size={16} /> : <Verified fontSize="small" />}
                  disabled={isCaptchaValidated || isCaptchaValidating}
                  fullWidth
                  color="success"
                >
                  Not a robot
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleLogin}
                startIcon={frmLoading ? <CircularProgress size={16} /> : <LockOpen fontSize="small" />}
                disabled={frmLoading}
                fullWidth
                autoFocus={isCaptchaValidated}
                color="warning"
              >
                Sign In
              </Button>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <FormTermsAndCondition />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
