import { TriangleAlert } from "lucide-react";
import styles from "../FormStyles.module.css";
function InlineErrorMessage({ idName, message }) {
  if (!message) return null;

  return (
    <div
      id={`${idName}-error`}
      className={styles["form__error"]}
      role="alert"
      aria-live="assertive"
    >
      <TriangleAlert aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default InlineErrorMessage;
