import { useEffect, useState } from "react";
import Spinner from "../../ui/spinner/Spinner";

const LazyLoader = (props) => {
  const { show = false, delay = 0 } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (show) {
      // If show is true, set a timeout to change visibility after the delay
      timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      // If show is false, immediately set visibility to false
      setIsVisible(false);
    }
    // Cleanup function to clear the timeout if the component unmounts or show changes
    return () => {
      clearTimeout(timer);
    };
  }, [show, delay]);

  return isVisible ? <Spinner /> : null;
};

export default LazyLoader;
