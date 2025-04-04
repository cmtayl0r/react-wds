import { useCallback, useState } from "react";

function useArray(initialValue) {
  const [array, setArray] = useState(initialValue);

  // We use useCallback to memoize the function
  // because we don't want to create a new function on every render

  const push = useCallback((item) => {
    // Add the item to the end of the array
    setArray((arr) => [...arr, item]);
  }, []);

  const replace = useCallback((index, newItem) => {
    // Replace the item at the given index
    setArray((arr) => [
      ...arr.slice(0, index),
      newItem,
      ...arr.slice(index + 1),
    ]);
  }, []);

  const filter = useCallback((callback) => {
    // Filter the array using the given callback
    setArray((arr) => arr.filter(callback));
  }, []);

  const remove = useCallback((index) => {
    // Remove the item at the given index
    setArray((arr) => [...arr.slice(0, index), ...arr.slice(index + 1)]);
  }, []);

  const clear = useCallback(() => {
    // Clear the array
    setArray([]);
  }, []);

  const reset = useCallback(() => {
    // Reset the array to the initial value
    setArray(initialValue);
  }, [initialValue]);

  return { array, set: setArray, push, replace, filter, remove, clear, reset };
}

export default useArray;
