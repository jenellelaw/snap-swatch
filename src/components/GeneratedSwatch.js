import React, { Component } from "react";

class GeneratedSwatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textToCopy: ""
    };
  }

  render() {
    const {
      hexCode,
      colorName,
      addColor = () => {},
      removeColor = () => {},
      customPalette
    } = this.props;

    const isSelected = `swatch swatch-generated selected-swatch`;
    const notSelected = `swatch swatch-generated`;

    const selectedStatus = customPalette.includes(hexCode)
      ? isSelected
      : notSelected;

    return (
      <li
        className={selectedStatus}
        onClick={() =>
          customPalette.includes(hexCode)
            ? removeColor(hexCode)
            : addColor(hexCode)
        }
      >
        <div className="color-blob" style={{ background: hexCode }}></div>
        <p className="color-name">{colorName}</p>
        <p className="hex-code">{hexCode}</p>
      </li>
    );
  }
}

export default GeneratedSwatch;
