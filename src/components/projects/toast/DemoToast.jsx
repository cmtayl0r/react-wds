import { useToastContext } from "./ToastContext";

function DemoToast() {
  const { addToast } = useToastContext();

  return (
    <div>
      <h3>Toast Demo</h3>
      <button onClick={() => addToast("Info message")}>Info Toast</button>
      <button onClick={() => addToast("Success message!", "success")}>
        Success Toast
      </button>
      <button onClick={() => addToast("Error occurred.", "error")}>
        Error Toast
      </button>
    </div>
  );
}

export default DemoToast;
