// CheckboxField.js
import { forwardRef } from "react";
import Field from "./Field";
import styles from "./ContextFormStyles.module.css";

const CheckBoxField = forwardRef(
  (
    { name, label, required = false, helpText, className = "", ...rest },
    ref
  ) => {
    return (
      <Field
        name={name}
        required={required}
        helpText={helpText}
        className={className}
        ref={ref}
        {...rest}
      >
        {(fieldProps) => (
          <div className={styles.checkboxWrapper}>
            <input
              {...fieldProps}
              type="checkbox"
              className={styles.checkboxInput}
              checked={!!fieldProps.value}
            />
            <label htmlFor={fieldProps.id} className={styles.checkboxLabel}>
              {label}
              {required && <span className={styles.requiredMark}>*</span>}
            </label>
          </div>
        )}
      </Field>
    );
  }
);

CheckBoxField.displayName = "CheckboxField";

export default CheckBoxField;
