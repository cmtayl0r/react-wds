import { useState, useEffect, useCallback } from "react";

const useLocalStorage = (key, initialValue) => {
  // 01 - Initialise state with the value from local storage or the initial value
  // By using a function to query local storage and return the value if it exists
  const [value, setValue] = useState(() => {
    try {
      // Get value from local storage
      const localValue = localStorage.getItem(key);
      return localValue // If the value exists
        ? JSON.parse(localValue) // Parse the value from local storage
        : typeof initialValue === "function" // If the initial value is a function
        ? initialValue() // Call the function
        : initialValue; // Otherwise, return the initial value
    } catch (error) {
      console.error("Error parsing localStorage value:", error);
      // If there's an error parsing the value, return the initial value
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  // 02 - Update local storage when the value changes
  useEffect(() => {
    try {
      // Set value in local storage
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage value:", error);
    }
  }, [key, value]); // Only re-run if the key or value changes

  // 03 - Sync across tabs
  useEffect(() => {
    const syncAcrossTabs = (event) => {
      // If the key matches, update the value
      if (event.key === key) {
        // Parse the value from local storage or use the initial value
        setValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };
    // Listen for changes in local storage across tabs
    window.addEventListener("storage", syncAcrossTabs);
    // Return a function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
    };
  }, [key, initialValue]);

  // 04 - Function to remove a value from local storage
  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  // Return the value and setValue function
  return [value, setValue, remove];
};

export default useLocalStorage;
