import { TriangleAlert } from "lucide-react";
import styles from "./SimpleForm.module.css";
function InlineErrorMessage({ idName, message }) {
  if (!message) return null;

  return (
    <div className={styles["form__error"]} aria-live="polite">
      <TriangleAlert aria-hidden="true" />
      <span id={`${idName}-error`}>{message}</span>
    </div>
  );
}

export default InlineErrorMessage;
