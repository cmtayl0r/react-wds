import { forwardRef } from "react";
import styles from "./SimpleForm.module.css";

const ErrorSummary = forwardRef(({ errors, fieldRefs }, ref) => {
  // Function to handle clicking on an error link
  const handleErrorClick = (e, fieldId) => {
    e.preventDefault();

    // If we have a ref for this field, focus it
    if (fieldRefs && fieldRefs[fieldId]) {
      fieldRefs[fieldId].focus();
    } else {
      // Fallback to traditional anchor behavior if no ref exists
      const element = document.getElementById(fieldId);
      if (element) {
        element.focus();
      }
    }
  };

  // Only render if there are errors
  if (Object.keys(errors).length === 0) {
    return null;
  }
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
            <a href={`#${field}`} onClick={(e) => handleErrorClick(e, field)}>
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
