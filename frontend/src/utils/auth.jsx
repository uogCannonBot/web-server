import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import { Suspense, createContext, useContext, useMemo, useState, useEffect} from "react";
import { useLocation, Navigate, redirect, useLoaderData, Outlet, Await, defer } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useState(userData);

  const logout = async () => {
    const res = await fetch("http://localhost:8080/api/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      }
    });
    if (res.status === 200){
      setUser(null);
    }
  }
  const login = (data) => {
    setUser(data);
  }

  const value = useMemo(() => ({
    user,
    logout,
    login,
  }), [user]);

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

const getUserData = async () => {
  return fetch("http://localhost:8080/api/auth/login/success", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    }
  });
}

export const loader = async () => {
  return getUserData();
  // if (res.status !== 200){
  //   return redirect("/login");
  // }
  // return defer({ data: res.json()});
}

export const RequireAuth = ({ component }) => {
  const { user } = useAuth();
  let location = useLocation();

  console.log("user = ", user);
  if (user == null) {
    console.log('redirecting when user = ', user);
    return <Navigate to="/login"  state={{ from: location }} replace />
  }
  return component;
}

export const AuthLayout = ({children}) => {
  const promise = useLoaderData();
  return(
          <Suspense fallback={<LinearProgress />}>
            <Await
              resolve={promise}
              errorElement={<Alert severity="error">Something went wrong</Alert>}
              children={(data) => {
              console.log('received = ', data);
              const { user } = data;
              console.log("user = ", user);
                return (
                        <AuthProvider userData={user}>
                          <Outlet />
                        </AuthProvider>
                );
              }

              }
            />
          </Suspense>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
}