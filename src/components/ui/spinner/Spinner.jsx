import styles from "./Spinner.module.css";

const Spinner = ({ size = "lg", label = "loading...", className = "" }) => {
  return (
    <div
      className={`${styles["loading-spinner"]} ${className}`}
      data-size={size}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="visually-hidden">{label}</span>
    </div>
  );
};

export default Spinner;
