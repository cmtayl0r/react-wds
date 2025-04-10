import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./SimpleForm.module.css";
import InlineErrorMessage from "./InlineErrorMessage";
import ErrorSummary from "./ErrorSummary";
import { fieldIsEmpty } from "../../../utils/validation";
import FormField from "./FormField";

/*
  User inputs content
  On submission of form, user receives error summary
  Clicks from error summary scroll to error field
  On correct input, error message and styles are removed
*/

// ! Fix focus to first checkbox or radio from error summary
// * onChange={(e) => setFormData({ ...formData, name: e.target.value })} , instead of handleChange on inputs
// * fieldIsEmpty is a helper function to check if a field is empty

function SimpleForm() {
  // Centralised form state
  const [formData, setFormData] = useState({
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
  });
  // Track validation errors
  const [errors, setErrors] = useState({});
  // Track if form has been submitted
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // Form and error refs for accessibility
  const formRef = useRef(null);
  const errorRef = useRef(null);
  // Store refs for each form field to enable focus from error summary
  const fieldRefs = useRef({});

  // Field validation functions - memoized to prevent recreating on every render
  // Centralized and reusable, Could be used as a custom hook or helper function
  const validators = useMemo(
    () => ({
      name: (value) =>
        fieldIsEmpty(value) || value.length < 2
          ? "Name must be at least 2 characters"
          : "",
      email: (value) =>
        fieldIsEmpty(value) || !/\S+@\S+\.\S+/.test(value)
          ? "Enter a valid email"
          : "",
      password: (value) => {
        const errors = [];
        if (fieldIsEmpty(value) || value.length < 8)
          errors.push("At least 8 characters");
        if (!/[a-z]/.test(value)) errors.push("1 lowercase letter");
        if (!/[A-Z]/.test(value)) errors.push("1 uppercase letter");
        if (!/[0-9]/.test(value)) errors.push("1 number");
        return errors.length
          ? `Password must contain: ${errors.join(", ")}.`
          : "";
      },
      age: (value) =>
        fieldIsEmpty(value) || value < 18 ? "Your age must be over 18" : "",
      gender: (value) => (!value ? "Select your gender" : ""),
      interests: (value) =>
        fieldIsEmpty(value) || value.length === 0
          ? "Select at least one interest"
          : "",
      subscription: (value) => (!value ? "Select a subscription" : ""),
      terms: (value) =>
        fieldIsEmpty(value) ? "You must agree to the terms" : "",
      date: (value) =>
        fieldIsEmpty(value) ? "Select an appointment date" : "",
      time: (value) =>
        fieldIsEmpty(value) ? "Select an appointment time" : "",
    }),
    []
  );

  // Validate all form fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    // Loop through all form fields
    Object.entries(validators).forEach(([field, validator]) => {
      // field = "email", validator = (value) => !/\S+@\S+\.\S+/.test(value)
      const value = formData[field];
      const error = validator(value);
      if (error) newErrors[field] = error;
    });
    // Only return errors, don't set state
    return newErrors;
  }, [formData, validators]);

  // Function keeps your form state updated in real-time
  // fires continuously as the user types/changes values to update state
  const handleChange = useCallback((e) => {
    // Destructure the event target into properties (name, value, type, checked, files)
    const { name, value, type, checked, files } = e.target;

    // Update form data based on input type
    setFormData((prev) => {
      // 1. Handle checkbox group (arrays e.g. interests[])
      if (type === "checkbox" && Array.isArray(prev[name])) {
        const updated = checked
          ? [...prev[name], value] // Add new interest
          : prev[name].filter((v) => v !== value); // Remove if unchecked

        return { ...prev, [name]: updated };
      }
      // 2. Handle single checkbox or switch (e.g. terms, earlyContact)
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }
      // 3. Handle file input (single file)
      if (type === "file") {
        return { ...prev, [name]: files[0] || null };
      }
      // 4. Handle everything else (text, email, date, time, select, radio)
      return { ...prev, [name]: value };
    });
  }, []); // Only depends on formData which is stable

  // Add function to register field refs for error summary focus
  const registerFieldRef = (id, element) => {
    // if element exists (e.g. input) then store ref in fieldRefs
    // i.e. fieldRefs.current.email = element
    if (element) {
      fieldRefs.current[id] = element;
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Validate all fields
    const newErrors = validateForm();
    // Update errors state
    setErrors(newErrors);

    if (
      // If there are no errors
      // newErrors is an empty object, and the form is valid via native validation
      Object.keys(newErrors).length === 0
      // && formRef.current.checkValidity()
    ) {
      console.log("Form submitted:", formData); // Log form data
      // Process form submission here
      // Optional: reset form
      // setFormData({...initialState});
      // setErrors({});
      // setHasSubmitted(false);
    } else {
      // formRef.current.reportValidity(); // native form validation
      // Focus the error summary
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      errorRef.current?.focus();

      // Focus the first error field
      const firstErrorField = Object.keys(newErrors)[0];
      // If there is a first error field and it has a ref
      if (firstErrorField && fieldRefs.current[firstErrorField]) {
        setTimeout(() => {
          // Focus the first error field after a short delay
          fieldRefs.current[firstErrorField].focus();
        }, 100);
      }
    }
  };

  // Validate form when formData or hasSubmitted changes
  // Show validate inputs after form submission or when formData changes
  useEffect(() => {
    if (hasSubmitted) {
      setErrors(validateForm());
    }
  }, [formData, hasSubmitted, validateForm]);

  // Function to return the error message for a given field only if the form has been submitted
  const showError = (field) => hasSubmitted && errors[field];

  return (
    <form
      ref={formRef} // Assign a ref to the form in order to validate it
      noValidate // Disable browser validation because we're doing it ourselves
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <h3>Form</h3>

      {/* Error Summary */}
      <ErrorSummary
        ref={errorRef}
        errors={errors}
        fieldRefs={fieldRefs.current}
      />

      {/* Fieldset */}
      <fieldset className={styles["stack"]}>
        <legend>Personal Details</legend>
        {/* Name */}
        <FormField
          fieldName={"name"}
          label={"Name"}
          showError={showError}
          error={errors.name}
        >
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            placeholder="Enter your name"
            value={formData.name}
            // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onChange={handleChange}
            aria-describedby={showError("name") ? "name-error" : undefined}
            aria-invalid={showError("name") ? "true" : "false"}
            aria-required="true"
            ref={(el) => registerFieldRef("name", el)}
          />
        </FormField>
        {/* Email */}
        <FormField
          fieldName={"email"}
          label={"Email"}
          showError={showError}
          error={errors.email}
        >
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            aria-describedby={showError("email") ? "email-error" : undefined}
            aria-invalid={showError("email") ? "true" : "false"}
            aria-required="true"
            ref={(el) => registerFieldRef("email", el)}
          />
        </FormField>

        {/* Password */}
        <FormField
          fieldName={"password"}
          label={"Password"}
          showError={showError}
          error={errors.password}
        >
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={8}
            // pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            aria-describedby={
              showError("password")
                ? "password-error password-help"
                : "password-help"
            }
            aria-invalid={showError("password") ? "true" : "false"}
            aria-required="true"
            ref={(el) => registerFieldRef("password", el)}
          />
          <div id="password-help" className={styles["help-text"]}>
            Password must be at least 8 characters with at least 1 uppercase
            letter, 1 lowercase letter, and 1 number.
          </div>
        </FormField>

        {/* Age */}
        <FormField
          fieldName={"age"}
          label={"Age"}
          showError={showError}
          error={errors.age}
        >
          <input
            type="number"
            id="age"
            name="age"
            required
            min={18}
            max={99}
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            aria-describedby={showError("age") ? "age-error" : undefined}
            aria-invalid={showError("age") ? "true" : "false"}
            aria-required="true"
            ref={(el) => registerFieldRef("age", el)}
          />
        </FormField>

        {/* Gender */}
        <FormField
          fieldName={"gender"}
          label={"Gender"}
          showError={showError}
          error={errors.gender}
        >
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            aria-describedby={showError("gender") ? "gender-error" : undefined}
            aria-invalid={showError("gender") ? "true" : "false"}
            aria-required="true"
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

      {/* Fieldset */}
      <fieldset className={styles["stack"]}>
        <legend>Preferences</legend>

        {/* Sub Fieldset [Checkboxes] */}
        <fieldset
          ref={(el) => registerFieldRef("interests", el)}
          tabIndex={-1}
          className={`${styles["form__checkbox-group"]} ${
            showError("interests") ? styles["form__field--error"] : ""
          }`}
        >
          <legend className={styles["form__group-legend"]}>Interests</legend>
          {showError("interests") && (
            <InlineErrorMessage idName="interests" message={errors.interests} />
          )}
          {["sports", "music", "reading"].map((interest) => (
            <div key={interest} className={styles["form__checkbox-item"]}>
              <input
                type="checkbox"
                id={`interests-${interest}`}
                name="interests"
                value={interest}
                checked={formData.interests.includes(interest)}
                onChange={handleChange}
                aria-invalid={showError("interests") ? "true" : undefined}
                ref={(el) => registerFieldRef(`interests-${interest}`, el)}
              />
              <label htmlFor={`interests-${interest}`}>{interest}</label>
            </div>
          ))}
        </fieldset>

        {/* Sub Fieldset [Radio] */}
        <fieldset
          ref={(el) => registerFieldRef("subscription", el)}
          tabIndex={-1}
          aria-describedby={
            showError("subscription") ? "subscription-error" : undefined
          }
          className={`${styles["form__radio-group"]} ${
            showError("subscription") ? styles["form__field--error"] : ""
          }`}
        >
          <legend
            id="subscription-label"
            className={styles["form__group-legend"]}
          >
            Subscription Type
          </legend>
          {showError("subscription") && (
            <InlineErrorMessage
              idName="subscription"
              message={errors.subscription}
            />
          )}
          {["basic", "premium"].map((option) => (
            <div key={option} className={styles["form__radio-item"]}>
              <input
                type="radio"
                id={`subscription-${option}`}
                name="subscription"
                value={option}
                checked={formData.subscription === option}
                onChange={handleChange}
                aria-invalid={showError("subscription") ? "true" : undefined}
                ref={(el) => registerFieldRef(`subscription-${option}`, el)}
              />
              <label htmlFor={`subscription-${option}`}>{option}</label>
            </div>
          ))}
        </fieldset>
        <div
          className={`${styles["form__field"]} ${
            showError("terms") ? styles["form__field--error"] : ""
          }`}
        >
          {showError("terms") && (
            <InlineErrorMessage idName="terms" message={errors.terms} />
          )}
          <label className={styles["form__checkbox-item"]}>
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={formData.terms}
              onChange={handleChange}
              aria-describedby={showError("terms") ? "terms-error" : undefined}
              aria-invalid={showError("terms") ? "true" : "false"}
              ref={(el) => registerFieldRef("terms", el)}
            />
            I agree to the terms and conditions
          </label>
        </div>
      </fieldset>

      {/* Fieldset */}
      <fieldset className={styles["stack"]}>
        <legend>Appointment</legend>

        {/* Date and Time */}
        <FormField
          fieldName={"date"}
          label={"Date"}
          showError={showError}
          error={errors.date}
        >
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            aria-describedby={showError("date") ? "date-error" : undefined}
            aria-invalid={showError("date") ? "true" : "false"}
            aria-required="true"
            ref={(el) => registerFieldRef("date", el)}
          />
        </FormField>

        <FormField
          fieldName={"time"}
          label={"Time"}
          showError={showError}
          error={errors.time}
        >
          <input
            type="time"
            id="time"
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            aria-describedby={showError("time") ? "time-error" : undefined}
            aria-invalid={showError("time") ? "true" : "false"}
            aria-required="true"
            ref={(el) => registerFieldRef("time", el)}
          />
        </FormField>

        {/* Toggle v1 */}
        <FormField
          fieldName={"earlyContact"}
          label={"Contact for earlier availability"}
          showError={showError}
          error={errors.earlyContact}
        >
          <div className={styles["form__switch-wrapper"]}>
            <div className={styles["form__switch"]}>
              <input
                type="checkbox"
                role="switch"
                id="earlyContact"
                name="earlyContact"
                checked={formData.earlyContact}
                onChange={handleChange}
                aria-describedby="earlyContact-description"
              />
              <span
                className={styles["form__switch-handle"]}
                aria-hidden="true"
              />
            </div>
            <span
              id="earlyContact-description"
              className={styles["form__switch-description"]}
            >
              {formData.earlyContact ? "Yes please" : "No thanks"}
            </span>
          </div>
        </FormField>
      </fieldset>

      {/* Form action */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default SimpleForm;
