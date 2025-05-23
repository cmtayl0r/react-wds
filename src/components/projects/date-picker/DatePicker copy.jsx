import { useState, useId, useRef, useEffect } from "react";
import { useDropdownPosition } from "../../../hooks/useDropdownPosition";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import useKeyDown from "../../../hooks/useKeyDown";
import styles from "./DatePicker.module.css";
import { forwardRef } from "react";

export function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const modalRef = useRef(null);
  const placement = useDropdownPosition(triggerRef, isOpen);

  // Close on popover Escape
  const handleEscape = () => setIsOpen(false);
  useKeyDown("Escape", handleEscape);

  return (
    <div className={styles["date-picker-container"]}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles["date-picker-button"]}
      >
        Select a date
      </button>
      {isOpen && (
        <DatePickerPopover
          ref={modalRef}
          placement={placement}
          onClose={handleEscape}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

const DatePickerPopover = forwardRef(
  ({ placement, onClose, value, onChange }, ref) => {
    // Focus trap inside the popover
    useFocusTrap(ref, true);

    return (
      <div
        ref={ref}
        className={`${styles["date-picker"]} ${
          styles[`placement--${placement}`]
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles["date-picker__header"]}>
          <button className={styles["month-button"]}>&larr;</button>
          <div className={styles["current-month"]}>May 2025</div>
          <button className={styles["month-button"]}>&rarr;</button>
        </div>
        <div className={`${styles["date-picker__header"]}`}>
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className={styles["date-picker__grid"]}>{/* Render dates */}</div>
        <button onClick={onClose} className={styles["close-button"]}>
          Close
        </button>
      </div>
    );
  }
);
