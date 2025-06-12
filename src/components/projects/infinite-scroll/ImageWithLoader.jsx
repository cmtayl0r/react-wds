import { useState } from "react";
import styles from "./InfiniteScroll.module.css";

const ImageWithLoader = ({ src, alt, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className={styles["image-item"]} {...props}>
      {!imageLoaded && (
        <div className={styles["skeleton"]} aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={imageLoaded ? `${styles.visible}` : `${styles.hidden}`}
      />
    </div>
  );
};

export default ImageWithLoader;
