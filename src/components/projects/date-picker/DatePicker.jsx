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
  const [displayMonth, setDisplayMonth] = useState(() => {
    // Initialize with the selected date's month, or current month if no selection
    return value
      ? new Date(value.getFullYear(), value.getMonth(), 1)
      : new Date();
  });
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
    displayMonth,
    setDisplayMonth,
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

DatePicker.Header = () => {
  const { displayMonth, setDisplayMonth } = useContext(DatePickerContext);

  // Navigate to previous month
  const goToPrevMonth = useCallback(() => {
    setDisplayMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, [setDisplayMonth]);

  // Navigate to next month
  const goToNextMonth = useCallback(() => {
    setDisplayMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }, [setDisplayMonth]);

  // Format month label (e.g., "May 2025")
  const monthLabel = displayMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles["date-picker__header"]}>
      <button
        onClick={goToPrevMonth}
        className={styles["month-button"]}
        aria-label="Previous month"
        type="button"
      >
        &larr;
      </button>
      <div className={styles["current-month"]} aria-live="polite">
        {monthLabel}
      </div>
      <button
        onClick={goToNextMonth}
        className={styles["month-button"]}
        aria-label="Next month"
        type="button"
      >
        &rarr;
      </button>
    </div>
  );
};

DatePicker.Weekdays = () => (
  <div className={styles["date-picker__weekdays"]} role="row">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div key={day} role="columnheader" aria-label={day}>
        <abbr
          title={
            day === "Sun"
              ? "Sunday"
              : day === "Mon"
              ? "Monday"
              : day === "Tue"
              ? "Tuesday"
              : day === "Wed"
              ? "Wednesday"
              : day === "Thu"
              ? "Thursday"
              : day === "Fri"
              ? "Friday"
              : "Saturday"
          }
        >
          {day}
        </abbr>
      </div>
    ))}
  </div>
);

DatePicker.Grid = () => {
  const { value, onChange, displayMonth, close } =
    useContext(DatePickerContext);
  const gridRef = useRef(null);

  // Generate calendar grid dates (42 cells = 6 weeks)
  const generateCalendarDates = useCallback(() => {
    // Get first day of the display month
    const firstOfMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      1
    );
    // Get last day of the display month
    const lastOfMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + 1,
      0
    );

    // Calculate how many days from previous month to show
    const startDay = firstOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate total cells needed (always 42 for 6 weeks)
    const totalCells = 42;

    // Generate all dates for the grid
    const dates = [];

    for (let i = 0; i < totalCells; i++) {
      const date = new Date(firstOfMonth);
      date.setDate(date.getDate() - startDay + i);
      dates.push(date);
    }

    return dates;
  }, [displayMonth]);

  const dates = generateCalendarDates();
  const today = new Date();

  // Handle date selection
  const handleDateSelect = useCallback(
    (selectedDate) => {
      onChange(selectedDate);
      close();
    },
    [onChange, close]
  );
  return (
    <div
      ref={gridRef}
      className={styles["date-picker__grid"]}
      role="grid"
      aria-label="Calendar dates"
    >
      {dates.map((date, index) => {
        // Check if date is in current month
        const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
        // Check if date is today
        const isToday = date.toDateString() === today.toDateString();
        // Check if date is selected
        const isSelected =
          value && date.toDateString() === value.toDateString();

        // Create accessible date label
        const dateLabel = date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        return (
          <button
            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
            onClick={() => handleDateSelect(date)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`${styles["date-cell"]} ${
              !isCurrentMonth ? styles["date-cell--other-month"] : ""
            } ${isToday ? styles["date-cell--today"] : ""} ${
              isSelected ? styles["date-cell--selected"] : ""
            }`}
            aria-label={dateLabel}
            aria-selected={isSelected}
            aria-current={isToday ? "date" : undefined}
            tabIndex={isSelected ? 0 : -1}
            type="button"
          >
            {date.getDate()}
          </button>
        );
      })}
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
