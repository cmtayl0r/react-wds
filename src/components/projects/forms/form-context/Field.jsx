import { forwardRef } from "react";
import { useForm } from "./FormContext";
import styles from "./ContextFormStyles.module.css";

// 🎯 Pulls data from context and calls dispatch functions on blur/change
// Wraps around form field components

const Field = forwardRef(
  (
    {
      name,
      label,
      children,
      required = false,
      helpText,
      className = "",
      labelClassName = "",
      fieldWrapperClassName = "",
      ...rest
    },
    ref
  ) => {
    // 1️⃣ Pull values + helpers from context (state + methods)
    const {
      values, // Current values from reducer
      errors, // Errors for this field
      setFieldValue, // Updates reducer with new value + triggers validation
      setFieldTouched, // Marks this field as "touched"
      shouldShowError, // Determines if error should be shown
    } = useForm();

    // 2️⃣ Field properties created from props
    const value = values[name];
    const error = errors[name];
    const showError = shouldShowError(name);
    const fieldId = `field-${name}`;
    const errorId = `${fieldId}-error`;
    const helpTextId = `${fieldId}-help`;
    const describedBy =
      [showError ? errorId : null, helpText ? helpTextId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    // 3️⃣ Handlers
    // 🛠️ On change or blur, update context via reducer
    const handleChange = (e) => {
      const target = e.target;
      // Get new value, based on input type (checkbox or text)
      const newValue =
        target.type === "checkbox" ? target.checked : target.value;
      // Update context via reducer
      setFieldValue(name, newValue);
    };

    // 🛠️ marks field as touched, triggers validation
    const handleBlur = () => {
      // Mark field as "touched" via reducer
      setFieldTouched(name);
    };

    // 4️⃣ Field props that are passed to <input> or any children
    const fieldProps = {
      id: fieldId,
      name,
      value: value ?? "",
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": showError,
      "aria-describedby": describedBy,
      required,
      ref,
      ...rest,
    };

    return (
      <div
        className={`
          ${styles.fieldWrapper}
          ${showError ? styles.fieldWrapperError : ""}
          ${fieldWrapperClassName}
        `}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={fieldId}
            className={`${styles.fieldLabel} ${labelClassName}`}
          >
            {label}
          </label>
        )}

        {/*  */}
        <div className={`${styles.fieldContent} ${className}`}>
          {/* 
            Render children with field props
            This means you render a custom component and pass it field props
            (e.g. <input {...fieldProps} />)
          */}
          {typeof children === "function" ? children(fieldProps) : children}
        </div>

        {/* Help text */}
        {helpText && (
          <div id={helpTextId} className={styles.helpText}>
            {helpText}
          </div>
        )}

        {/* Error message */}
        {showError && (
          <div id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;
