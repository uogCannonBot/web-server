import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WebhookOutlinedIcon from '@mui/icons-material/WebhookOutlined';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

import {Link, Form} from "react-router-dom";
import {Menu, MenuItem, Sidebar, useProSidebar} from "react-pro-sidebar";
import { useAuth } from "../utils/auth";

const Navbar = () => {
  const theme = useTheme();
  const { logout } = useAuth();

  // sidebar settings
  const { toggleSidebar, broken, collapsed, collapseSidebar} = useProSidebar();
  const logoutHandler = (e) => {
    // todo
    logout();
    e.preventDefault();

  }

  return (
          <Form method="GET" action="logout" onSubmit={logoutHandler}>
            <Sidebar backgroundColor={theme.palette.grey[200]} style={{ height: "100%", display: "flex" }} >
              <Menu>
                  <MenuItem
                    icon={<MenuOutlinedIcon />}
                    onClick={() => {
                      collapseSidebar();
                    }}
                    
                  >
                  {" "}
                  <h2>Dashboard</h2>
                  </MenuItem>
                  <MenuItem
                    icon={<HomeOutlinedIcon />}
                    component={<Link to="/" replace={true}/>}
                  >
                    Home
                  </MenuItem>
                  <MenuItem 
                    icon={<WebhookOutlinedIcon />}
                    component={<Link to="webhooks" />}
                    >
                      Webhooks
                  </MenuItem>
                  <MenuItem
                    icon={<LogoutOutlinedIcon />}
                    type="submit" 
                    onClick={logoutHandler}
                    rootStyles={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                    }}
                   >
                     Logout
                  </MenuItem>      
              </Menu>
              </Sidebar>
            </Form>
          )
}

export default Navbar;