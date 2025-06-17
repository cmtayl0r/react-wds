import { useResourceQuery } from "./useResourceQuery";
import { useForm } from "react-hook-form";
import useDebounce from "../../../hooks/useDebounce";

const ApiClientRQ = () => {
  // RHF: setup with default filter values
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      search: "", // Search query (debounced)
      status: "", // Status filter (instant)
      gender: "", // Gender filter (instant)
      _sort: "name", // Sort field (instant)
      _order: "asc", // Sort order (instant)
    },
  });

  // RHF: Watch all form values in real-time for live filtering
  const allFilters = watch();

  // HOOK: Debounce only the search input
  // Other filters (dropdowns) update instantly since users make deliberate choices
  const debouncedSearch = useDebounce(allFilters.search, 300);

  // Build final filter object - replace live search with debounced version
  // This ensures search is debounced but other filters are instant
  const finalFilters = {
    ...allFilters, // All current filters
    search: debouncedSearch, // Replace with debounced search
    ...(debouncedSearch && { name: debouncedSearch }),
  };
  // Remove empty values to keep API calls clean
  const cleanFilters = Object.entries(finalFilters).reduce(
    (acc, [key, value]) => {
      if (value && value !== "" && key !== "search") {
        // Exclude empty values and the original search key
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  // RQ HOOK: used with debounced search params
  // React Query will cache each unique search separately
  const {
    items: users,
    loading: isFetching,
    error,
  } = useResourceQuery("users", cleanFilters);

  // Form handlers - onSubmit not needed since we're doing live filtering
  function onSubmit() {
    // Optional: could trigger analytics tracking or validation here
    console.log("Filters applied:", cleanFilters);
  }
  // RHF: Reset all filters to defaults
  function handleReset() {
    reset();
  }

  // 🔢 Calculate search stats for user feedback
  const hasActiveFilters = Object.values(cleanFilters).some(
    (value) => value !== ""
  );
  const isTyping = allFilters.search !== debouncedSearch;
  const totalResults = users?.length || 0;

  return (
    <div className="container">
      <h4>API Client w/ React Query</h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Search controls row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          {/* Search input */}
          <div>
            <label htmlFor="search">🔍 Search Users</label>
            <input
              id="search"
              type="search"
              {...register("search")}
              placeholder="Type to search by name..."
              autoComplete="off"
              aria-label="Search users by name"
              style={{
                width: "100%",
              }}
            />
          </div>
          {/* Status filter */}
          <div>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              {...register("status")}
              style={{ width: "100%" }}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {/* Gender filter */}
          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              {...register("gender")}
              style={{ width: "100%" }}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Sort Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          {/* Sort Field */}
          <div>
            <label>Sort By</label>
            <select {...register("_sort")}>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="id">ID</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label>Order</label>
            <select {...register("_order")}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "end", gap: "0.5rem" }}>
            <button type="submit">Apply</button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "3px solid white",
            }}
          >
            <strong>Active Filters:</strong>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {Object.entries(cleanFilters).map(([key, value]) => (
                <span
                  key={key}
                  style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "0.25rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Search Status Section */}
      <div>
        {/* Show current status */}
        {isFetching ? (
          <span style={{ color: "#6b7280" }}>
            {isTyping
              ? `Typing... (will search for "${allFilters.search}")`
              : "Loading..."}
          </span>
        ) : (
          <span>{hasActiveFilters ? "Filtered Results" : "All Users"}</span>
        )}

        {/* Results Count */}
        <span> {totalResults} results</span>

        {/* Show error state */}
        {error && (
          <p style={{ color: "#dc2626", margin: 0 }}>
            ❌ Error: {error.message}
          </p>
        )}
      </div>

      {/* Display loading state */}
      {isFetching && <div className="loading">Loading users...</div>}

      {/* Display error state */}
      {error && <div className="error">Error: {error.message}</div>}

      {/* Display users list */}
      {!isFetching && users.length > 0 ? (
        <>
          <ul className="user-list" aria-busy={isFetching}>
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong> - {user.email} ({user.status})
              </li>
            ))}
          </ul>
        </>
      ) : (
        // Empty state
        !isFetching && (
          <li>
            {hasActiveFilters
              ? `No users found matching "${debouncedSearch}"`
              : "No users available"}
          </li>
        )
      )}
    </div>
  );
};

export default ApiClientRQ;
