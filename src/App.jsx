import List from "./components/projects/list/List";
import TodoList from "./components/projects/todo-list/TodoList";
import FetchData from "./components/projects/custom-hooks/FetchData";
import ChangeArray from "./components/projects/custom-hooks/ChangeArray";
import LocalStorage from "./components/projects/custom-hooks/LocalStorage";
import SimpleForm from "./components/projects/forms/SimpleForm";
import ReactHookForm from "./components/projects/forms/ReactHookForm";
import SimpleFormTwo from "./components/projects/forms/SimpleFormTwo";
import DemoContextForm from "./components/projects/forms/form-context/DemoContextForm";

function App() {
  return (
    <>
      <h1>React WDS</h1>
      <DemoContextForm />
      {/* <ReactHookForm /> */}
      {/* <SimpleForm /> */}
      {/* <LocalStorage /> */}
      {/* <ChangeArray /> */}
      {/* <FetchData /> */}
      {/* <TodoList /> */}
      {/* <List /> */}
      {/* <SimpleFormTwo /> */}
    </>
  );
}

export default App;
