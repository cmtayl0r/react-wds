import { createContext, useContext, useMemo, useReducer, useRef } from "react";

const initialState = {
  toastQueue: [],
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toastQueue: [...state.toastQueue, action.payload],
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toastQueue: state.toastQueue.filter(
          (toast) => toast.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

const ToastContext = createContext();

function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Ref for persistent ID (won't reset on re-render)
  const idRef = useRef(0);

  const addToast = (message, type = "info") => {
    const id = ++idRef.current; // id is incremented each time a toast is added
    dispatch({
      type: "ADD_TOAST",
      payload: { id, message, type },
    });
  };

  const removeToast = (id) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  const contextValue = useMemo(
    () => ({
      toastQueue: state.toastQueue,
      addToast,
      removeToast,
    }),
    [state.toastQueue]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider, useToastContext };
