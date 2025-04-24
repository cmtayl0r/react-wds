// TextareaField.js
import React, { forwardRef } from "react";
import Field from "./Field";
import styles from "./ContextFormStyles.module.css";

const TextAreaField = forwardRef(
  (
    {
      name,
      label,
      required = false,
      helpText,
      className = "",
      rows = 4,
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
          <textarea
            {...fieldProps}
            className={styles.textareaInput}
            rows={rows}
          />
        )}
      </Field>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
