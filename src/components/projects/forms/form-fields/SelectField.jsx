import { forwardRef } from "react";
import styles from "../FormStyles.module.css";
import InlineErrorMessage from "./InlineErrorMessage";

const SelectField = forwardRef(({ ...props }, ref) => {
  const {
    id,
    name,
    label,
    options = [], // Array of options
    value,
    onChange,
    onBlur,
    error,
    required = false,
  } = props;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div
      className={`
        ${styles["form__field"]} 
        ${error ? styles["form__field--error"] : ""}
      `}
    >
      <label htmlFor={id} className={styles["form__label"]}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <select
        id={id}
        name={name}
        ref={ref}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && <InlineErrorMessage idName={id} message={error} />}
    </div>
  );
});

export default SelectField;
