import { useForm, Controller, useWatch } from "react-hook-form";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./SimpleForm.module.css";
import InlineErrorMessage from "./InlineErrorMessage";
import ErrorSummary from "./ErrorSummary";
import FormField from "./FormField";
import { Calendar, Clock } from "lucide-react";

function ReactHookForm() {
  const {
    register, // Function to register input fields
    handleSubmit, // Function to handle form submission
    watch, // Function to watch field values
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Watch password field to validate requirements in real-time
  const password = watch("password");

  const errorRef = useRef(null);

  // Get all password validation errors
  const getPasswordErrors = (value) => {
    const currValue = value || ""; // Use value passed to the validation function
    const missing = [];

    if (!currValue || currValue.length < 8) missing.push("8+ characters");
    if (!currValue || !/[a-z]/.test(currValue))
      missing.push("lowercase letter");
    if (!currValue || !/[A-Z]/.test(currValue))
      missing.push("uppercase letter");
    if (!currValue || !/[0-9]/.test(currValue)) missing.push("number");

    return missing.length > 0 ? `Password needs: ${missing.join(", ")}` : true;
  };

  // Function to handle form errors
  function onError(errors) {
    console.log("Form submission failed with errors:", errors);
  }

  // Function to handle form submission
  function onSubmit(data) {
    // Add explicit console logs
    console.log("onSubmit triggered!");
    console.log("Form data:", data);
    alert("Success");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className={styles.form}
      noValidate
    >
      <h3>React Hook Form</h3>

      {/* FIELDSET */}
      <fieldset className={styles.stack}>
        <legend>Personal Details</legend>

        {/* NAME INPUT */}
        <div
          className={`
            ${styles["form__field"]} 
            ${errors?.name?.message ? styles["form__field--error"] : ""}
          `}
        >
          <label
            htmlFor="name"
            className={`
              ${styles["form__label"]} 
              ${errors?.name?.message ? styles["form__label--error"] : ""}
          `}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Name is required",
              validate: {
                minLength: (value) =>
                  value.length >= 2 || "Name must be at least 2 characters",
              },
            })}
          />
          {errors?.name?.message && <p>{errors?.name?.message}</p>}
        </div>
        {/* PASSWORD INPUT */}
        <div
          className={`
            ${styles["form__field"]} 
            ${errors?.password?.message ? styles["form__field--error"] : ""}
          `}
        >
          <label
            htmlFor="password"
            className={`
              ${styles["form__label"]} 
              ${errors?.password?.message ? styles["form__label--error"] : ""}
          `}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              validate: {
                requirements: (value) => getPasswordErrors(value),
              },
              // validate: {
              //   minLength: (value) => value.length >= 8 || "minLength",
              //   checkLowercase: (value) =>
              //     /[a-z]/.test(value) || "checkLowercase",
              //   checkUppercase: (value) =>
              //     /[A-Z]/.test(value) || "checkUppercase",
              //   checkNumber: (value) => /[0-9]/.test(value) || "checkNumber",
              // },
            })}
          />
          {/* Show either error or success message */}
          {errors?.password?.message ? (
            <p>{errors.password.message}</p>
          ) : (
            password && (
              <p className={styles.success}>
                ✅ Password meets all requirements
              </p>
            )
          )}
        </div>
        {/*  */}
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ReactHookForm;
