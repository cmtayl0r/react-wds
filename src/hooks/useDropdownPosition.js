import { useEffect, useState } from "react";

export function useDropdownPosition(triggerRef, isOpen, mobileWidth = 500) {
  const [placement, setPlacement] = useState("center");

  useEffect(() => {
    // If the triggerRef is not available, we can't calculate the position
    // If the dropdown is not open, we don't need to calculate the position
    if (!isOpen || !triggerRef.current) return;

    // Get the bounding rectangle of the trigger element
    // and the width of the window
    const { left, right } = triggerRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    console.log("placement", placement);
    console.log(windowWidth);

    // If windowWidth is less than or equal to mobileWidth, set placement to "mobile"
    if (windowWidth <= mobileWidth) {
      setPlacement("mobile");
    } else if (windowWidth - right < 200) {
      setPlacement("right");
    } else if (left < 200) {
      setPlacement("left");
    } else {
      setPlacement("center");
    }
  }, [isOpen, triggerRef, mobileWidth]);

  return placement;
}
