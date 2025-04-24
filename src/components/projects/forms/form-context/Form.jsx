import { FormProvider, useForm } from "./FormContext";
import ErrorSummary from "./ErrorSummary";
import styles from "./ContextFormStyles.module.css";

function Form({
  children,
  initialValues = {},
  validationSchema = {},
  onSubmit,
  className,
  showErrorSummary = true,
}) {
  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <FormContent className={className} showErrorSummary={showErrorSummary}>
        {children}
      </FormContent>
    </FormProvider>
  );
}

// Inner component that uses the form context
function FormContent({ children, className, showErrorSummary }) {
  // 💬 Consume context using the useForm hook (state + dispatch helpers)
  const {
    handleSubmit, // Called on <form> submit — dispatches VALIDATE + SUBMIT actions
    errors, // Current error state from reducer
    hasAttemptedSubmit, // Flag to control when to show validation errors
    submitSuccess, // Flag set after successful submit
    resetForm, // Resets all form state via reducer
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${className || ""}`}
      noValidate
    >
      {/* Show error summary if needed and there are errors */}
      {showErrorSummary &&
        hasAttemptedSubmit &&
        Object.keys(errors).length > 0 && <ErrorSummary errors={errors} />}

      {/* Form content */}
      {children}

      {submitSuccess && (
        <div className={styles.successMessage} role="status">
          Form submitted successfully!
          <button
            type="button"
            onClick={resetForm}
            className={styles.ResetButton}
          >
            Submit another response
          </button>
        </div>
      )}
    </form>
  );
}

export default Form;
