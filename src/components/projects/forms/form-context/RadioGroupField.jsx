// RadioGroupField.js
import { forwardRef } from "react";
import Field from "./Field";
import styles from "./ContextFormStyles.module.css";

const RadioGroupField = forwardRef(
  (
    {
      name,
      label,
      options = [],
      required = false,
      helpText,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <Field
        name={name}
        label={label}
        required={required}
        helpText={helpText}
        className={`${styles.radioGroupField} ${className}`}
        {...rest}
      >
        {(fieldProps) => (
          <div className={styles.radioGroup} ref={ref}>
            {options.map((option, index) => {
              const optionValue = option.value || option;
              const optionLabel = option.label || option;
              const radioId = `${fieldProps.id}-option-${index}`;

              return (
                <div key={radioId} className={styles.radioOption}>
                  <input
                    type="radio"
                    id={radioId}
                    name={fieldProps.name}
                    value={optionValue}
                    checked={fieldProps.value === optionValue}
                    onChange={() =>
                      fieldProps.onChange({
                        target: { name, value: optionValue },
                      })
                    }
                    onBlur={fieldProps.onBlur}
                    className={styles.radioInput}
                    required={required}
                    aria-describedby={fieldProps["aria-describedby"]}
                  />
                  <label htmlFor={radioId} className={styles.radioLabel}>
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </Field>
    );
  }
);

RadioGroupField.displayName = "RadioGroupField";

export default RadioGroupField;
