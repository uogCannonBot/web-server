import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Webhook = ({ data }) => {
  const theme = useTheme();
  console.log(data);
  return (
    <Box sx={{
      backgroundColor: theme.palette.grey[400],
      borderRadius: "4px",
      width: "80%",
    }}>
      <Typography variant={"body1"}>
        {data.name}
      </Typography>
      <Link to={`webhooks/${data.webhook_id}`} />
    </Box>
  );
}

export default Webhook;