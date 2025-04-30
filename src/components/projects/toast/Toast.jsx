import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";
import { useToastContext } from "./ToastContext";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function Toast() {
  const { toastQueue, removeToast } = useToastContext();

  useEffect(() => {
    // Automatically remove toasts after 3 seconds
    const timers = toastQueue.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );
    // Cleanup function to clear timers when component unmounts or toastQueue changes
    // This prevents memory leaks and ensures that timers are cleared
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toastQueue, removeToast]);

  return createPortal(
    <div className={styles["toast-stack"]}>
      <AnimatePresence initial={false}>
        {/* 
          toastQueue is an array of toast objects, each with a unique id, message, and type (info, success, error).
          The map function iterates over the toastQueue array and creates a motion.div for each toast.
        */}
        {toastQueue.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (Math.abs(info.offset.x) > 100) {
                removeToast(toast.id);
              }
            }}
            className={`${styles.toast} ${
              styles[`toast--${toast.type}`] || ""
            }`}
            aria-live="polite"
          >
            <span className={styles["toast__icon"]}>
              {toast.type === "success"
                ? "✅"
                : toast.type === "error"
                ? "❌"
                : "ℹ️"}
            </span>
            <p className={styles["toast__message"]}>
              {toast.id}
              {" - "}
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
              className={styles["toast__close"]}
            >
              <X size={20} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default Toast;
