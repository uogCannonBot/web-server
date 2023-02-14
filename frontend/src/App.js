import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { ThemeProvider, createTheme } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import axios from "axios";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  // check users dark/light mode preference
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [user, setUser] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(prefersDarkMode ? 1 : 0);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  // run once every page reload
  useEffect(() => {
    // check if user is authenticated
    const getUser = () => {
      axios
        .get("http://localhost:8080/api/auth/login/success", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) return response.data;
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <div className="fullscreen-wrap"> */}
      <NavigationBar
        user={user}
        setUser={setUser}
        setIsDarkTheme={setIsDarkTheme}
        isDarkTheme={isDarkTheme}
      />
      {}
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        {user ? <Dashboard user={user} /> : <Login />}
      </Container>
      {/* </div> */}
    </ThemeProvider>
  );
}
