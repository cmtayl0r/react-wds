import { api } from "../../../services/apiClient";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import LazyLoader from "../api-client-vanilla/LazyLoader";
import { useState } from "react";

const BasicRQ = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [fetchingPokemon, setFetchingPokemon] = useState(false);

  const limit = 20;

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    fetchNextPage, // Function to fetch next page
    hasNextPage, // Whether there are more pages to fetch
    isFetchingNextPage, // Whether the next page is currently being fetched
  } = useInfiniteQuery({
    queryKey: ["berry", "infinite"],
    queryFn: ({ pageParam = 0 }) => {
      // pageParam starts as 0 (first offset), then increments
      console.log(`Fetching page with offset: ${pageParam}`);
      return api.getAll("berry", { limit, offset: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate next page offset from API response
      // If there's a next URL, calculate the offset for next page
      if (lastPage.next) {
        return allPages.length * limit; // offset = pageNumber * limit
      }
      return undefined; // No more pages
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - items don't change often
    retry: 3,
  });

  // Safe data extraction and derived state with fallbacks
  const allBerries = data?.pages.flatMap((page) => page.results) || []; // Flatten all pages into a single array
  const totalCount = data?.pages[0]?.count || 0;
  const currentlyLoaded = allBerries.length;

  // 🛠️ Handlers

  const handleFetchPokemon = async (name) => {
    try {
      setFetchingPokemon(true);
      console.log("Fetching berry with Name:", name);
      const poke = await api.getById("berry", name);
      setSelectedPokemon(poke);
    } catch (error) {
      console.error("Error fetching berry:", error);
    } finally {
      setFetchingPokemon(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="container">
      <h4>Basic React Query</h4>

      <header
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          border: "1px solid #555",
          padding: "1rem",
        }}
      >
        <code>
          Loaded {currentlyLoaded} of {totalCount} berries
        </code>
        <br />
        <small>
          Pages loaded: {data?.pages.length || 0} |
          {hasNextPage ? " More available" : " All loaded"}
        </small>
      </header>

      {/* Items */}
      <h5>Pokemon Berries</h5>
      <LazyLoader show={isLoading} delay={300} />
      {isError && <p>Error loading berries. Please try again later.</p>}
      <ul>
        {isSuccess &&
          allBerries.map((p, index) => (
            <li
              key={p.name || p.id}
              style={{ display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <strong>{index + 1}</strong>
              <strong style={{ color: "pink" }}>{p.name}</strong>
              <button onClick={() => handleFetchPokemon(p.name)}>
                Show detail
              </button>
            </li>
          ))}
      </ul>

      {/* ✅ BEST PRACTICE: Load More Button (better UX than auto-scroll) */}
      {hasNextPage && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: isFetchingNextPage ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isFetchingNextPage ? "not-allowed" : "pointer",
            }}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : `Load More (${totalCount - currentlyLoaded} remaining)`}
          </button>
        </div>
      )}

      {/* ✅ End of results indicator */}
      {!hasNextPage && allBerries.length > 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          🎉 You've reached the end! All {totalCount} berries loaded.
        </div>
      )}

      {/* ✅ Loading indicator for next page */}
      {isFetchingNextPage && (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <LazyLoader show={true} delay={0} />
          <div>Loading more berries...</div>
        </div>
      )}

      {/* Selected Item */}
      <article
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          padding: "1rem",
          backgroundColor: "black",
          border: "1px solid #dee2e6",
          maxWidth: "400px",
        }}
      >
        <h5>Selected Berry</h5>
        <div>
          <LazyLoader show={fetchingPokemon} delay={300} />
          {!fetchingPokemon ? (
            selectedPokemon ? (
              <div>
                <h5 style={{ color: "red" }}>{selectedPokemon.name}</h5>
                <ul>
                  <li>Firmness: {selectedPokemon.firmness.name}</li>
                  <li>Flavors</li>
                  <ul>
                    {selectedPokemon.flavors.map((f) => (
                      <li key={f.flavor.name}>
                        {f.flavor.name} - {f.potency}
                      </li>
                    ))}
                  </ul>
                  <li>Size: {selectedPokemon.size}</li>
                  <li>Smoothness: {selectedPokemon.smoothness}</li>
                </ul>
                {/* <p>ID: {selectedAbility.id}</p>
                <p>Effect: {selectedAbility.effect_entries?.[0]?.effect}</p> */}
              </div>
            ) : (
              <p>No Berry selected</p>
            )
          ) : null}
        </div>
      </article>
    </div>
  );
};

export default BasicRQ;
