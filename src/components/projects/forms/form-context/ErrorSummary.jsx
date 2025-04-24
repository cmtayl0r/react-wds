import { useEffect, useRef } from "react";
import styles from "./ContextFormStyles.module.css";

function ErrorSummary({ errors }) {
  // Get number of errors from the errors object
  const errorCount = Object.keys(errors).length;
  // Define ref for the error summary
  const summaryRef = useRef(null);

  // On mount, focus the error summary if there are errors
  useEffect(() => {
    if (errorCount > 0) summaryRef.current?.focus();
  }, [errorCount]);

  // If no errors, return null and don't render
  if (errorCount === 0) return null;

  return (
    <div
      ref={summaryRef}
      className={styles.errorSummary}
      role="alert"
      tabIndex={-1}
    >
      <h4 className={styles.errorSummaryTitle}>
        {errorCount === 1
          ? "There is 1 error in this form"
          : `There are ${errorCount} errors in this form`}
      </h4>
      <ul className={styles.errorSummaryList}>
        {/* Map over the errors object and display each error */}
        {Object.entries(errors).map(([field, error]) => (
          <li key={field}>
            <a href={`#field-${field}`}>{error}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErrorSummary;
