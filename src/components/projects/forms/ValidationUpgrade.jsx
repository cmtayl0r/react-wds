import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Validation.module.css";
import { TriangleAlert } from "lucide-react";

function ValidationUpgrade() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const errorRef = useRef(null);

  // Function to validate inputs
  const validateInputs = useCallback(() => {
    const newErrors = {};

    // Validate email
    if (!emailRef.current.checkValidity()) {
      newErrors.email =
        email === "" ? "Email is Required" : emailRef.current.validationMessage;
    } else if (!email.endsWith("@gmail.com")) {
      // Custom validation
      newErrors.email = "Email must end with 'gmail.com'";
    }

    // Validate password
    if (!passwordRef.current.checkValidity()) {
      newErrors.password =
        password === ""
          ? "Password is Required"
          : passwordRef.current.validationMessage;
    } else {
      // Custom validation
      const pwdErrors = [];
      if (!/[a-z]/.test(password)) pwdErrors.push("1 lowercase letter");
      if (!/[A-Z]/.test(password)) pwdErrors.push("1 uppercase letter");
      if (!/[0-9]/.test(password)) pwdErrors.push("1 number");
      if (pwdErrors.length) {
        newErrors.password = `Must include at least: ${pwdErrors.join(", ")}.`;
      }
    }

    setErrors(newErrors); // Update the errors state with the new errors
    return newErrors; // Return the errors object, some components can use it
  }, [email, password]); // Depend on email and password

  // Function to handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // Set hasSubmitted to true so the form can be validated
      setHasSubmitted(true);
      // Run the validation function
      const validationErrors = validateInputs();

      if (Object.keys(validationErrors).length === 0) {
        // if error object is empty
        // Show success message / DO SOMETHING
        alert("Form submitted successfully!");
        // Reset the errors state
        setErrors({});
      } else if (errorRef.current) {
        // if error object is not empty
        // Scroll to the first error
        errorRef.current.scrollIntoView({ behavior: "smooth" });
        // Focus on the first error
        errorRef.current.focus();
      }
    },
    [validateInputs] //
  );

  // if hasSubmitted is true, run the validation when email, password, or hasSubmitted changes
  // This ensures the validation is run when correcting errors
  useEffect(() => {
    if (hasSubmitted) {
      validateInputs();
    }
  }, [email, password, hasSubmitted, validateInputs]);

  return (
    <form noValidate className={styles.form} onSubmit={handleSubmit}>
      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorRef}
          tabIndex={-1}
          className={styles.errorSummary}
          aria-live="assertive"
        >
          <p>
            <TriangleAlert />
            Please fix the following errors:
          </p>
          <ul>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}>
                <a href={`#${field}`}>{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Form fields */}
      <div
        className={`
          ${styles.formGroup} 
          ${errors.email ? styles.error : ""}
        `}
      >
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          className={styles.input}
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email} // Set aria-invalid to true if there is an error
          aria-describedby="email-error"
        />
        {errors.email && (
          <div className={styles.msg} id="email-error">
            <TriangleAlert />
            {errors.email}
          </div>
        )}
      </div>
      <div
        className={`
          ${styles.formGroup} 
          ${errors.password ? styles.error : ""}
        `}
      >
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          className={styles.input}
          required
          placeholder="Enter your password"
          minLength={10}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,}"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password} // Set aria-invalid to true if there is an error
          aria-describedby="password-error"
        />
        {errors.password && (
          <div className={styles.msg} id="password-error">
            <TriangleAlert />
            {errors.password}
          </div>
        )}
      </div>
      <button className="btn" type="submit">
        Submit
      </button>
    </form>
  );
}

export default ValidationUpgrade;
