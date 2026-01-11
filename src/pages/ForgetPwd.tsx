import { memo, ReactNode, useState } from "react";
import {
  Button,
  Divider,
  Grid2 as Grid,
  Typography,
  Input,
  FormHelperText,
} from "@mui/material";

import ForgetPwdImg from "../assets/forget-pwd.jpg";
import Footer from "../views/Footer";
import { BtnClick } from "../interfaces";

function ForgetPwd(): ReactNode {
  const [submitBtnStatus, setSubmitBtnStatus] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [otp, setOTP] = useState<number>();

  function handleSubmitBtn(event: BtnClick) {
    event.preventDefault();
  }

  function handleVerifyBtn(event: BtnClick) {
    event.preventDefault();
    setIsVerified((prev) => !prev);
    setSubmitBtnStatus((prev) => !prev);
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={6}>
          <img
            src={ForgetPwdImg}
            alt="Forgot password"
            className="w-full h-full object-contain aspect-square"
          />
        </Grid>

        <Grid size={6}>
          <Typography
            textAlign={"center"}
            variant="h4"
            fontFamily={"Roboto"}
            fontWeight={900}
            className="text-orange-600"
            mb={2}
          >
            Recover your account
          </Typography>

          <Typography
            textAlign="justify"
            variant="caption"
            fontFamily={"Roboto"}
            className="text-neutral-900"
            mb={4}
          >
            Forgot your password? No worries — it happens to the best of us!
            Just enter your registered email address below, and we’ll send you a
            link to reset your password. Follow the instructions in the email to
            regain access to your account.
          </Typography>

          <Divider />

          <Grid container m={2} mt={5}>
            <Grid size={8} mx="auto">
              {!isVerified && (
                <>
                  <Input
                    placeholder="Your registered email"
                    color="warning"
                    endAdornment={
                      <Button
                        sx={{ m: 1, width: 150 }}
                        inputMode="email"
                        color="warning"
                        variant="contained"
                      >
                        get otp
                      </Button>
                    }
                    fullWidth
                    sx={{ mb: 3 }}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <FormHelperText
                    sx={{ mt: -2, px: 0.5, fontSize: "xx-small" }}
                  >
                    Required <sup className=" text-red-700 font-bold">*</sup>
                  </FormHelperText>

                  <Input
                    placeholder="Your OTP"
                    color="warning"
                    inputMode="numeric"
                    type="number"
                    required
                    fullWidth
                    sx={{ mb: 3 }}
                    endAdornment={
                      <Button
                        sx={{ m: 1, width: 85 }}
                        inputMode="email"
                        color="warning"
                        variant="contained"
                        onClick={handleVerifyBtn}
                      >
                        verify
                      </Button>
                    }
                    value={otp}
                    onChange={(e) => setOTP(+e.target.value)}
                  />
                  <FormHelperText
                    sx={{ mt: -2, px: 0.5, fontSize: "xx-small" }}
                  >
                    Required <sup className="text-red-700 font-bold">*</sup>
                  </FormHelperText>
                </>
              )}

              {isVerified && (
                <>
                  <Input
                    placeholder="Your new password"
                    color="warning"
                    inputMode="text"
                    type="password"
                    required
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <FormHelperText
                    sx={{ mt: -2, px: 0.5, fontSize: "xx-small" }}
                  >
                    Required <sup className="text-red-700 font-bold">*</sup>
                  </FormHelperText>

                  <Input
                    placeholder="Confirm your password"
                    inputMode="text"
                    type="password"
                    color="warning"
                    required
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <FormHelperText
                    sx={{ mt: -2, px: 0.5, fontSize: "xx-small" }}
                  >
                    Required <sup className="text-red-700 font-bold">*</sup>
                  </FormHelperText>

                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ mt: 1 }}
                    disabled={submitBtnStatus}
                    onClick={handleSubmitBtn}
                  >
                    Submit
                  </Button>
                </>
              )}
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="caption" sx={{ fontSize: "xx-small" }}>
            All fields marked with asterik{" "}
            <span className="font-bold text-red-600">(*)</span> are mandatory to
            fill.
          </Typography>
        </Grid>
      </Grid>

      <Footer />
    </>
  );
}

export default memo(ForgetPwd);
