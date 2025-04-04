import { useEffect, useState } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state on fetch
    setData(null);
    setLoading(true);
    setError(null);

    // Create an abort controller to cancel the fetch if the component unmounts
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        if (error.name !== "AbortError") return;
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }
    // Initialise the fetch
    fetchData();
    // Cleanup on unmount
    return () => controller.abort();
  }, [url]); // Re-run the effect when url changes

  return { data, loading, error };
}

export default useFetch;
