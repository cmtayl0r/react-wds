import { useEffect, useRef, useState } from "react";
import { ListPlus } from "lucide-react";

function TodoAddItem({ onAddTask }) {
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    onAddTask(newTask); // Pass the new task to the parent
    setNewTask(""); // Clear input after submission
    inputRef.current?.focus(); // Re-focus input, truthy check for optional chaining
  };

  return (
    <form className="todo__form-add" onSubmit={handleSubmit}>
      <input
        type="text"
        id="new-task"
        placeholder="Enter a task"
        value={newTask} // Bind the input to the state
        onChange={(e) => setNewTask(e.target.value)} // Update the state when the input changes
        ref={inputRef} // Assign a ref to the input
      />
      <button className="todo__button" type="submit" disabled={!newTask.trim()}>
        <ListPlus aria-hidden="true" />
        <span>Add Task</span>
      </button>
    </form>
  );
}

export default TodoAddItem;
