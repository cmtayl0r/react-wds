// hooks/useInfiniteScroll.js
import { useRef, useCallback } from "react";

// Custom hook for infinite scrolling
export function useInfiniteScroll(callback, hasMore, loading) {
  // Create a ref to store the IntersectionObserver instance
  const observerRef = useRef();

  // This function will be attached to the last element in the list
  const lastElementRef = useCallback(
    (node) => {
      // If we are currently loading or there are no more images to load, do nothing
      if (loading || !hasMore) return;

      // If there is already an observer, disconnect it before creating a new one
      if (observerRef.current) observerRef.current.disconnect();

      // Create a new IntersectionObserver
      observerRef.current = new IntersectionObserver((entries) => {
        // If the observed element is visible and there are more items to load
        if (entries[0].isIntersecting && hasMore) {
          // Call the callback to load more items
          callback();
        }
      });

      // If we have a node to observe, start observing it
      if (node) observerRef.current.observe(node);
    },
    [callback, hasMore, loading] // Dependencies for useCallback
  );

  // Return the ref callback to be attached to the last element
  return lastElementRef;
}
