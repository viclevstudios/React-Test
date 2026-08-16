import { useState, useEffect } from "react";
import { InputFieldError, GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";
import { useTranslation } from "react-i18next";
import api from "../api/api.js";
import "./NewEntryDialog.css";

function NewEntryDialog({ isOpen, name, deadline, setName, setDeadline, setIsAddDialogOpen, fetchDataFunc }) {

  const { t } = useTranslation();

  //Todo Eintrag hinzufügen
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const addTodo = async () => {

    setLoadingMessage(t("new-entry-page.loading"));
    setErrorMessage({});

    try {
      await api.post("/", {name, deadline});
      fetchDataFunc();
      setName("");
      setDeadline("");

      setIsAddDialogOpen(false);
    } catch (error) {
      const rawError = error?.response?.data ?? {general: t("new-entry-page.error")};;
      console.error("Error: " + error)
      setErrorMessage(rawError);
    }
    finally {
      setLoadingMessage(null);
    }
  };

  function onClose() {
    setErrorMessage({});
    setLoadingMessage(null);
    setIsAddDialogOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  if (!isOpen) return null;

  return (
    <div className="overlay-container" >
      <div className="confirm-dialog-container">
        <h2>{t("new-entry-page.title")}</h2>

        <div className="new-entry-input-container">
          <p className="new-entry-input-label">
            {t("new-entry-page.input.name-label")}:
          </p>
          <input
            className="new-entry-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("new-entry-page.input.name-placeholder")}
          />
          <InputFieldError errorMessage={errorMessage?.name || " "} />
        </div>

        <div className="new-entry-input-container">
          <p className="new-entry-input-label">
            {t("new-entry-page.input.name-label")}:
          </p>
          <input
            className="new-entry-input"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <InputFieldError errorMessage={errorMessage?.deadline || " "} />
        </div>

        {!loadingMessage && <GeneralError errorMessage={errorMessage?.general || errorMessage?.error} />}
        {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}

        <div className="new-entry-buttons-container">
          <button className="new-entry-confirm-button" onClick={addTodo}>
            {t("new-entry-page.submit-button")}
          </button>

          <button className="new-entry-cancel-button" onClick={onClose}>
            {t("new-entry-page.cancel-button")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewEntryDialog;