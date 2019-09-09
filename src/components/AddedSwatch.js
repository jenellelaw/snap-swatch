import React from "react";

const AddedSwatch = ({ colorName, removeColor, hexCode }) => {
  return (
    <li
      className="color-blob swatch swatch-added"
      onClick={() => {
        removeColor(hexCode);
      }}
      style={{ background: hexCode }}
    ></li>
  );
};

export default AddedSwatch;
