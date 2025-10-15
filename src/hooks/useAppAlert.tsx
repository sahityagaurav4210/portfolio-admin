import { useCallback, useState } from "react";
import { IAlert } from "../interfaces/hooks.interface";

function useAppAlert() {
  const [alert, setAlert] = useState<IAlert>({ isOpen: false, message: "" });

  const handleAlertOnClose = useCallback(function () {
    setAlert(prev => ({ ...prev, isOpen: false, message: "" }));
  }, [alert]);

  return { alert, setAlert, handleAlertOnClose };
}

export default useAppAlert;