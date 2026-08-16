import { useState } from "react";
import "../LoginDialog/LoginDialog.jsx";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { InputFieldError, GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";
import { useAuth } from "../context/useAuth.js";
import { useTranslation } from "react-i18next";
import TranslationButton from '../components/TranslationButton.jsx';

function LoginDialog() {

  const { t } = useTranslation();

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  //Login
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async () => {

    setLoadingMessage(t("login.loading"));
    setErrorMessage(null);

    try {
      await login(username, password);
      navigate("/todos");
    } catch (error) {
      const rawError = error?.response?.data ?? { general: t("login.error") };
      setErrorMessage(rawError);
    }
    finally {
      setLoadingMessage(null);
    }
  };

  return (
    <div className="login-container">
      <TranslationButton />
      <h1>{t("login.title")}</h1>

      <div className="login-input-container">
        <input
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("login.input.username")}
        />
        <InputFieldError errorMessage={errorMessage?.username || " "} />
      </div>

      <div className="login-input-container">
        <input
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder={t("login.input.password")}
        />
        <InputFieldError errorMessage={errorMessage?.password || " "} />
      </div>

      <button className="login-button" onClick={handleSubmit}>
        {t("login.submit-button")}
      </button>

      {!loadingMessage && <GeneralError errorMessage={errorMessage?.general || " "} />}
      {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}

      <Link to="/register" className="login-nav-link">{t("login.register-button")}</Link>
    </div>
  );
}

export default LoginDialog;