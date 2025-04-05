import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./router";

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={AppRoutes}></RouterProvider>
    <ToastContainer />
  </>
);
