import { useState } from "react";
import TodoListItem from "./TodoListItem";
import TodoAddItem from "./TodoAddItem";
import "../../../styles/projects/todo-list.css";

// TODO - Create dialog for adding a new task when clicking the add button
// TODO - Click on label to edit label text (and more settings)
// TODO - Disable label/text click when todo set as completed
// TODO - Toast notifications for key actions
// TODO - Add multiple lists

function TodoList() {
  const [taskList, setTaskList] = useState([]);

  // Add a new task
  function handleAddTask(newTask) {
    // add the task
    setTaskList((prevList) => [
      {
        id: crypto.randomUUID(),
        name: newTask,
        isCompleted: false,
        createdAt: new Date(),
      },
      ...prevList,
    ]);
  }

  // Delete a task
  function handleDeleteTask(taskId) {
    // Filter out the task, IF the task id is not the same as the taskId
    setTaskList((prevList) => prevList.filter((task) => task.id !== taskId));
  }

  // Toggle a task completed
  function handleToggleTaskCompleted(taskId, completed) {
    setTaskList((prevTasks) =>
      // Loop over each task
      prevTasks.map((task) =>
        // check if the task is the same as the completed task
        // If it is, toggle the isCompleted property
        // If it isn't, return the task
        task.id === taskId ? { ...task, isCompleted: completed } : task
      )
    );
  }

  return (
    <section aria-labelledby="todo-list-title" className="todo__list-container">
      <h2 id="todo-list-title">Todo List</h2>
      <TodoAddItem onAddTask={handleAddTask} />
      <ul className="todo__list">
        {taskList.length === 0 && <li>No tasks yet</li>}
        {taskList.map((task) => {
          return (
            <TodoListItem
              key={task.id}
              task={task}
              onDeleteTask={handleDeleteTask}
              onToggleTaskCompleted={handleToggleTaskCompleted}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default TodoList;
