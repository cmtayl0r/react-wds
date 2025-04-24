import { forwardRef } from "react";
import styles from "../FormStyles.module.css";
import InlineErrorMessage from "./InlineErrorMessage";

const CheckboxGroupField = forwardRef(({ ...props }, ref) => {
  const {
    id,
    name,
    label,
    options = [], // Array of options
    value = [], // Array of checked values
    onChange,
    onBlur,
    error,
    required = false,
  } = props;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <fieldset
      id={id} // ✅ ID used for linking error summary scroll
      tabIndex={-1}
      className={`
        ${styles["form__field-group"]} 
        ${error ? styles["form__field--error"] : ""}
      `}
      aria-describedby={describedBy}
      aria-invalid={!!error}
    >
      <legend className={styles["form__group-legend"]}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </legend>

      {options.map((opt, idx) => (
        <div key={opt} className={styles["form__checkbox-item"]}>
          <input
            type="checkbox"
            id={`${id}-${opt}`}
            name={name}
            value={opt}
            checked={value.includes(opt)}
            onChange={onChange}
            onBlur={onBlur}
            ref={idx === 0 ? ref : null} // forward ref to first checkbox
          />
          <label htmlFor={`${id}-${opt}`}>{opt}</label>
        </div>
      ))}
      {error && <InlineErrorMessage idName={id} message={error} />}
    </fieldset>
  );
});

export default CheckboxGroupField;
