import Button from "@mui/material/Button";

export default function Login() {
  const discord = () => {
    window.open("http://localhost:8080/api/auth/discord", "_self");
  };

  return (
    <>
      <Button color="inherit" onClick={discord}>
        Login with Discord
      </Button>
    </>
  );
}
