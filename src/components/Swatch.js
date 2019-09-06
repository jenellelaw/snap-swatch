import React from 'react';

const Swatch = ({ hexCode, colorName }) => {
  const blobColor = {
    background: hexCode,
  };

  return (
    <li className="swatch">
      <div className="color-blob" style={blobColor}></div>
      <p className="hex-code">{hexCode}</p>
      <p className="color-name">{colorName}</p>
    </li >
  )
}

export default Swatch;