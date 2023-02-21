import Container from "@mui/material/Container";
import {Outlet} from "react-router-dom";


export async function loader(){
  console.log("TODO: root loader");
  return null;
}

export async function action(){
  console.log("TODO: root action");
  return null;
}

export default function Root(){
  return(
      <>
        <Container>
          <Outlet />
        </Container>
      </>
  )
}