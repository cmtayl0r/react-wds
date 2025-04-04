import List from "./components/projects/list/List";
import TodoList from "./components/projects/todo-list/TodoList";
import FetchData from "./components/projects/custom-hooks/FetchData";
import ChangeArray from "./components/projects/custom-hooks/ChangeArray";

function App() {
  return (
    <>
      <h1>React WDS</h1>
      <ChangeArray />
      {/* <FetchData /> */}
      {/* <TodoList /> */}
      {/* <List /> */}
    </>
  );
}

export default App;
