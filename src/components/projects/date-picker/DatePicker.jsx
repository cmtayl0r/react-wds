import {
  useState,
  useRef,
  createContext,
  useContext,
  useCallback,
  cloneElement,
  useId,
} from "react";
import { useDropdownPosition } from "../../../hooks/useDropdownPosition";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useKeyDown } from "../../../hooks/useKeyDown";
import styles from "./DatePicker.module.css";

// -----------------------------------------------------------------------------
// 1️⃣ Context for sharing state
// -----------------------------------------------------------------------------

const DatePickerContext = createContext();

// -----------------------------------------------------------------------------
// 2️⃣ Parent Component to manage shared state and provide context
// -----------------------------------------------------------------------------

function DatePicker({ children, value, onChange = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const id = useId();

  // Define the position of the dropdown
  // based on the trigger element and whether it's open
  const placement = useDropdownPosition(triggerRef, isOpen);

  // Close with Escape
  const handleEscape = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus(); // Focus back on trigger
  }, []);

  useKeyDown("Escape", handleEscape);

  const contextValue = {
    isOpen,
    setIsOpen,
    triggerRef,
    popoverRef,
    value,
    onChange,
    id,
    placement,
    close: handleEscape,
  };

  return (
    <DatePickerContext.Provider value={contextValue}>
      <div className={styles["date-picker-container"]}>{children}</div>
    </DatePickerContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// 3️⃣ Child Components
// -----------------------------------------------------------------------------

DatePicker.Trigger = ({ children, ...props }) => {
  const { setIsOpen, triggerRef } = useContext(DatePickerContext);

  // Clone the trigger element to add props
  // You have to clone the element in order to add props to it and the ref
  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e);
      setIsOpen((prev) => !prev);
    },
    ref: triggerRef,
    ...props,
  });
};

DatePicker.Popover = ({ children }) => {
  const { isOpen, popoverRef, placement, close } =
    useContext(DatePickerContext);

  // Focus trap inside the popover when open
  useFocusTrap(popoverRef, isOpen);

  //If the popover is not open, return null
  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={`${styles["date-picker"]} ${
        styles[`placement--${placement}`]
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles["date-picker__wrapper"]}>
        {children}
        <button
          onClick={close}
          className={styles["date-picker__close-button"]}
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
};

DatePicker.Header = ({ monthLabel = "May 2025" }) => {
  return (
    <div className={styles["date-picker__header"]}>
      <button className={styles["month-button"]}>&larr;</button>
      <div className={styles["current-month"]}>{monthLabel}</div>
      <button className={styles["month-button"]}>&rarr;</button>
    </div>
  );
};

DatePicker.Weekdays = () => (
  <div className={styles["date-picker__header"]}>
    <div>Sun</div>
    <div>Mon</div>
    <div>Tue</div>
    <div>Wed</div>
    <div>Thu</div>
    <div>Fri</div>
    <div>Sat</div>
  </div>
);

DatePicker.Grid = () => {
  const { value, onChange } = useContext(DatePickerContext);
  // Replace with date generation logic
  return (
    <div className={styles["date-picker__grid"]}>
      {/* Map your dates here */}
      <button onClick={() => onChange(new Date())}>15</button>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4️⃣ Export
// -----------------------------------------------------------------------------

DatePicker.Trigger.displayName = "DatePicker.Trigger";
DatePicker.Popover.displayName = "DatePicker.Popover";
DatePicker.Header.displayName = "DatePicker.Header";
DatePicker.Weekdays.displayName = "DatePicker.Weekdays";
DatePicker.Grid.displayName = "DatePicker.Grid";

export default DatePicker;
