export const required =
  (message = "This field is required") =>
  (value) => {
    // If the value is an array, check if it's not empty
    if (Array.isArray(value)) return value.length > 0 ? "" : message;
    // If the value is a boolean, check if it's true or false
    if (typeof value === "boolean") return value ? "" : message;
    // If the value is a number, check if it's not 0
    if (typeof value === "number") return "";
    // If the value is a string, check if it's not empty
    return value ? "" : message;
  };

export const email =
  (message = "Please enter a valid email address") =>
  (value) => {
    // If the value is empty, return an empty string
    if (!value) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Test the value against the regex
    return emailRegex.test(value) ? "" : message;
  };

export const minLength = (min, message) => (value) => {
  // If the value is empty, return an empty string
  if (!value) return "";
  // Test the value against the regex based on the min length of the string
  return String(value).length >= min
    ? ""
    : message || `Please enter at least ${min} characters`;
};

export const maxLength = (max, message) => (value) => {
  if (!value) return "";
  // Test the value against the regex based on the max length of the string
  return String(value).length <= max
    ? ""
    : message || `Please enter no more than ${max} characters`;
};

export const pattern = (regex, message) => (value) => {
  if (!value) return "";
  // Test the value against the regex
  return regex.test(value) ? "" : message;
};

export const matches = (fieldName, message) => (value, values) => {
  if (!value) return "";
  // If the value is equal to the value of the field, return an empty string
  // Otherwise, return the error message
  return value === values[fieldName]
    ? ""
    : message || `Does not match ${fieldName}`;
};

export const number =
  (message = "Please enter a valid number") =>
  (value) => {
    // returns an empty string if the value is valid,
    // or a custom error message if it's not.
    if (!value && value !== 0) return "";
    return !isNaN(Number(value)) ? "" : message;
  };

export const min = (minimum, message) => (value) => {
  if (!value && value !== 0) return "";
  return Number(value) >= minimum
    ? ""
    : message || `Please enter a value greater than or equal to ${minimum}`;
};

export const max = (maximum, message) => (value) => {
  if (!value && value !== 0) return "";
  return Number(value) <= maximum
    ? ""
    : message || `Please enter a value less than or equal to ${maximum}`;
};

export const phone =
  (message = "Please enter a valid phone number") =>
  (value) => {
    if (!value) return "";
    // Basic phone validation - adjust regex as needed for your requirements
    const phoneRegex = /^\+?[\d\s()-]{7,20}$/;
    return phoneRegex.test(value) ? "" : message;
  };

// Higher order function
// Takes multiple functions as arguments
/*
  it allows you to chain multiple validation rules 
  for a single field and returns the first validation error that occurs.
*/
export const compose =
  (...validators) =>
  (value, allValues) => {
    // Loop through the validators and return first error encountered
    for (const validator of validators) {
      const error = validator(value, allValues);
      if (error) return error;
    }
    // If no errors, return empty string
    return "";
  };
