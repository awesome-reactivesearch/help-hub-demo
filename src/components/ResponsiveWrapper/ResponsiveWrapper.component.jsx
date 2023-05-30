import React, { useState, useEffect } from "react";
import "./ResponsiveWrapper.css";

const ResponsiveWrapper = ({ children, onBackButtonClick, showAIAnswer }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setIsOverlayVisible(true);
      } else {
        setIsOverlayVisible(false);
      }
    };
    handleResize(); // Initial check on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
    };
  }, []);
  const handleBackButtonClick = () => {
    onBackButtonClick();
  };
  console.log("rendered responsewrapper", isOverlayVisible, showAIAnswer);
  return (
    <div
      className="responsive-wrapper"
      style={
        !showAIAnswer
          ? {
              height: 0,
              overflow: "hidden",
              zIndex: -5,
              opacity: 0,
            }
          : {}
      }
    >
      {isOverlayVisible ? (
        <div className="responsive-wrapper__overlay">
          <button
            className="responsive-wrapper__back-button"
            onClick={handleBackButtonClick}
          >
            ⬅ Back
          </button>
          {children}
        </div>
      ) : (
        <div className={"responsive-wrapper__content"}>{children}</div>
      )}
    </div>
  );
};

export default React.memo(ResponsiveWrapper);
