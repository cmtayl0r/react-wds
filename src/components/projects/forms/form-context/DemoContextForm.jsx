import { useState } from "react";
import Form from "./Form";
import { required, email, minLength, phone, compose } from "./validation";
import styles from "./ContextFormStyles.module.css";

// Form components
import TextField from "./TextField";
import SelectField from "./SelectField";
import ToggleField from "./ToggleField";
import CheckBoxField from "./CheckBoxField";
import RadioGroupField from "./RadioGroupField";
import TextAreaField from "./TextAreaField";

function DemoContextForm() {
  // State is here because it's specific to this form
  // submitData is used to display the submitted values or send them to an API
  const [submitData, setSubmitData] = useState(null);

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "",
    subject: "",
    message: "",
    subscription: false,
    marketingConsent: false,
  };

  // Validation schema uses validation helpers
  const validationSchema = {
    firstName: compose(
      required("First name is required"),
      minLength(2, "First name must be at least 2 characters")
    ),
    lastName: compose(
      required("Last name is required"),
      minLength(2, "Last name must be at least 2 characters")
    ),
    email: compose(
      required("Email is required"),
      email("Please enter a valid email address")
    ),
    phone: compose(
      required("Phone number is required"),
      phone("Please enter a valid phone number")
    ),
    preferredContact: required("Please select your preferred contact method"),
    subject: required("Please select a subject"),
    message: compose(
      required("Please enter your message"),
      minLength(10, "Message must be at least 10 characters")
    ),
    marketingConsent: required("Please agree to the marketing terms"),
  };

  // Form submission handler
  const handleSubmit = async (values) => {
    // In a real app, you would make an API call here
    console.log("Form submitted with values:", values);
    // Set submitData to the submitted values
    setSubmitData(values);
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      showErrorSummary={true}
    >
      <TextField
        name="firstName"
        label="First Name"
        required
        autoComplete="given-name"
      />
      <TextField
        name="lastName"
        label="Last Name"
        required
        autoComplete="family-name"
      />
      <TextField
        name="email"
        label="Email Address"
        type="email"
        required
        autoComplete="email"
        helpText="We'll never share your email with anyone else."
      />
      <TextField
        name="phone"
        label="Phone Number"
        type="tel"
        required
        autoComplete="tel"
      />
      <RadioGroupField
        name="preferredContact"
        label="Preferred Contact Method"
        options={[
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone" },
        ]}
        required
      />
      <SelectField
        name="subject"
        label="Subject"
        options={[
          { value: "general", label: "General Inquiry" },
          { value: "support", label: "Technical Support" },
          { value: "billing", label: "Billing Question" },
          { value: "feedback", label: "Feedback" },
        ]}
        required
      />
      <TextAreaField
        name="message"
        label="Message"
        rows={5}
        required
        placeholder="Please describe your inquiry or question in detail..."
      />

      <ToggleField name="subscription" label="Subscribe to newsletter?" />
      <CheckBoxField
        name="marketingConsent"
        label="I agree to receive marketing communications and understand I can unsubscribe at any time."
        required
      />
      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </Form>
  );
}

export default DemoContextForm;
