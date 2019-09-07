import React from "react";

const GeneratedSwatch = props => {
  const { removeColor, hexCode } = props;

  console.log(props);
  return (
    <li
      className="color-blob"
      onClick={() => {
        removeColor(hexCode);
      }}
      style={{ background: hexCode }}
    ></li>
  );
};

export default GeneratedSwatch;
