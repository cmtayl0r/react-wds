import InlineErrorMessage from "./form-fields/InlineErrorMessage";
import styles from "./FormStyles.module.css";

function FormField({
  fieldName,
  label,
  children,
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
      {error && <InlineErrorMessage idName={fieldName} message={error} />}
    </div>
  );
}

export default FormField;
