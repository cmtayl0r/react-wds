import { CircleCheck } from "lucide-react";
import styles from "./SimpleForm.module.css";
function InlineValidMessage({ fieldName }) {
  return (
    <div className={styles["form__valid"]} aria-live="polite">
      <CircleCheck aria-hidden="true" />
      <span>{fieldName} is valid</span>
    </div>
  );
}

export default InlineValidMessage;
