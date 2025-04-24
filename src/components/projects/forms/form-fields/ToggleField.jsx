import { forwardRef } from "react";
import styles from "../FormStyles.module.css";
import InlineErrorMessage from "./InlineErrorMessage";

const ToggleField = forwardRef(({ ...props }, ref) => {
  const {
    id,
    name,
    label,
    checked = false,
    onChange,
    onBlur,
    error,
    required = false,
  } = props;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div
      id={id} // ✅ matches ref key and summary link
      tabIndex={-1} // ✅ focusable
      className={`
        ${styles["form__field"]} 
        ${error ? styles["form__field--error"] : ""}
      `}
    >
      <div className={styles["form__switch-wrapper"]}>
        <div className={styles["form__switch"]}>
          <input
            type="checkbox"
            role="switch"
            id={id}
            name={name}
            ref={ref}
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            aria-describedby={describedBy}
            aria-invalid={!!error}
            required={required}
          />
          <span className={styles["form__switch-handle"]} aria-hidden="true" />
        </div>
        <label htmlFor={id} className={styles["form__switch-description"]}>
          {/* {formData.earlyContact ? "Yes please" : "No thanks"} */}
          {checked ? "✅" : "⛔"} {label}
        </label>
      </div>
      {error && <InlineErrorMessage idName={id} message={error} />}
    </div>
  );
});

export default ToggleField;
