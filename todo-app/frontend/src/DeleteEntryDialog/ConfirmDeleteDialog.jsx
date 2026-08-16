import "./ConfirmDeleteDialog.css";
import { useState, useEffect } from "react";
import api from "../api/api.js";
import { GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";
import { useTranslation } from "react-i18next";

function ConfirmDeleteDialog({todo, setTodoToDelete, fetchDataFunc}) {
  
  const { t } = useTranslation();

  //Todo Eintrag löschen
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const deleteTodo = async () => {

    setLoadingMessage(t("delete-entry-page.loading"));
    setErrorMessage(null);

    try {
      await api.delete(`/${todo.id}`);
      fetchDataFunc();
      onCloseDeleteDialog();
    } catch (error) {
      const rawError = error?.response?.data ?? {general: t("delete-entry-page.error")};
      console.error('Error: ', rawError);
      setErrorMessage(rawError);
    }
    finally {
      setLoadingMessage(null);
    }
  };

  // Dialogfenster schließen
  function onCloseDeleteDialog() {
    setTodoToDelete(null);
  }


  // Abbrechen beim Escape drücken
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseDeleteDialog()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })
  
  if (!todo) {
    return null;
  }

  return (
    <div className="overlay-container">
      <div className="delete-dialog-container">
        <h2>{"delete-entry-page.title"}</h2>
        <p className="delete-dialog-text">
          {"delete-entry-page.label1"} "{todo.name}" {"delete-entry-page.label2"}?
        </p>

        {!loadingMessage && <GeneralError errorMessage={errorMessage?.general || errorMessage?.error} />}
        {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}        
        
        <div className="dialog-buttons-container">
          <button className="confirm-add-button" onClick={deleteTodo}>
            {"delete-entry-page.submit-button"}
          </button>

          <button className="cancel-add-button" onClick={onCloseDeleteDialog}>
            {"delete-entry-page.cancel-button"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;