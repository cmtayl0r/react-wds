import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./FormStyles.module.css";

// ! Fix first link focus not working in ErrorSummary after form submit
// * Icons in inputs for date and time etc

// 🧩 FORM COMPONENTS
import InputField from "./form-fields/InputField";
import SelectField from "./form-fields/SelectField";
import CheckboxGroupField from "./form-fields/CheckboxGroupField";
import CheckboxField from "./form-fields/CheckboxField";
import ToggleField from "./form-fields/ToggleField";
import RadioGroupField from "./form-fields/RadioGroupField";
import ErrorSummary from "./form-fields/ErrorSummary";

function SimpleFormTwo() {
  // 🗄️ INITIAL FORM VALUES
  const initialForm = useMemo(
    () => ({
      name: "",
      phone: "",
      date: "",
      email: "",
      password: "",
      country: "", // Select
      contactMethod: "", // Radio group
      newsletter: false, // Checkbox single
      preferences: [], // Checkbox group
      agree: false, // Toggle switch
    }),
    []
  );

  // 🗄️ STATE
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false); // 💬 Used to trigger post-submit validation on change
  const [successMessage, setSuccessMessage] = useState("");

  // 🔗 REFS
  const fieldRefs = useRef({}); // store a ref for each field
  const errorRef = useRef(null); // ref to the error summary container

  // HELPER FUNCTION : Check if field is empty
  const fieldIsEmpty = (value) => {
    // Check if the value array is empty (Checkbox or radio groups)
    if (Array.isArray(value)) return value.length === 0;
    // Check if a boolean is false
    // That would mean: booleans are never “empty”, only unchecked required fields should be manually validated.
    if (typeof value === "boolean") return value === false;
    // Handle numbers (0 is a valid value!)
    if (typeof value === "number") return false;
    // Check if the value is empty (Regular inputs) or null or undefined
    return value === "" || value === null || value === undefined;
  };

  // HELPER FUNCTION: Focus first field with error after validation
  const focusFirstError = (errors) => {
    // Find the first error field
    const firstErrorKey = Object.keys(errors)[0];
    console.warn("First error field:", firstErrorKey);
    // .current is used to access the value of the ref
    const ref = fieldRefs.current[firstErrorKey];
    if (ref?.focus) {
      requestAnimationFrame(() => {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.focus();
        // console.warn("First error field:", firstErrorKey);
      });
    }
  };

  // HELPER FUNCTION: Function to register field refs for error focus
  const registerFieldRef = (name, element) => {
    // if element exists (e.g. input) then store ref in fieldRefs
    // i.e. fieldRefs.current.email = element
    if (element) {
      fieldRefs.current[name] = element;
    }
  };

  // ⚠️ Validation functions
  const validationSchema = useMemo(
    () => ({
      // NAME
      name: (value) =>
        fieldIsEmpty(value) || value.length < 2
          ? "Name must be at least 2 characters"
          : "",
      // PHONE
      phone: (value) =>
        fieldIsEmpty(value) || !/^\+?\d{7,15}$/.test(value)
          ? "Enter a valid phone number"
          : "",
      // DATE
      date: (value) => (fieldIsEmpty(value) ? "Date is required" : ""),
      // EMAIL
      email: (value) =>
        fieldIsEmpty(value) || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
          ? "Enter a valid email"
          : "",
      // PASSWORD
      password: (value) => {
        const pwdErrors = [];
        if (fieldIsEmpty(value) || value.length < 8)
          pwdErrors.push("At least 8 characters");
        if (!/[a-z]/.test(value)) pwdErrors.push("1 lowercase letter");
        if (!/[A-Z]/.test(value)) pwdErrors.push("1 uppercase letter");
        if (!/[0-9]/.test(value)) pwdErrors.push("1 number");
        return pwdErrors.length
          ? `Password must contain: ${pwdErrors.join(", ")}.`
          : "";
      },
      // COUNTRY
      country: (value) => (fieldIsEmpty(value) ? "Select a country" : ""),
      // CONTACT METHOD
      contactMethod: (value) =>
        fieldIsEmpty(value) ? "Select a contact method" : "",
      // NEWSLETTER
      newsletter: (value) =>
        fieldIsEmpty(value) ? "Newsletter is required" : "",
      // PREFERENCES
      preferences: (value) =>
        fieldIsEmpty(value) ? "Select at least one preference" : "",
      // AGREE
      agree: (value) =>
        fieldIsEmpty(value) ? "You must agree to the terms" : "",
    }),
    []
  );

  // 🛠️ FUNCTION: Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Iterate over validationSchema and validate each field
    Object.entries(validationSchema).forEach(([key, validator]) => {
      const value = formData[key];
      const error = validator(value);
      if (error) newErrors[key] = error;
    });

    // Return errors, not set state, because we don't want to trigger a re-render
    return newErrors;
  }, [formData, validationSchema]);

  // 📡 EFFECT: Auto validate after submit when input changes
  useEffect(() => {
    if (hasSubmitted) {
      // Keeps errors in sync after the user has interacted
      // Prevents stale errors after a field is corrected (e.g. checkboxes, toggles)
      setErrors(validateForm());
    }
  }, [formData, hasSubmitted, validateForm]);

  // 🛠️ HELPER FUNCTION: determines whether to display a field’s error message (true)
  // only after the user has interacted with it (blurred) or attempted to submit the form
  const showError = (fieldName) =>
    hasSubmitted || touched[fieldName] ? errors[fieldName] : null;

  // 🛠️ FUNCTION: Update state on touch tracking, not validation.
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    // Mark as touched when the field is blurred by the user
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // 🛠️ FUNCTION: Update state on input change
  const handleChange = useCallback((e) => {
    // Destructure the event target into properties (name, value, type, checked, files)
    const { name, type, checked, value, files } = e.target;

    // Update form state with the new value
    setFormData((prev) => {
      // 1. Handle checkbox group
      if (type === "checkbox" && Array.isArray(prev[name])) {
        const newValue = checked
          ? [...prev[name], value] // Add new value
          : prev[name].filter((v) => v !== value); // Remove value
        return { ...prev, [name]: newValue };
      }
      // 2. Handle single checkbox or switch
      if (type === "checkbox") {
        return { ...prev, [name]: checked }; // ✅ Boolean only
      }
      // 3. Handle file input (single file)
      if (type === "file") {
        return { ...prev, [name]: files[0] || null };
      }
      // 4. Handle everything else (text, email, date, time, select, radio)
      return { ...prev, [name]: value };
    });
  }, []);

  // 🛠️ FUNCTION: Submit form data
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const newErrors = validateForm(); // Run validation
      setErrors(newErrors); // Update errors state, if any errors exist
      setHasSubmitted(true); // trigger re-render & useEffect

      // ⚠️ If errors exist, focus on first error
      if (Object.keys(newErrors).length > 0) {
        // OPTION 1: Focus the the first link in the ErrorSummary
        // scroll to error summary container
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        requestAnimationFrame(() => {
          // Focus on the first error link in the summary (not just the container)
          const firstErrorLink = errorRef.current?.querySelector("a");
          if (firstErrorLink) {
            firstErrorLink.focus(); // trigger :focus-visible naturally
          } else {
            errorRef.current?.focus(); // fallback if no links rendered yet
          }
        });

        // OPTION 2: Focus the first error field
        // focusFirstError(newErrors);

        console.log("Error Ref:", errorRef.current);
        console.warn("Form submission failed with errors:", newErrors);
        console.log("Refs:", fieldRefs.current);
        return;
      }
      // ✅ Valid, do something with form data
      console.log("Form submitted", formData);
      // Set success message
      // Optional: Use a ref to scroll user to the success message
      setSuccessMessage("👍 Form submitted successfully!");
      // Clear form and errors
      setFormData(initialForm);
      setErrors({});
      setTouched({});
      setHasSubmitted(false);
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    },
    [formData, validateForm, initialForm]
  );

  // 🔘 FIELD DEFINITIONS
  const FIELD_DEFINITIONS = useMemo(
    () => [
      {
        id: "name",
        name: "name",
        type: "text",
        label: "Name",
        placeholder: "Enter your name",
        required: true,
      },
      {
        id: "phone",
        name: "phone",
        type: "tel",
        label: "Phone",
        placeholder: "Enter your phone number",
        required: true,
      },
      {
        id: "date",
        name: "date",
        type: "date",
        label: "Date",
        required: true,
      },
      {
        id: "email",
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
      },
      {
        id: "password",
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Enter your password",
        required: true,
      },
      {
        id: "country",
        name: "country",
        label: "Country",
        type: "select",
        options: ["USA", "UK", "Germany"],
        required: true,
      },
      {
        id: "contactMethod",
        name: "contactMethod",
        label: "Preferred contact",
        type: "radio",
        options: ["Email", "Phone"],
        required: true,
      },
      {
        id: "newsletter",
        name: "newsletter",
        label: "Subscribe to newsletter",
        type: "checkbox",
        required: true,
      },
      {
        id: "preferences",
        name: "preferences",
        label: "What do you like?",
        type: "checkboxGroup",
        options: ["Cats", "Dogs", "Birds"],
        required: true,
      },
      {
        id: "agree",
        name: "agree",
        label: "Agree to terms",
        type: "switch",
        required: true,
      },
    ],
    []
  );

  // 🧩 FIELD COMPONENTS
  const FIELD_COMPONENTS = {
    text: InputField,
    email: InputField,
    tel: InputField,
    date: InputField,
    password: InputField,
    select: SelectField,
    checkbox: CheckboxField, // single
    checkboxGroup: CheckboxGroupField,
    radio: RadioGroupField,
    switch: ToggleField,
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Form 2</h2>

      {/* Form Error Summary */}
      <ErrorSummary
        ref={errorRef}
        errors={errors}
        fieldRefs={fieldRefs.current}
      />

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className={styles["form__success"]}
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}

      {/* Form */}
      <fieldset className={styles["stack"]}>
        <legend>Form</legend>

        {FIELD_DEFINITIONS.map((field) => {
          // Connect field to the correct component
          const FieldComponent = FIELD_COMPONENTS[field.type];
          // If no matching component, return null
          if (!FieldComponent) return null;

          // Props common to all inputs
          // Keys from FIELD_DEFINITIONS are also factored into the sharedProps
          const sharedProps = {
            ...field, // Spread the field object and its other props
            value: formData[field.name],
            onChange: handleChange,
            onBlur: handleBlur,
            error: showError(field.name),
            ref: (el) => registerFieldRef(field.name, el),
          };

          // Add .checked for checkbox/switch components
          if (field.type === "checkbox" || field.type === "switch") {
            sharedProps.checked = formData[field.name];
          }

          // Return the correct field component and its props
          return <FieldComponent key={field.id} {...sharedProps} />;
        })}
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
}

export default SimpleFormTwo;
