import { useEffect, useState } from "react";
import ListItem from "./ListItem";

function List() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an abort controller to cancel the fetch if the component unmounts
    const controller = new AbortController();
    setLoading(true); // Start loading immediately
    setError(null); // Clear previous errors
    async function fetchUsers() {
      try {
        // Fetch users
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error instanceof Error ? error : new Error("Unknown error"));
        }
      } finally {
        setLoading(false);
      }
    }
    // Call the fetchUsers function
    fetchUsers();
    // Cleanup on unmount
    return () => controller.abort();
  }, []);

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4 style={{ color: "red" }}>Error: {error.message}</h4>;
  if (!users.length && !loading) return <h4>No users</h4>;

  return (
    <>
      <h4>User List</h4>
      <ul>
        {users.map((user) => (
          <ListItem key={user.id} {...user} />
        ))}
      </ul>
    </>
  );
}

export default List;
