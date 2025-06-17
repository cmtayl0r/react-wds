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
import InfiniteScroll from "./components/projects/infinite-scroll/InfiniteScroll";
import ParentList from "./components/projects/controlled-modal/ParentList";
import RecursiveComponents from "./components/projects/recursive/RecursiveComponents";
// import DeferredResults from "./components/projects/deferred-value/DeferredResults";
// import UseTransitionHook from "./components/projects/use-transition/UseTransitionHook";
import ApiClientVanilla from "./components/projects/api-client-vanilla/ApiClientVanilla";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import ApiClientRQ from "./components/projects/api-client-rq/ApiClientRQ";
import BasicRQ from "./components/projects/api-client-rq/BasicRQ";

function App() {
  return (
    <main className="app-container">
      <header className="app-header">
        <h3>React Learning</h3>
      </header>
      {/* 👇 projects */}

      <QueryClientProvider client={queryClient}>
        <BasicRQ />
        {/* <ApiClientRQ /> */}
      </QueryClientProvider>

      {/* <ApiClientVanilla /> */}
      {/* <UseTransitionHook /> */}
      {/* <DeferredResults /> */}
      {/* <RecursiveComponents /> */}
      {/* <ParentList /> */}
      {/* <InfiniteScroll /> */}
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
    </main>
  );
}

export default App;
