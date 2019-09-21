import React from "react";
import { isChrome } from "react-device-detect";

const ColorWallLink = ({ showSearch, isPhone, isSmallTablet }) => {
  return (
    <div className="colorwall-link">
      {(showSearch || !isPhone) && (
        <a className={isChrome && "chrome-styles"} href="#colorWall">
          {isSmallTablet ? (
            <span className="down-arrow">&#8595;</span>
          ) : (
            <span>&#8592;</span>
          )}
          The Color Wall
        </a>
      )}
    </div>
  );
};

export default ColorWallLink;
