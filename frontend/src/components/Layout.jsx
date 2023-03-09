import { useEffect } from "react";
import Box from "@mui/material/Box";
import {AuthProvider, useAuth} from "../utils/auth";
import {Outlet, useLoaderData, redirect, Navigate} from "react-router-dom";
import Navbar from "./Navbar";
const Layout = () => {
  const { user } = useAuth();

  return (
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
  )
}

export default Layout;