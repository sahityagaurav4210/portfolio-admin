import { memo, ReactNode, useEffect, useRef } from "react";
import { ICWPSAlertProp } from "../interfaces/component_props.interface";
import { Alert, Container } from "@mui/material";

function CWPSAlert({
  alert,
  handleAlertOnClose,
  alertType,
  maxWidth,
}: Readonly<ICWPSAlertProp>): ReactNode {
  const alertBoxRef = useRef<HTMLDivElement | null>(null);
  const alertWidth = maxWidth || "xs";
  const type = alertType || "error";

  useEffect(() => {
    if (alert)
      alertBoxRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [alert]);

  if (!alert.isOpen) return <></>;
  return (
    <Container
      component="div"
      maxWidth={alertWidth}
      sx={{ my: 2 }}
      ref={alertBoxRef}
    >
      <Alert
        severity={type}
        variant="filled"
        sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}
        onClose={handleAlertOnClose}
      >
        {alert.message}
      </Alert>
    </Container>
  );
}

export default memo(CWPSAlert);
