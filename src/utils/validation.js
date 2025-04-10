// Universal empty checker that works with strings, arrays, booleans
export function fieldIsEmpty(value) {
  if (Array.isArray(value)) return value.length === 0; // Check if the array is empty (Checkbox or radio groups)
  if (typeof value === "boolean") return value === false; // Check if a boolean is false
  return value === "" || value === null || value === undefined; // Check if the value is empty (Regular inputs)
}
