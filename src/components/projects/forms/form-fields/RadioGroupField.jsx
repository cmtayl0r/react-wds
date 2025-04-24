import { forwardRef } from "react";
import styles from "../FormStyles.module.css";
import InlineErrorMessage from "./InlineErrorMessage";

const RadioGroupField = forwardRef(({ ...props }, ref) => {
  const {
    id,
    name,
    label,
    options = [], // Array of options
    value = "", // Selected value
    onChange,
    onBlur,
    error,
    required = false,
  } = props;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <fieldset
      id={id} // ✅ Needed for error summary scroll
      tabIndex={-1} // ✅ Makes container focusable
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
        <div key={opt} className={styles["form__radio-item"]}>
          <input
            type="radio"
            id={`${id}-${opt}`}
            name={name}
            value={opt}
            checked={value === opt} // Checked if the selected value matches the option
            onChange={onChange}
            onBlur={onBlur}
            ref={idx === 0 ? ref : null} // forward ref to first radio
          />
          <label htmlFor={`${id}-${opt}`}>{opt}</label>
        </div>
      ))}
      {error && <InlineErrorMessage idName={id} message={error} />}
    </fieldset>
  );
});

export default RadioGroupField;
