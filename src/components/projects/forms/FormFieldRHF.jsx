import InlineErrorMessage from "./InlineErrorMessage";
import InlineValidMessage from "./InlineValidMessage";
import styles from "./SimpleForm.module.css";

function FormFieldRHF({
  fieldName,
  label,
  children,
  error,
  isDirty = false,
  isTouched = false,
  showValidMessage = false,
  hideLabel = false,
  className = "", // Injecting extra classes
}) {
  const labelText =
    label || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

  // Only show valid message if the field is both dirty and touched and has no errors
  const showValidState = showValidMessage && isDirty && isTouched && !error;

  return (
    <div
      className={`
        ${styles["form__field"]} 
        ${error ? styles["form__field--error"] : ""}
        ${className}
      `}
    >
      <label
        htmlFor={fieldName}
        className={`
          ${styles["form__label"]} 
          ${hideLabel ? styles["visually-hidden"] : ""}
        `}
      >
        {labelText}
      </label>
      {children}
      {error ? (
        <InlineErrorMessage idName={fieldName} message={error} />
      ) : showValidState ? (
        <InlineValidMessage fieldName={fieldName} />
      ) : null}
    </div>
  );
}

export default FormFieldRHF;
