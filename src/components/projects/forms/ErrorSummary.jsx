import { forwardRef } from "react";
import styles from "./SimpleForm.module.css";

const ErrorSummary = forwardRef(({ errors, fieldRefs }, ref) => {
  // Only render if there are errors
  if (Object.keys(errors).length === 0) return null;

  // Function to scroll and focus the first error field
  const focusField = (e, fieldId) => {
    e.preventDefault();
    // Get the DOM element for the field and focus it
    const field = fieldRefs?.[fieldId] || document.getElementById(fieldId);
    field?.focus();
  };

  // Function to handle keyboard navigation
  const handleKeyDown = (e, fieldId) => {
    // Add Space key support (Enter already works natively)
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      focusField(e, fieldId);
    }
  };

  return (
    <div
      ref={ref}
      className={styles["form__error-summary"]}
      role="alert"
      aria-labelledby="error-summary-title"
      tabIndex={-1}
    >
      <p id="error-summary-title">
        <strong>Please fix the following:</strong>
      </p>
      <ul>
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(e) => focusField(e, field)}
              onKeyDown={(e) => handleKeyDown(e, field)}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

// Add display name for better debugging
ErrorSummary.displayName = "ErrorSummary";

export default ErrorSummary;
