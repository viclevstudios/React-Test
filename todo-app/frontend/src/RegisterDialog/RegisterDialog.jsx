import { useState } from "react";
import "../LoginDialog/LoginDialog.jsx";
import { useNavigate, Link } from "react-router-dom";
import { InputFieldError, GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";
import "../LoginDialog/LoginDialog.css";
import { useAuth } from "../context/useAuth.js";

function RegisterDialog() {

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const navigate = useNavigate();
  const {register} = useAuth();

  // Registrieren
  const handleSubmit = async () => {

    setLoadingMessage("Account erstellen...");
    setErrorMessage(null);

    try {
      await register(username, password);
      navigate("/todos");
    } catch (error) {
      const rawError = error?.response?.data ?? {general: "Ein Fehler ist aufgetreten. Stelle sicher, dass eine Internetverbindung besteht, oder versuche es später erneut."};;
      console.error('Fehler: ', rawError);
      setErrorMessage(rawError);
    }
    finally {
      setLoadingMessage(null);
    }
  };

  return (
    <div className="login-container">
      <h1>Registrieren</h1>

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

      <button className="login-button" onClick={handleSubmit}>
        Registrieren
      </button>

      {!loadingMessage && <GeneralError errorMessage={errorMessage?.general} />}
      {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}

      <Link to="/login" className="login-nav-link">Anmelden</Link>
    </div>
  );
}

export default RegisterDialog;