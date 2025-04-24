import {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  useContext,
} from "react";

// 1️⃣ Create context
const FormContext = createContext(null);

// 2️⃣ Reducer Function
const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return {
        ...state, // Spread the existing state (values, touched, errors)
        values: {
          // Spread the existing values
          ...state.values,
          // Update the specific field that changed with the new value
          [action.field]: action.value,
        },
      };

    case "SET_FIELD_TOUCHED":
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case "VALIDATE_FIELD":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };

    case "VALIDATE_FORM":
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0,
      };

    case "SUBMIT_FORM":
      return {
        ...state,
        isSubmitting: true,
        hasAttemptedSubmit: true,
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: true,
        submitError: null,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: false,
        submitError: action.error,
      };

    case "RESET_FORM":
      return {
        ...state.initialState,
        submitSuccess: false,
        submitError: null,
        hasAttemptedSubmit: false,
      };

    default:
      return state;
  }
};

// 3️⃣ Create Provider Component
const FormProvider = ({
  children,
  initialValues = {}, //
  validationSchema = {}, //
  onSubmit, //
}) => {
  // 3A: 🗄️ Initialise form state
  const initialState = {
    values: initialValues,
    touched: {},
    errors: {},
    isValid: true,
    isSubmitting: false,
    submitSuccess: false,
    submitError: null,
    hasAttemptedSubmit: false,
    initialState: { values: initialValues, touched: {}, errors: {} },
  };
  // 3B: 🗄️ Create reducer state and dispatch
  const [state, dispatch] = useReducer(formReducer, initialState);

  // 3C: 🛠️ HELPER METHODS

  // Function to determine if a field should show an error
  const shouldShowError = useCallback(
    (fieldName) => {
      return (
        // if touched or tried to submit form
        (state.touched[fieldName] || state.hasAttemptedSubmit) &&
        //
        !!state.errors[fieldName]
      );
    },
    [state.touched, state.hasAttemptedSubmit, state.errors]
  );

  // Memoize field value setter
  const setFieldValue = useCallback(
    (field, value) => {
      dispatch({ type: "SET_FIELD_VALUE", field, value });

      // Validate the field if we have a validation function for it
      if (validationSchema[field]) {
        const error = validationSchema[field](value, state.values);
        dispatch({ type: "VALIDATE_FIELD", field, error });
      }
    },
    [validationSchema, state.values]
  );

  // Memoize field touched setter
  const setFieldTouched = useCallback(
    (field) => {
      dispatch({ type: "SET_FIELD_TOUCHED", field });

      if (validationSchema[field]) {
        const error = validationSchema[field](
          state.values[field],
          state.values
        );
        dispatch({ type: "VALIDATE_FIELD", field, error });
      }
    },
    [validationSchema, state.values]
  ); // Dependencies: dependency

  // Memoize form validation function
  const validateForm = useCallback(() => {
    const errors = {};

    // Run validation for each field
    Object.keys(validationSchema).forEach((field) => {
      const error = validationSchema[field](state.values[field], state.values);
      if (error) errors[field] = error;
    });

    dispatch({ type: "VALIDATE_FORM", errors });
    return Object.keys(errors).length === 0;
  }, [validationSchema, state.values]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      dispatch({ type: "SUBMIT_FORM" });
      const isValid = validateForm();

      if (isValid && onSubmit) {
        try {
          await onSubmit(state.values);
          dispatch({ type: "SUBMIT_SUCCESS" });
          return true;
        } catch (error) {
          dispatch({ type: "SUBMIT_ERROR", error });
          return false;
        }
      }

      return false;
    },
    [validateForm, onSubmit, state.values]
  );

  // Memoize form reset handler
  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []); // Dependencies: dependency

  // 3D: 📦 MEMOIZE the context value
  const contextValue = useMemo(
    () => ({
      // State
      values: state.values,
      touched: state.touched,
      errors: state.errors,
      isValid: state.isValid,
      isSubmitting: state.isSubmitting,
      submitSuccess: state.submitSuccess,
      submitError: state.submitError,
      hasAttemptedSubmit: state.hasAttemptedSubmit,

      // Methods
      setFieldValue,
      setFieldTouched,
      validateForm,
      handleSubmit,
      resetForm,
      shouldShowError,

      // original props
      validationSchema,
      onSubmit,
    }),
    [
      // State dependencies
      state.values,
      state.touched,
      state.errors,
      state.isValid,
      state.isSubmitting,
      state.submitSuccess,
      state.submitError,
      state.hasAttemptedSubmit,

      // Method dependencies
      setFieldValue,
      setFieldTouched,
      validateForm,
      handleSubmit,
      resetForm,
      shouldShowError,

      // Prop dependencies
      validationSchema,
      onSubmit,
    ]
  );

  // 3E: Return context value via Context provider
  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

// 4️⃣ Create Hook
const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within FormProvider");
  return context;
};

// 5️⃣ Export
export { FormProvider, useForm };
