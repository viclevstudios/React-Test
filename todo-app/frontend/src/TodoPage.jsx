import './App.css';
import TodoEntry from './TodoEntry.jsx';
import ConfirmDeleteDialog from './DeleteEntryDialog/ConfirmDeleteDialog.jsx';
import NewEntryDialog from "./NewEntryDialog/NewEntryDialog.jsx";
import EditEntryDialog from "./EditEntryDialog/EditEntryDialog.jsx";
import StatusMessage from './StatusMessage.jsx';
import { useState, useEffect, useCallback } from "react";
import api from "./api/api.js";
import { useTranslation } from "react-i18next";
import TranslationButton from './components/TranslationButton.jsx';

//App
function TodoPage() {

  const { t } = useTranslation();

  //Todo Einträge als State 
  const [todos, setTodos] = useState([]);

  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const fetchData = useCallback(async () => {
    setLoadingMessage(t("todo-page.loading"));
    setErrorMessage({});

    try {
      let { data } = await api.get("/");
      setTodos(data);
    } catch (error) {
      const rawError = error?.response?.data ?? {general: t("todo-page.error")};
      console.error("Error: " + error);
      setErrorMessage(rawError);
    } finally {
      setLoadingMessage(null);
    }
  }, [t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timeout);
  }, [fetchData]);


  //Dialogfenster zum hinzufügen eines Todo Eintrags als State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  //States zum Speichern der Daten zum Hinzufügen / bearbeiten eines Todos
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");


  //Zu löschender Todo Eintrag als State
  const [todoToDelete, setTodoToDelete] = useState(null);

  //Löschen von einem Todo Eintrag anfragen
  function requestDeleteTodo(todo) {
    setTodoToDelete(todo);
  }


  //Dialogfenster zum Bearbeiten eines Todo Eintrags als State
  const [todoToEdit, setTodoToEdit] = useState(null);

  //Todo bearbeiten
  function editTodo(todo) {
    setTodoToEdit(todo);
  }

  //Ausgabe
  return (
    <div className="app-container">
      <TranslationButton />
      <h1 className="title">{t("todo-page.title")}</h1>
      <div className="todo-entries-container">
        {
          (todos.length === 0 && !loadingMessage && !errorMessage) ? t("todo-page.empty") : todos.map(todo => (
            <TodoEntry
              key={todo.id}
              todo={todo}
              onDelete={requestDeleteTodo}
              onEdit={editTodo}
            />
          ))
        }

      </div>
      <StatusMessage errorMessage={errorMessage} loadingMessage={loadingMessage} reloadFunc={fetchData}></StatusMessage>
      <ConfirmDeleteDialog
        todo={todoToDelete}
        setTodoToDelete={setTodoToDelete}
        fetchDataFunc={fetchData}
      />
      <NewEntryDialog
        isOpen={isAddDialogOpen}
        name={name}
        deadline={deadline}
        setName={setName}
        setDeadline={setDeadline}
        setIsAddDialogOpen={setIsAddDialogOpen}
        fetchDataFunc={fetchData}
      />
      <EditEntryDialog
        todoToEdit={todoToEdit}
        setTodoToEdit={setTodoToEdit}
        fetchDataFunc={fetchData}
      />
      <button className="add-button" onClick={() => setIsAddDialogOpen(true)}>
        {t("todo-page.add-button")}
      </button>
    </div>
  );
}

export default TodoPage;