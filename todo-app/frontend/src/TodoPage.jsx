import './App.css';
import TodoEntry from './TodoEntry.jsx';
import ConfirmDeleteDialog from './DeleteEntryDialog/ConfirmDeleteDialog.jsx';
import NewEntryDialog from "./NewEntryDialog/NewEntryDialog.jsx";
import EditEntryDialog from "./EditEntryDialog/EditEntryDialog.jsx";
import StatusMessage from './StatusMessage.jsx';
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';

//App
function TodoPage() {

  //Todo Einträge als State 
  const [todos, setTodos] = useState([]);

  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  const fetchData = useCallback(async () => {
    setLoadingMessage("Laden der Todo-Einträge...");
    setErrorMessage({});

    try {
      let { data } = await axios.get("http://localhost:3000/api", { withCredentials: true });
      setTodos(data);
    } catch (error) {
      const rawError = error?.response?.data ?? {general: "Ein Fehler ist aufgetreten. Stelle sicher, dass eine Internetverbindung besteht, oder versuche es später erneut."};
      console.error('Fehler: ', rawError);
      setErrorMessage(rawError);
    } finally {
      setLoadingMessage(null);
    }
  }, []);

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
      <h1 className="title">To-Do-Liste</h1>
      <div className="todo-entries-container">
        {
          (todos.length === 0 && !loadingMessage && !errorMessage) ? "No todos yet..." : todos.map(todo => (
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
        Hinzufügen
      </button>
    </div>
  );
}

export default TodoPage;