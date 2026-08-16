import "./EditEntryDialog.css";
import { useState, useEffect } from "react";
import { InputFieldError, GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";
import api from "../api/api.js";

function NewEntryDialog({ todoToEdit, setTodoToEdit, fetchDataFunc }) {

  // Alte Werte
  const oldName = todoToEdit?.name ?? undefined;
  const oldDeadline = todoToEdit?.deadline ?? undefined;

  // States für die neuen Werte
  const [newName, setNewName] = useState(todoToEdit?.name ?? undefined);
  const [newDeadline, setNewDeadline] = useState(todoToEdit?.deadline ?? undefined);

  useEffect(() => {
    const loadOldValues = async () => {
      setNewName(todoToEdit?.name ?? undefined);
      setNewDeadline(todoToEdit?.deadline ?? undefined);
    }
    loadOldValues();
  }, [todoToEdit])

  //Todo Eintrag bearbeiten
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  //Todo bearbeiten bestätigen
  const confirmEditTodo = async () => {
    setLoadingMessage("Änderungen speichern...");
    setErrorMessage(null);

    let changes = {};
    if (newName && newName !== oldName) {
      changes.newName = newName;
    }
    if (newDeadline && newDeadline !== oldDeadline) {
      changes.newDeadline = newDeadline
    }


    try {
      const response = await api.patch(`/${todoToEdit.id}`, changes);
      console.log('Antwort:', response.data);
      fetchDataFunc();

      onCloseEditDialog();
    } catch (error) {
      const rawError = error?.response?.data ?? { general: "Ein Fehler ist aufgetreten. Stelle sicher, dass eine Internetverbindung besteht, oder versuche es später erneut." };;
      console.error('Fehler: ', rawError);
      setErrorMessage(rawError);
    }
    finally {
      setLoadingMessage(null);
    }
  }

  // Dialogfenster schließen
  function onCloseEditDialog() {
    setLoadingMessage(null);
    setErrorMessage(null);
    setTodoToEdit(null);
  }

  // Dialogfenster beim Drücken von Escape schließen
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseEditDialog();
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  if (!todoToEdit) return null;

  return (
    <div className="overlay-container" >
      <div className="confirm-dialog-container">
        <h2>Todo-Eintrag bearbeiten</h2>

        <div className="new-entry-input-container">
          <p className="new-entry-input-label">
            Namen des Eintrags bearbeiten:
          </p>
          <input
            className="new-entry-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Todo Name"
          />
          <InputFieldError errorMessage={errorMessage?.name || " "} />
        </div>

        <div className="new-entry-input-container">
          <p className="new-entry-input-label">
            Deadline des Eintrags bearbeiten:
          </p>
          <input
            className="new-entry-input"
            type="datetime-local"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <InputFieldError errorMessage={errorMessage?.deadline || " "} />
        </div>

        {!loadingMessage && <GeneralError errorMessage={errorMessage?.general || errorMessage?.error} />}
        {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}

        <div className="dialog-buttons-container">
          <button className="confirm-add-button" onClick={confirmEditTodo}>
            Bestätigen
          </button>

          <button className="cancel-add-button" onClick={onCloseEditDialog}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewEntryDialog;