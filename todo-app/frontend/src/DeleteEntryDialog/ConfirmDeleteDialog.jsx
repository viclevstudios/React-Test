import "./ConfirmDeleteDialog.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";

function ConfirmDeleteDialog({todo, setTodoToDelete, fetchDataFunc}) {
  
  //Todo Eintrag löschen
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const deleteTodo = async () => {

    setLoadingMessage("Todo löschen...");
    setErrorMessage(null);

    try {
      await axios.delete(`http://localhost:3000/api/${todo.id}`, {withCredentials: true});
      fetchDataFunc();
      onCloseDeleteDialog();
    } catch (error) {
      const rawError = error?.response?.data ?? {general: "Ein Fehler ist aufgetreten. Stelle sicher, dass eine Internetverbindung besteht, oder versuche es später erneut."};
      console.error('Fehler: ', rawError);
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
        <h2>Löschen bestätigen</h2>
        <p className="delete-dialog-text">
          Willst du den Eintrag "{todo.name}" wirklich löschen?
        </p>

        {!loadingMessage && <GeneralError errorMessage={errorMessage?.general} />}
        {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}        
        
        <div className="dialog-buttons-container">
          <button className="confirm-add-button" onClick={deleteTodo}>
            Ja
          </button>

          <button className="cancel-add-button" onClick={onCloseDeleteDialog}>
            Nein
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteDialog;