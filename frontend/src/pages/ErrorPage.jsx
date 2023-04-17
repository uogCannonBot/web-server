import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
      <div id={"errorPage"}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error occurred</p>
        <p>
          {error.statusText || error.message}
        </p>
      </div>
  )
};

export default ErrorPage;