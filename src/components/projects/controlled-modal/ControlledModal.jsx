import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ControlledModal = ({ user, onClose, isOpen, onSave }) => {
  // Create a ref to the dialog element
  // This will allow us to control the dialog's visibility
  const dialogRef = useRef(null);

  // Local state for form data - controlled by this modal
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👂 Listen for changes to isOpen prop form parent
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Pre-fill form with user data when opening
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
      });
      // If the modal is open, show it
      dialog.showModal();
    } else {
      // else close it
      dialog.close();
    }
  }, [isOpen, user]);

  // Single event listener for programmatic close() calls (esc, button)
  const handleDialogClose = () => {
    // Reset form state when dialog closes
    setFormData({ name: "", email: "", bio: "" });
    onClose(); // Let parent handle state cleanup
  };

  // Handle clicking on the backdrop to close
  const handleBackdropClick = (e) => {
    if (dialogRef.current && e.target === dialogRef.current)
      dialogRef.current.close();
  };

  // Handle input changes in the form
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  // Child → Parent: "Here's what I collected"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate an async save operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Call the onSave prop with the form data
      await onSave(formData);
      // Parent will handle closing modal after successful save
    } catch (error) {
      console.error("Error saving user data:", error);
      // In real app, you'd show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
    >
      <div
        className="modal-content"
        style={{
          padding: "20px",
          color: "white",
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h4>Controlled Modal</h4>
        <p>User: {formData.name}</p>
        <form action="">
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              name="bio"
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
            />
          </div>
          {/* <button onClick={onSave}>Save</button> */}
          <button onClick={handleDialogClose}>Close</button>
          <button onClick={handleSubmit} type="submit">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </dialog>,
    document.body
  );
};

export default ControlledModal;
