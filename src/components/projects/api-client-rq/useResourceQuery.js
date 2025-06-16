import { api } from "../../../services/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook using React Query for resource management
 * Provides caching, background updates, and optimistic updates out of the box
 *
 * @param {string} resource - API resource name (e.g., 'users', 'posts')
 * @param {object} [params={}] - Query parameters for the API call
 * @param {boolean} [autoFetch=true] - Whether to automatically fetch data
 * @returns {object} Resource state and CRUD operations
 */

export const useResourceQuery = (resource, params = {}, autoFetch = true) => {
  // React Query client for cache access
  const queryClient = useQueryClient();

  // Unique key includes params - different params = different cache entry
  const queryKey = [resource, params];

  // 1️⃣ FETCH ALL - Main query with caching
  const {
    data: items = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey, // Unique key for this resource
    queryFn: () => api.getAll(resource, params), // Fetch all items for this resource
    enabled: autoFetch, // Only fetch if autoFetch is true
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  // 2️⃣ FETCH BY ID - Simple cache check then API call
  const fetchItemById = async (id) => {
    // Check cache first
    const cachedItem = items.find((item) => item.id === parseInt(id));
    if (cachedItem) return cachedItem;
    // Fetch from API if not cached
    return api.getById(resource, id);
  };

  // 3️⃣ CREATE - Optimistic update
  const createMutation = useMutation({
    mutationFn: (itemData) => api.create(resource, itemData),
    onSuccess: (newItem) => {
      // Optimistic update: immediately add new item to cache
      queryClient.setQueryData(queryKey, (old = []) => [newItem, ...old]);
    },
    onError: () => {
      // Refetch on error to get correct state
      queryClient.invalidateQueries(queryKey);
    },
  });

  // 4️⃣ UPDATE - Optimistic update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.update(resource, id, data),
    onSuccess: (updatedItem, { id }) => {
      // Update item in cache
      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((item) =>
          //  If item ID matches, update it
          item.id === parseInt(id) ? { ...item, ...updatedItem } : item
        )
      );
    },
    onError: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  // 5️⃣ DELETE - Optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id) => api.remove(resource, id),
    onSuccess: (_, id) => {
      // Remove item from cache
      queryClient.setQueryData(queryKey, (old = []) =>
        // If item id matches, filter it out
        old.filter((item) => item.id !== parseInt(id))
      );
    },
    onError: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  // 🎯 Update filters - triggers new query with different cache key
  const updateFilters = (newParams) => {
    // This creates a new query with different key = separate cache entry
    return queryClient.fetchQuery({
      queryKey: [resource, newParams],
      queryFn: () => {
        console.log("🌐 API call with params:", params); // Debug log,
        api.getAll(resource, newParams);
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    // State
    items,
    loading,
    error,

    // Operations
    refetch,
    updateFilters,
    fetchItemById,
    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,

    // Loading states
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};
