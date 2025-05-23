import List from "./components/projects/list/List";
import TodoList from "./components/projects/todo-list/TodoList";
import FetchData from "./components/projects/custom-hooks/FetchData";
import ChangeArray from "./components/projects/custom-hooks/ChangeArray";
import LocalStorage from "./components/projects/custom-hooks/LocalStorage";
import SimpleForm from "./components/projects/forms/SimpleForm";
import ReactHookForm from "./components/projects/forms/ReactHookForm";
import SimpleFormTwo from "./components/projects/forms/SimpleFormTwo";
import DemoContextForm from "./components/projects/forms/form-context/DemoContextForm";
import UseReducerDemo from "./components/projects/adv-state/UseReducerDemo";
import DemoToast from "./components/projects/toast/DemoToast";
import { ToastProvider } from "./components/projects/toast/ToastContext";
import Toast from "./components/projects/toast/Toast";
import DatePicker from "./components/projects/date-picker/DatePicker";

function App() {
  return (
    <>
      <h1>React WDS</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <DatePicker>
          <DatePicker.Trigger>
            <button>Select Date</button>
          </DatePicker.Trigger>
          <DatePicker.Popover>
            <DatePicker.Header monthLabel="May 2025" />
            <DatePicker.Weekdays />
            <DatePicker.Grid />
          </DatePicker.Popover>
        </DatePicker>
      </div>

      {/* <ToastProvider>
        <Toast />
        <DemoToast />
      </ToastProvider> */}

      {/* <UseReducerDemo /> */}
      {/* <DemoContextForm /> */}
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
