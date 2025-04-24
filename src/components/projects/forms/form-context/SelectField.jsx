import React, { forwardRef } from "react";
import Field from "./Field";
import styles from "./ContextFormStyles.module.css";

const SelectField = forwardRef(
  (
    {
      name,
      label,
      options = [],
      required = false,
      placeholder = "Select an option",
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
        className={className}
        ref={ref}
        {...rest}
      >
        {(fieldProps) => (
          <select {...fieldProps} className={styles.selectInput}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option
                key={option.value || option}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        )}
      </Field>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
