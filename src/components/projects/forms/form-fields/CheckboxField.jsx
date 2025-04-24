import { forwardRef } from "react";
import styles from "../FormStyles.module.css";
import InlineErrorMessage from "./InlineErrorMessage";

const CheckboxField = forwardRef(({ ...props }, ref) => {
  const {
    id,
    name,
    label = "",
    checked,
    onChange,
    onBlur,
    error = null,
    required = false,
    className = "",
    ...rest
  } = props;

  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div
      id={id} // ✅ Needed for error summary scroll
      tabIndex={-1} // ✅ Makes container focusable
      className={`
        ${styles["form__field"]} 
        ${error ? styles["form__field--error"] : ""}
        ${className}
      `}
    >
      <label className={styles["form__checkbox-item"]}>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          required={required}
          ref={ref} // ✅ Focus target for ErrorSummary
          {...rest}
        />
        {label}
      </label>
      {error && <InlineErrorMessage idName={id} message={error} />}
    </div>
  );
});

export default CheckboxField;
