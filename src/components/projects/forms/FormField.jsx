import InlineErrorMessage from "./InlineErrorMessage";
import styles from "./SimpleForm.module.css";

function FormField({
  fieldName,
  label,
  children,
  showError,
  error,
  hideLabel = false,
  className = "", // Injecting extra classes
}) {
  const labelText =
    label || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  // truthy check for optional chaining
  // If showError is a function, call it with fieldName
  const errorExists = showError?.(fieldName);

  return (
    <div
      className={`
        ${styles["form__field"]} 
        ${showError(fieldName) ? styles["form__field--error"] : ""}
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
      {errorExists && <InlineErrorMessage idName={fieldName} message={error} />}
      {children}
    </div>
  );
}

export default FormField;
