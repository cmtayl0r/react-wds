import List from "./components/projects/list/List";
import TodoList from "./components/projects/todo-list/TodoList";
import FetchData from "./components/projects/custom-hooks/FetchData";
import ChangeArray from "./components/projects/custom-hooks/ChangeArray";
import LocalStorage from "./components/projects/custom-hooks/LocalStorage";
import SimpleForm from "./components/projects/forms/SimpleForm";
import ReactHookForm from "./components/projects/forms/ReactHookForm";

function App() {
  return (
    <>
      <h1>React WDS</h1>
      <ReactHookForm />
      {/* <SimpleForm /> */}
      {/* <LocalStorage /> */}
      {/* <ChangeArray /> */}
      {/* <FetchData /> */}
      {/* <TodoList /> */}
      {/* <List /> */}
    </>
  );
}

export default App;
