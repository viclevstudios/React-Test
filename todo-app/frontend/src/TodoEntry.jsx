import "./TodoEntry.css";
import penIcon from "./assets/pen.png";

function TodoEntry({ todo, onDelete, onEdit }) {
  return (
    <div className="todo-entry-container">
      <p className="todo-entry-name">{todo.name}</p>
      <p className="todo-entry-deadline">{new Date(todo.deadline).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute:"2-digit"
      })}</p>
      <button className="delete-button" onClick={() => onDelete(todo)}>
        X
      </button>
      <button className="edit-button" onClick={() => onEdit(todo)}><img className="pen-icon" src={penIcon}></img></button>
    </div>
  );
}

export default TodoEntry;