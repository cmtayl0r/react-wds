import { useState, useEffect, useCallback, useRef } from "react";

// Listens for a specific key press and calls a callback function when that key is pressed.
export const useKeyDown = (key, onKeyDown) => {
  // State to track if the key is currently pressed
  const [isKeyDown, setIsKeyDown] = useState(false);

  // Create a ref to attach the event listeners to a specific element
  const elementRef = useRef(null);

  // Memoize the keydown event handler
  const handleKeyDown = useCallback(
    (event) => {
      // Check if the pressed key matches the specified key and is not already registered as down
      if (event.key === key && !isKeyDown) {
        setIsKeyDown(true); // Update state to indicate the key is down
        onKeyDown(event); // Call the provided callback function
      }
    },
    [key, isKeyDown, onKeyDown]
  );

  // Memoize the keyup event handler
  const handleKeyUp = useCallback(
    (event) => {
      // Check if the released key matches the specified key
      if (event.key === key) {
        setIsKeyDown(false); // Update state to indicate the key is no longer down
      }
    },
    [key]
  );

  useEffect(() => {
    const targetElement = elementRef.current || document; // Fallback to document if ref is not provided

    // Attach event listeners to the target element
    targetElement.addEventListener("keydown", handleKeyDown);
    targetElement.addEventListener("keyup", handleKeyUp);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      targetElement.removeEventListener("keydown", handleKeyDown);
      targetElement.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Return the ref so it can be attached to a specific element in the parent component
  return elementRef;
};
