import React from "react"
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ProSidebarProvider} from "react-pro-sidebar";
import "./index.css";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import { Dashboard, webhookLoader, Root } from "./pages/dashboard";
import { AuthLayout, AuthProvider, RequireAuth, loader as authLoader } from "./utils/auth";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    loader: authLoader,
    children: [
      {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <RequireAuth component={<Dashboard />}/>,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "webhooks",
            loader: webhookLoader,
            element: <RequireAuth component={<Root /> } />,
          }
        ],
      },
    ],
  },
], );

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ProSidebarProvider>
          <AuthProvider userData={null}>
            <RouterProvider router={router} />
          </AuthProvider>
        </ProSidebarProvider>
      </LocalizationProvider>
    </React.StrictMode>
)