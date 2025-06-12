import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./InfiniteScroll.module.css";
import ImageWithLoader from "./ImageWithLoader";
import { useInfiniteScroll } from "./useInfiniteScroll";

const LIMIT = 10;

const InfiniteScroll = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔁 Fetch next page of images
  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=${LIMIT}&page=${page}`
      );
      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data]);
      console.log(images);
      setHasMore(data.length === LIMIT);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, images]);

  // 🔁 On first mount
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔍 Observe the last image to trigger load
  // Use the custom hook for infinite scroll
  // It is assigned to the last image in the list
  const lastImageRef = useInfiniteScroll(fetchImages, hasMore, loading);

  return (
    <>
      <section className={styles["image-grid"]}>
        {images.map((image, index) => (
          <ImageWithLoader
            ref={index === images.length - 1 ? lastImageRef : null}
            src={image.url}
            key={image.id}
          />
        ))}
      </section>
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
        }}
      >
        {page} pages with {images.length} images loaded
      </div>
      {/* {loading && <h2 style={{ marginTop: "24px" }}>Loading more...</h2>} */}
    </>
  );
};

export default InfiniteScroll;
