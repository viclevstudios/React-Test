import { useState, useEffect } from "react";
import { InputFieldError, GeneralError } from "../components/Errors.jsx";
import { GeneralLoading } from "../components/Loading.jsx";
import axios from 'axios';
import "./NewEntryDialog.css";

function NewEntryDialog({ isOpen, name, deadline, setName, setDeadline, setIsAddDialogOpen, fetchDataFunc }) {

  //Todo Eintrag hinzufügen
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const addTodo = async () => {

    setLoadingMessage("Todo erstellen...");
    setErrorMessage({});

    try {
      const response = await axios.post('http://localhost:3000/api', { withCredentials: true, name: name, deadline: deadline });
      console.log('Antwort:', response.data);
      fetchDataFunc();
      setName("");
      setDeadline("");

      setIsAddDialogOpen(false);
    } catch (error) {
      const rawError = error?.response?.data ?? {general: "Ein Fehler ist aufgetreten. Stelle sicher, dass eine Internetverbindung besteht, oder versuche es später erneut."};;
      console.error('Fehler: ', rawError);
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
        <h2>Neuen Todo-Eintrag hinzufügen</h2>

        <div className="new-entry-input-container">
          <p className="new-entry-input-label">
            Welche Aufgabe willst du erledigen:
          </p>
          <input
            className="new-entry-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Todo Name"
          />
          <InputFieldError errorMessage={errorMessage?.name || " "} />
        </div>

        <div className="new-entry-input-container">
          <p className="new-entry-input-label">
            Bis wann soll die Aufgabe erledigt sein:
          </p>
          <input
            className="new-entry-input"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <InputFieldError errorMessage={errorMessage?.deadline || " "} />
        </div>

        {!loadingMessage && <GeneralError errorMessage={errorMessage?.general} />}
        {loadingMessage && <GeneralLoading loadingMessage={loadingMessage} />}

        <div className="new-entry-buttons-container">
          <button className="new-entry-confirm-button" onClick={addTodo}>
            Hinzufügen
          </button>

          <button className="new-entry-cancel-button" onClick={onClose}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewEntryDialog;