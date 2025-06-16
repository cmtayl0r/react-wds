import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/apiClient";

export const useResource = (resource, autoFetch = true) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = useCallback(
    (error) => {
      const errorMessage = error.message || "An error occurred";
      setError(errorMessage);
      console.error(`[useResource] Error fetching ${resource}:`, errorMessage);
    },
    [resource]
  );

  const fetchItems = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all items with optional query params
        const data = await api.getAll(resource, params);
        setItems(data);
        console.log(
          `[useResource] Fetched ${data.length} items from ${resource}`
        );
        return data; // Return fetched data for further use if needed
      } catch (error) {
        handleError(error); // Handle error using the callback
        setItems([]); // Reset to empty array on error
        throw error; // Re-throw error for further handling if needed
      } finally {
        setLoading(false); // Always reset loading state
      }
    },
    [resource, handleError]
  );

  const fetchItemById = useCallback(
    async (id, params = {}) => {
      try {
        const item = await api.getById(resource, id, params);
        return item; // Return the fetched item
      } catch (error) {
        handleError(error); // Handle error using the callback
        throw error; // Re-throw error for further handling if needed
      }
    },
    [resource, handleError]
  );

  // Fetch all items on component mount
  useEffect(() => {
    if (!autoFetch) return; // Skip fetching if autoFetch is false
    fetchItems();
  }, []); // Empty dependency array = run once on mount

  return { items, loading, error, refetch: fetchItems, fetchItemById };
};
