import { Trash2 } from "lucide-react";
function TodoListItem({ task, onDeleteTask, onToggleTaskCompleted }) {
  const { id, name, isCompleted } = task;
  const checkboxId = `task-${id}`;

  return (
    <li key={id} className="todo__item">
      <input
        id={checkboxId}
        type="checkbox"
        checked={isCompleted}
        // Pass a function as the onChange handler
        // Function because we need to pass the task id and the checked state to the parent
        onChange={(e) => onToggleTaskCompleted(id, e.target.checked)}
        className="todo__checkbox"
        aria-label={`Mark ${name} as ${
          isCompleted ? "not completed" : "completed"
        }`}
      />
      <span
        className={`todo__item-label 
                  ${isCompleted ? "todo__item-label--completed" : ""}`}
      >
        {name}
      </span>
      <button
        className="todo__button todo__button--delete"
        aria-label={`Delete ${name}`}
        // Pass a function as the onClick handler
        // Function because we need to pass the task id to the parent
        onClick={() => onDeleteTask(id)}
      >
        <Trash2 aria-hidden="true" />
      </button>
    </li>
  );
}

export default TodoListItem;
