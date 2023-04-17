import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { getWebhooks } from "../../../utils/webhooks";
import { useTheme } from "@mui/material/styles";
import Webhook from "../../../components/Webhook";

export const loader = async () => {
  return getWebhooks();
}

const Root = () => {
  const webhooksPromise = useLoaderData();
  const theme = useTheme();
  return(
        <Paper sx={{
          backgroundColor: theme.palette.grey[200],
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "fit-content",
          marginX: "4em",
          height: "24rem",
          borderRadius: "12px",
        }}>
          <Suspense fallback={<LinearProgress />}>
            <Await 
              resolve={webhooksPromise}
              errorElement={<Alert severity="error">Something went wrong</Alert>}
              children={(data) => {
                const { webhooks } = data;
                return (
                  <Stack justifyContent={"center"} alignItems={"center"} spacing={1} sx={{
                    height: "inherit",
                  }}>
                    {
                      webhooks.map(data => <Webhook key={data.webhook_id} data={data}/>)
                    }
                  </Stack>
                );
              }}
            />
          </Suspense>
        </Paper>
  )
}

export default Root;