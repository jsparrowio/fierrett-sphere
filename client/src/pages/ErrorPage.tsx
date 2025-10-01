import { useNavigate, useRouteError } from 'react-router-dom';
import '../App.css'
import '../index.css'
import { Button } from 'antd';


const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  console.error(error);
  const navigate = useNavigate();

  return (
    <div className="App" style={{
      minHeight: "100vh"
    }}>
      <div className="landing-container">
        <h1 className="title">The Fierrett Sphere</h1>
        <div className="message-container">
          <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.status}</i><br />
              <i>{error.statusText || error.message}</i>
            </p>
            <Button
              key="home"
              variant="solid"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => navigate("/")}
            >
              <b>Return Home!</b>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
