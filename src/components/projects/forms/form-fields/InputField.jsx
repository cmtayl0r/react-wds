import { forwardRef } from "react";
import styles from "../FormStyles.module.css";
import InlineErrorMessage from "./InlineErrorMessage";
import { Calendar, Clock } from "lucide-react";

// Address Input mode for better Mobile UX
const getInputMode = (inputType) => {
  switch (inputType) {
    case "date":
      return "none"; // Prevents keyboard on date inputs
    case "time":
      return "numeric"; // Shows numeric keyboard for time
    case "email":
      return "email"; // Shows email keyboard with @ symbol
    case "tel":
      return "tel"; // Shows phone keyboard
    case "number":
      return "numeric"; // Shows numeric keyboard
    case "search":
      return "search"; // Optimizes for search
    case "url":
      return "url"; // Shows URL keyboard with / and .com
    case "text":
      return "text"; // Default text keyboard
    default:
      return undefined; // Let browser decide for other types
  }
};

const InputField = forwardRef(({ ...props }, ref) => {
  const {
    id,
    name,
    label = "",
    error = null,
    type = "text",
    placeholder = "",
    className = "",
    required = false,
    value,
    onChange,
    onBlur,
    autoComplete = "off",
    ...rest
  } = props;

  // Construct error id from input id for
  const describedBy = error ? `${id}-error` : undefined;

  // Call the Input Mode function to determine the correct inputMode
  const inputMode = getInputMode(type);

  return (
    <div
      id={id}
      className={`
          ${styles["form__field"]} 
          ${error ? styles["form__field--error"] : ""}
          ${className}
        `}
    >
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        ref={ref}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        autoComplete={autoComplete}
        inputMode={inputMode}
        {...rest}
      />
      {error && <InlineErrorMessage idName={name} message={error} />}
    </div>
  );
});

export default InputField;
