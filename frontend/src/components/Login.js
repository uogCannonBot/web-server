import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Login() {
  const openDiscord = (e) => {
    e.preventDefault();
    window.open("http://localhost:8080/api/auth/discord", "_self");
  };

  return (
    <>
      <Box height="50px" display="flex" justifyContent="center">
        <Button variant="contained" onClick={openDiscord}>
          Login with Discord
        </Button>
      </Box>
    </>
  );
}
