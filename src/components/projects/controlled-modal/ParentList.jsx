import { useState } from "react";
import ControlledModal from "./ControlledModal";

const ParentList = () => {
  // Direct state management instead of custom hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock user data
  const [users] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      bio: "Frontend developer",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      bio: "Backend engineer",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      bio: "UX designer",
    },
  ]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async (formData) => {
    try {
      new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async save
      // Simulate a save operation
      console.log("Saved user data:", formData);
      alert(`User data saved: ${JSON.stringify(formData)}`);
      handleCloseModal(); // Close modal after saving
    } catch (error) {
      console.error("Error saving user data");
      throw error;
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h3 style={{ margin: "0px" }}>User Management</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.bio}{" "}
            <button onClick={() => handleEditUser(user)}>Edit</button>
          </li>
        ))}
      </ul>
      <ControlledModal
        user={selectedUser}
        onSave={handleSaveChanges}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default ParentList;
