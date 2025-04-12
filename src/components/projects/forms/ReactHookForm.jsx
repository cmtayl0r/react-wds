import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./SimpleForm.module.css";
import ErrorSummary from "./ErrorSummary";
import FormFieldRHF from "./FormFieldRHF";
import { Calendar, Clock, Clock10Icon } from "lucide-react";

// ! Keyboard navigation from error summary doesn't work (click does)

function ReactHookForm() {
  const {
    register, // Function to register input fields
    handleSubmit, // Function to handle form submission
    formState: {
      errors,
      isSubmitting, // Form is submitting
      touchedFields, // Fields that have been touched
    },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: undefined,
      gender: "",
      date: "",
      time: "",
      earlyContact: false,
    },
    mode: "onTouched", // Delays validation until field is touched (first blur)
    reValidateMode: "onChange", // Re-validate field on every change after initial blur
  });

  // Reference to the error summary container element
  // This lets us focus and scroll to the error summary
  const errorRef = useRef(null);
  // Central ref map to store DOM elements for each field
  const inputRefs = useRef({}); // Store refs centrally

  // Helper: combine RHF's ref + our custom ref tracking
  // This allows us to access the DOM element for each field
  // This collects all refs for each field and stores them in inputRefs
  // we replace register with registerWithRef
  const registerWithRef = (name, options) => {
    const { ref, ...fieldProps } = register(name, options);
    return {
      ...fieldProps,
      ref: (el) => {
        ref(el);
        if (el) inputRefs.current[name] = el;
      },
    };
  };

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

  // Validate business hours
  const validateBusinessHours = (value, [start = "09:00", end = "17:00"]) => {
    const [h, m] = value.split(":").map(Number);
    const total = h * 60 + m;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startTotal = sh * 60 + sm;
    const endTotal = eh * 60 + em;
    return (
      (total >= startTotal && total <= endTotal) ||
      `Time must be between ${start} and ${end}`
    );
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
        tabIndex={-1}
        errors={Object.fromEntries(
          Object.entries(errors).map(([key, val]) => [key, val?.message])
        )}
        fieldRefs={inputRefs}
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
            {...registerWithRef("name", {
              required: "Name is required",
              validate: {
                minLength: (value) =>
                  value.length >= 2 || "Name must be at least 2 characters",
              },
            })}
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
            {...registerWithRef("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
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
            {...registerWithRef("password", {
              required: "Password is required",
              validate: {
                requirements: (value) => getPasswordErrors(value),
              },
            })}
          />
        </FormFieldRHF>

        {/* AGE INPUT */}

        <FormFieldRHF fieldName="age" label="Age" error={errors?.age?.message}>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            {...registerWithRef("age", {
              valueAsNumber: true, // Convert string to number
              required: "Age is required",
              min: { value: 18, message: "Your age must be over 18" },
              max: { value: 60, message: "Maximum age is 60" },
              validate: (value) =>
                !isNaN(value) || "Please enter a valid number",
            })}
          />
        </FormFieldRHF>

        {/* GENDER INPUT   */}

        <FormFieldRHF
          fieldName="gender"
          label="Gender"
          error={errors?.gender?.message}
        >
          <select
            id="gender"
            {...registerWithRef("gender", { required: "Select your gender" })}
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </FormFieldRHF>
      </fieldset>

      {/* FIELDSET */}
      <fieldset className={styles.stack}>
        <legend>Appointment</legend>

        {/* DATE INPUT */}

        <FormFieldRHF
          fieldName="date"
          label="Date"
          error={errors?.date?.message}
        >
          <div className={styles["form__input-icon-wrapper"]}>
            <input
              id="date"
              type="date"
              {...registerWithRef("date", {
                required: "Select an appointment date",
                validate: {
                  pastDate: (value) => {
                    const today = new Date().toISOString().split("T")[0];
                    return value >= today || "Date must be in the future";
                  },
                },
              })}
            />
            <Calendar
              className={styles["form__input-icon"]}
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </FormFieldRHF>

        {/* TIME INPUT */}

        <FormFieldRHF
          fieldName="time"
          label="Time"
          error={errors?.time?.message}
        >
          <div className={styles["form__input-icon-wrapper"]}>
            <input
              id="time"
              type="time"
              {...registerWithRef("time", {
                required: "Select an appointment time",
                validate: {
                  businessHours: (value) =>
                    validateBusinessHours(value, ["09:00", "17:00"]),
                },
              })}
            />
            <Clock
              className={styles["form__input-icon"]}
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </FormFieldRHF>
      </fieldset>

      <button type="submit">{isSubmitting ? "Submitting..." : "Submit"}</button>
    </form>
  );
}

export default ReactHookForm;
