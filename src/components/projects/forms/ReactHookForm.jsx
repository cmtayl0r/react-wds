import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./SimpleForm.module.css";
import ErrorSummary from "./ErrorSummary";
import FormFieldRHF from "./FormFieldRHF";
import { Calendar, Clock } from "lucide-react";

// ! Keyboard navigation from error summary doesn't work (click does)

function ReactHookForm() {
  const {
    register, // Function to register input fields
    handleSubmit, // Function to handle form submission
    watch, // Function to watch field values
    formState: {
      errors,
      isSubmitting, // Form is submitting
      isSubmitSuccessful,
      isValid, // Form is valid if all fields are valid
      dirtyFields, // Fields that have been modified
      touchedFields, // Fields that have been touched
    },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched", // Delays validation until field is touched (first blur)
    reValidateMode: "onChange", // Re-validate field on every change after initial blur
  });

  // Stores references to all form field elements by their name
  // This allows us to programmatically focus specific fields later
  const fieldRefs = useRef({});
  // Reference to the error summary container element
  // This lets us focus and scroll to the error summary
  const errorRef = useRef(null);

  // This callback creates a function that registers DOM elements as refs
  // It's memoized so it doesn't recreate on every render
  const registerFieldRef = useCallback(
    (name) => (el) => {
      // If element exists (e.g. input) then store ref in fieldRefs
      if (el) fieldRefs.current[name] = el;
    },
    [] // Empty dependency array ensures this function remains stable
  );

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
    // scroll to error summary container
    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus on the first error link in the summary (not just the container)
    setTimeout(() => {
      const firstErrorLink = errorRef.current?.querySelector("a");
      if (firstErrorLink) {
        firstErrorLink.focus();
      } else {
        // Fallback to summary container if links aren't ready
        errorRef.current?.focus();
      }
    }, 100);
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

      {/* ERROR SUMMARY */}
      <ErrorSummary
        ref={errorRef}
        errors={Object.fromEntries(
          Object.entries(errors).map(([key, val]) => [key, val?.message])
        )}
        fieldRefs={fieldRefs.current}
      />

      {/* FIELDSET */}
      <fieldset className={styles.stack}>
        <legend>Personal Details</legend>

        {/* NAME INPUT */}

        <FormFieldRHF
          fieldName="name"
          label="Name"
          error={errors?.name?.message}
        >
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
            ref={(el) => registerFieldRef("name", el)}
          />
        </FormFieldRHF>

        {/* EMAIL INPUT */}

        <FormFieldRHF
          fieldName="email"
          label="Email"
          error={errors?.email?.message}
        >
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            ref={(el) => registerFieldRef("email", el)}
          />
        </FormFieldRHF>

        {/* PASSWORD INPUT */}

        <FormFieldRHF
          fieldName="password"
          label="Password"
          error={errors?.password?.message}
          showValidMessage={true}
          isDirty={touchedFields.password}
          isTouched={touchedFields.password}
        >
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
            ref={(el) => registerFieldRef("password", el)}
          />
        </FormFieldRHF>
      </fieldset>

      <button type="submit">{isSubmitting ? "Submitting..." : "Submit"}</button>
    </form>
  );
}

export default ReactHookForm;
