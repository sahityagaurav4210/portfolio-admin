import { ToastOptions } from "react-toastify";

export function getGlobalToastConfig(): ToastOptions {
    return { autoClose: 4000, theme: "dark" }
}