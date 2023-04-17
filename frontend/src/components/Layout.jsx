import { useEffect } from "react";
import {AuthProvider, useAuth} from "../utils/auth";
import {Outlet, useLoaderData, redirect, Navigate} from "react-router-dom";

import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./Navbar";

const theme = createTheme();

const Layout = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: "flex",
        height: "100vh",
        margin: 0,
      }}>
        { user && <Navbar /> }
          <Box id={"content"} sx={{ 
            width: "100%", 
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            }}>
            <Outlet />
          </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Layout;