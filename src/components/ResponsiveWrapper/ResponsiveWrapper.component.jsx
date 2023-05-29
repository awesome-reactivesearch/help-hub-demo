import React, { useState, useEffect } from "react";
import "./ResponsiveWrapper.css";

const ResponsiveWrapper = ({ children, onBackButtonClick }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      setIsOverlayVisible(true);
    } else {
      setIsOverlayVisible(false);
    }
  };

  useEffect(() => {
    handleResize(); // Initial check on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
    };
  }, []);
  const handleBackButtonClick = () => {
    onBackButtonClick();
  };

  return (
    <div className="responsive-wrapper">
      {isOverlayVisible && (
        <div className="responsive-wrapper__overlay">
          <button
            className="responsive-wrapper__back-button"
            onClick={handleBackButtonClick}
          >
            Back
          </button>
          {children}
        </div>
      )}
      <div className={!isOverlayVisible ? "responsive-wrapper__content" : ""}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveWrapper;
