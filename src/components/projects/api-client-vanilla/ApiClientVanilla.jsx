import { useEffect, useMemo, useState } from "react";
import { useResource } from "./useResource";

const ApiClientVanilla = () => {
  const {
    items: users,
    loading: usersLoading,
    error: usersError,
  } = useResource("users");
  const {
    items: allPosts,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useResource("posts");

  // 2️⃣ Fetch with query parameters
  const [filter, setFilter] = useState("all");
  // Get unique user IDs for select options
  const uniqueUserIds = useMemo(() => {
    const userIds = [...new Set(allPosts.map((post) => post.user_id))];
    return userIds.sort((a, b) => a - b); // Numeric sort
  }, [allPosts]);
  // Filter posts based on selected user
  const filteredPosts = useMemo(() => {
    if (filter === "all") return allPosts;
    return allPosts.filter((post) => post.user_id === parseInt(filter)); // Convert string to number
  }, [allPosts, filter]);

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h4>API Client Vanilla</h4>

      {/*  */}
      <h5>1️⃣ Fetch on mount</h5>
      <div>
        {usersLoading && <div className="loading">Loading users...</div>}
        {usersError && <div className="error">Error: {usersError}</div>}
        {users.length > 0 && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*  */}
      <h5>2️⃣ Fetch with query parameters</h5>
      <div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={postsLoading}
        >
          <option value="all">All users</option>
          {uniqueUserIds.map((userId) => {
            const postCount = allPosts.filter(
              (post) => post.user_id === userId
            ).length;
            return (
              <option key={userId} value={userId}>
                User: {userId} - {postCount} posts
              </option>
            );
          })}
        </select>
        {postsLoading && (
          <div className="loading">Loading filtered posts...</div>
        )}
        {postsError && <div className="error">Error: {postsError}</div>}
        <p>Filtered posts: {filteredPosts.length}</p>
        {!postsLoading && !postsError && filteredPosts.length > 0 && (
          <ul>
            {filteredPosts.map((post) => (
              <li key={post.id}>
                {post.title} by {post.user_id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApiClientVanilla;
