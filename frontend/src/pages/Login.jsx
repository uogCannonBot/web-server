import React, {useEffect} from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import { useAuth } from "../utils/auth";
import { Navigate, useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const { user } = useAuth();
  if (user){
    return <Navigate to="/" state={{from: location  }}  replace/>;
  }

  const openDiscord = (e) => {
    window.open("http://localhost:8080/api/auth/discord", "_self");
  }

  return(
      <Container sx={{ display: "flex", aspectRatio: "auto 1.618" }}>
          <Button type={"button"} onClick={openDiscord} variant="contained" sx={{
            height: "4rem",
            width: "12rem",
            margin: "auto",
          }}>Login with Discord</Button>
      </Container>
  );
}

export default Login;