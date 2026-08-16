import { useState } from "react";
import axios from 'axios';
import "../LoginDialog/LoginDialog.jsx";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { InputFieldError, GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";

function LoginDialog() {

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  //Login
  const navigate = useNavigate();
  const login = async () => {

    setLoadingMessage("Anmelden...");
    setErrorMessage(null);

    try {
      await axios.post('http://localhost:3000/api/login', {username: username, password: password}, {withCredentials: true});
      setLoadingMessage(null);
      navigate("/todos");
    } catch (error) {
      const rawError = error?.response?.data ?? {general: "Ein Fehler ist aufgetreten. Stelle sicher, dass eine Internetverbindung besteht, oder versuche es später erneut."};
      console.error('Fehler: ', rawError);
      setErrorMessage(rawError);
    }
    finally {
      setLoadingMessage(null);
    }
  };

  return (
    <div className="login-container">
      <h1>Anmelden</h1>

      <div className="login-input-container">
        <input
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <InputFieldError errorMessage={errorMessage?.username || " "} />
      </div>

      <div className="login-input-container">
        <input
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <InputFieldError errorMessage={errorMessage?.password || " "} />
      </div>

      <button className="login-button" onClick={login}>
        Anmelden
      </button>

      {!loadingMessage && <GeneralError errorMessage={errorMessage?.general || " "} />}
      {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}

      <Link to="/register" className="login-nav-link">Account erstellen</Link>
    </div>
  );
}

export default LoginDialog;