import { forwardRef } from "react";
import InlineErrorMessage from "./form-fields/InlineErrorMessage";
import styles from "./FormStyles.module.css";

/**
 * A reusable wrapper for grouped inputs (checkboxes, radios).
 * Accepts ARIA and data attributes via ...props.
 */

// React’s forwardRef lets you explicitly forward a parent’s ref down to a DOM element inside your component.
const FormFieldGroup = forwardRef(
  (
    {
      fieldName,
      legend,
      showError,
      errors,
      children,
      hideLegend = false,
      className = "", // Injecting extra classes
      ...props
    },
    ref
  ) => {
    return (
      <fieldset
        ref={ref}
        tabIndex={-1}
        className={`
        ${styles["form__field-group"]} 
        ${showError ? styles["form__field--error"] : ""}
        ${className}
      `}
        {...props}
      >
        <legend
          className={`
          ${styles["form__group-legend"]} 
          ${hideLegend ? styles["visually-hidden"] : ""}
        `}
        >
          {legend}
        </legend>
        {showError && (
          <InlineErrorMessage idName={fieldName} message={errors} />
        )}
        {children}
      </fieldset>
    );
  }
);

FormFieldGroup.displayName = "FormFieldGroup";
export default FormFieldGroup;
