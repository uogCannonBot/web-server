import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
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

  const [user, setUser] = useState(2);
  const [isDarkTheme, setIsDarkTheme] = useState(prefersDarkMode ? 1 : 0);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  // run once every page reload
  useEffect(() => {
    // check if user is authenticated
    const getUser = () => {
      axios
        .get("http:localhost:8080/api/auth/login/success", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) return response.json();
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
      <div className="fullscreen-wrap">
        <NavigationBar
          user={user}
          setIsDarkTheme={setIsDarkTheme}
          isDarkTheme={isDarkTheme}
        />
        <Routes>
          <Route path="/" element={<Login />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}
