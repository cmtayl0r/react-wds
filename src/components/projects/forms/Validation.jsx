import { useCallback, useRef, useState } from "react";
import styles from "./Validation.module.css";

function Validation() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);

  function validateEmail(email) {
    const errors = [];

    if (email.length === 0) errors.push("Required");
    if (!email.endsWith("@webdevsimplified.com"))
      errors.push("Email should end with @webdevsimplified.com");

    return errors;
  }

  function validatePassword(password) {
    const errors = [];

    if (password.length < 10)
      errors.push("Password must be longer than 10 characters");
    if (!password.match(/[a-z]/))
      errors.push("Must include at least 1 lowercase letter");
    if (!password.match(/[A-Z]/))
      errors.push("Must include at least 1 uppercase letter");
    if (!password.match(/[0-9]/)) errors.push("Must include at least 1 number");

    return errors;
  }

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const emailErrorResults = validateEmail(email);
    const passwordErrorResults = validatePassword(password);

    setEmailErrors(emailErrorResults);
    setPasswordErrors(passwordErrorResults);

    if (emailErrorResults.length === 0 && passwordErrorResults.length === 0) {
      alert("Sent success!");
    }
  });

  return (
    <form className={styles.form}>
      <div
        className={`
          ${styles.formGroup} 
          ${emailErrors.length > 0 ? styles.error : ""}
        `}
      >
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailErrors.length > 0 && (
          <div aria-live="polite" className={styles.msg}>
            {emailErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div
        className={`
          ${styles.formGroup} 
          ${passwordErrors.length > 0 ? styles.error : ""}
        `}
      >
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          value={password}
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordErrors.length > 0 && (
          <div aria-live="polite" className={styles.msg}>
            {passwordErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <button className="btn" type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}

export default Validation;
