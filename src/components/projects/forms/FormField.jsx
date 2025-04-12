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

  return (
    <div
      className={`
        ${styles["form__field"]} 
        ${showError ? styles["form__field--error"] : ""}
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
      {showError && error && (
        <InlineErrorMessage idName={fieldName} message={error} />
      )}
    </div>
  );
}

export default FormField;
