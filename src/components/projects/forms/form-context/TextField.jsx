import { forwardRef } from "react";
import Field from "./Field";
import styles from "./ContextFormStyles.module.css";

const TextField = forwardRef(
  (
    {
      name,
      label,
      type = "text",
      required = false,
      helpText,
      className = "",
      inputMode,
      ...rest
    },
    ref
  ) => {
    // Determine appropriate inputMode if not explicitly provided
    const computedInputMode =
      inputMode ||
      {
        email: "email",
        tel: "tel",
        number: "numeric",
        search: "search",
        url: "url",
      }[type];

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
        {/* Pass field props to children from Field.jsx */}
        {(fieldProps) => (
          <input
            {...fieldProps}
            type={type}
            className={styles.textInput}
            inputMode={computedInputMode}
          />
        )}
      </Field>
    );
  }
);

export default TextField;
