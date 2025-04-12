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
    formState: { errors, touchedFields, submitCount },
    // errors = object of field names and error messages
    // touchedFields = object of field names and boolean values
    // submitCount = number of times the form has been submitted
    control, // Control prop from react-hook-form
    watch, // Function to watch field values
  } = useForm({
    mode: "onTouched", // collects validation errors on blur
    criteriaMode: "all", // collects all validation errors per field
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: "",
      gender: "",
      interests: [],
      subscription: "",
      terms: false,
      date: "",
      time: "",
      earlyContact: false,
    },
  });

  const fieldRefs = useRef({});
  const errorRef = useRef(null);

  // Function to register field refs for error summary focus
  const registerFieldRef = useCallback(
    (name) => (el) => {
      // If element exists (e.g. input) then store ref in fieldRefs
      if (el) fieldRefs.current[name] = el;
    },
    [] // Empty dependency array ensures the function is memoized
  );

  // Function to scroll and focus the first error field
  const scrollToFirstError = () => {
    // Find the first error field
    const firstErrorField = Object.keys(errors)[0];
    // .current is used to access the value of the ref
    const element = fieldRefs.current[firstErrorField];
    if (element) {
      // If we have a ref for this field, scroll and focus it
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => element.focus(), 100);
    }
  };

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  // Function to scroll and focus the first error field
  const onError = () => {
    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    errorRef.current?.focus();
    scrollToFirstError();
  };

  // Function to determine if an error should be shown
  const shouldShowError = (field) =>
    !!(errors[field] && (touchedFields[field] || submitCount > 0));

  // Values for radio and checkbox groups
  const interests = ["sports", "music", "reading"];
  const subscriptionOptions = ["basic", "premium"];

  useEffect(() => {
    console.log("Errors changed:", errors);
  }, [errors]);

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

        <FormField
          fieldName="name"
          label="Name"
          showError={shouldShowError("name")}
          error={errors.name?.message}
        >
          <input
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            aria-invalid={shouldShowError("name") ? "true" : "false"}
            aria-describedby={
              shouldShowError("name") ? "name-error" : undefined
            }
            ref={(el) => registerFieldRef("name", el)}
          />
        </FormField>

        <FormField
          fieldName="email"
          label="Email"
          showError={shouldShowError("email")}
          error={errors.email?.message}
        >
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            })}
            aria-invalid={shouldShowError("email") ? "true" : "false"}
            aria-describedby={
              shouldShowError("email") ? "email-error" : undefined
            }
            ref={(el) => registerFieldRef("email", el)}
          />
        </FormField>

        <FormField
          fieldName="password"
          label="Password"
          showError={shouldShowError("password")}
          error={errors.password?.message}
        >
          <input
            id="password"
            type="password"
            {...register("password", {
              required: true,
              validate: {
                checkLength: (value = "") => value.length >= 8,
                checkLowercase: (value) => /[a-z]/.test(value),
                checkUppercase: (value) => /[A-Z]/.test(value),
                checkNumber: (value) => /[0-9]/.test(value),
              },
            })}
            aria-invalid={shouldShowError("password") ? "true" : "false"}
            aria-describedby={
              shouldShowError("password")
                ? "password-error password-help"
                : "password-help"
            }
            ref={(el) => registerFieldRef("password", el)}
          />
          <div
            id="password-help"
            className={styles["help-text"]}
            aria-live="polite"
            aria-atomic="false"
          >
            <p>Password must include:</p>
            <ul role="list" aria-labelledby="password-help">
              {!errors.password && <li>✅ Password meets the criteria</li>}
              {errors.password?.checkLength && (
                <li>❌ At least 8 characters</li>
              )}
              {errors.password?.checkLowercase && (
                <li>❌ 1 lowercase letter</li>
              )}
              {errors.password?.checkUppercase && (
                <li>❌ 1 uppercase letter</li>
              )}
              {errors.password?.checkNumber && <li>❌ 1 number</li>}
            </ul>
          </div>
        </FormField>

        <FormField
          fieldName="age"
          label="Age"
          showError={shouldShowError("age")}
          error={errors.age?.message}
        >
          <input
            id="age"
            type="number"
            {...register("age", {
              required: "Age is required",
              min: { value: 18, message: "Your age must be over 18" },
              max: { value: 99, message: "Maximum age is 99" },
            })}
            aria-invalid={shouldShowError("age") ? "true" : "false"}
            aria-describedby={shouldShowError("age") ? "age-error" : undefined}
            ref={(el) => registerFieldRef("age", el)}
          />
        </FormField>

        <FormField
          fieldName="gender"
          label="Gender"
          showError={shouldShowError("gender")}
          error={errors.gender?.message}
        >
          <select
            id="gender"
            {...register("gender", { required: "Select your gender" })}
            aria-invalid={shouldShowError("gender") ? "true" : "false"}
            aria-describedby={
              shouldShowError("gender") ? "gender-error" : undefined
            }
            ref={(el) => registerFieldRef("gender", el)}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormField>
      </fieldset>

      {/* FIELDSET */}
      <fieldset className={styles.stack}>
        <legend>Preferences</legend>

        <fieldset
          className={`${styles["form__checkbox-group"]} ${
            shouldShowError("interests") ? styles["form__field--error"] : ""
          }`}
          ref={(el) => registerFieldRef("interests", el)}
          tabIndex={-1}
        >
          <legend className={styles["form__group-legend"]}>Interests</legend>
          {shouldShowError("interests") && (
            <InlineErrorMessage
              idName="interests"
              message={errors.interests?.message}
            />
          )}
          {interests.map((interest) => (
            <div key={interest} className={styles["form__checkbox-item"]}>
              <input
                type="checkbox"
                id={`interests-${interest}`}
                value={interest}
                {...register("interests", {
                  // validate: (value) =>
                  //   value.length > 0 || "Please select at least one interest",
                })}
                ref={(el) => registerFieldRef(`interests-${interest}`, el)}
                aria-invalid={shouldShowError("interests") ? "true" : undefined}
              />
              <label htmlFor={`interests-${interest}`}>{interest}</label>
            </div>
          ))}
        </fieldset>

        <fieldset
          className={`${styles["form__radio-group"]} ${
            shouldShowError("subscription") ? styles["form__field--error"] : ""
          }`}
          tabIndex={-1}
          ref={(el) => registerFieldRef("subscription", el)}
        >
          <legend className={styles["form__group-legend"]}>
            Subscription Type
          </legend>
          {shouldShowError("subscription") && (
            <InlineErrorMessage
              idName="subscription"
              message={errors.subscription?.message}
            />
          )}
          {subscriptionOptions.map((option) => (
            <div key={option} className={styles["form__radio-item"]}>
              <input
                type="radio"
                id={`subscription-${option}`}
                value={option}
                {...register("subscription", {
                  required: "Select a subscription",
                })}
                ref={(el) => registerFieldRef(`subscription-${option}`, el)}
                aria-invalid={
                  shouldShowError("subscription") ? "true" : undefined
                }
              />
              <label htmlFor={`subscription-${option}`}>{option}</label>
            </div>
          ))}
        </fieldset>
      </fieldset>

      <fieldset className={styles.stack}>
        <legend>Appointment</legend>

        <FormField
          fieldName="date"
          label="Date"
          showError={shouldShowError("date")}
          error={errors.date?.message}
        >
          <div className={styles["form__input-icon-wrapper"]}>
            <input
              type="date"
              id="date"
              {...register("date", { required: "Select an appointment date" })}
              aria-invalid={shouldShowError("date") ? "true" : "false"}
              aria-describedby={
                shouldShowError("date") ? "date-error" : undefined
              }
              ref={(el) => registerFieldRef("date", el)}
            />
            <Calendar
              className={styles["form__input-icon"]}
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </FormField>

        <FormField
          fieldName="time"
          label="Time"
          showError={shouldShowError("time")}
          error={errors.time?.message}
        >
          <div className={styles["form__input-icon-wrapper"]}>
            <input
              type="time"
              id="time"
              {...register("time", { required: "Select an appointment time" })}
              aria-invalid={shouldShowError("time") ? "true" : "false"}
              aria-describedby={
                shouldShowError("time") ? "time-error" : undefined
              }
              ref={(el) => registerFieldRef("time", el)}
            />
            <Clock
              className={styles["form__input-icon"]}
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </FormField>

        <FormField
          fieldName="earlyContact"
          label="Contact for earlier availability"
          showError={false}
          error={undefined}
        >
          <div className={styles["form__switch-wrapper"]}>
            <Controller
              control={control}
              name="earlyContact"
              render={({ field }) => (
                <div className={styles["form__switch"]}>
                  <input
                    type="checkbox"
                    role="switch"
                    id="earlyContact"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    ref={(el) => registerFieldRef("earlyContact", el)}
                  />
                  <span
                    className={styles["form__switch-handle"]}
                    aria-hidden="true"
                  />
                </div>
              )}
            />
            <span
              id="earlyContact-description"
              className={styles["form__switch-description"]}
            >
              {watch("earlyContact") ? "Yes please" : "No thanks"}
            </span>
          </div>
        </FormField>
      </fieldset>

      <div
        className={`${styles["form__field"]} ${
          shouldShowError("terms") ? styles["form__field--error"] : ""
        }`}
      >
        {shouldShowError("terms") && (
          <InlineErrorMessage idName="terms" message={errors.terms?.message} />
        )}
        <label className={styles["form__checkbox-item"]}>
          <input
            id="terms"
            type="checkbox"
            {...register("terms", {
              required: "You must agree to the terms",
            })}
            ref={(el) => registerFieldRef("terms", el)}
            aria-invalid={shouldShowError("terms") ? "true" : undefined}
          />
          I agree to the terms and conditions
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ReactHookForm;
