// ToggleField.js
import { forwardRef } from "react";
import Field from "./Field";
import styles from "./ContextFormStyles.module.css";

const ToggleField = forwardRef(
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
          <div className={styles.toggleWrapper}>
            <label className={styles.toggleSwitch} htmlFor={fieldProps.id}>
              <input
                {...fieldProps}
                type="checkbox"
                role="switch"
                className={styles.toggleInput}
                checked={!!fieldProps.value}
              />
              <span className={styles.toggleSlider}></span>
            </label>
            <span className={styles.toggleLabel}>
              {label}
              {required && <span className={styles.requiredMark}>*</span>}
            </span>
          </div>
        )}
      </Field>
    );
  }
);

ToggleField.displayName = "ToggleField";

export default ToggleField;
