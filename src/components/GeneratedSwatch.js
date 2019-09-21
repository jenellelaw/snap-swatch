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

    const colorAlreadyExists = customPalette.some(obj => {
      return obj.hexCode === hexCode;
    });

    const isSelected = `swatch swatch-generated selected-swatch`;
    const notSelected = `swatch swatch-generated`;

    return (
      <li
        className={colorAlreadyExists ? isSelected : notSelected}
        title="Add this color"
        onClick={() =>
          colorAlreadyExists
            ? removeColor(hexCode)
            : addColor(hexCode, colorName)
        }
      >
        <button>
          <div className="color-blob" style={{ background: hexCode }}></div>
          <p className="color-name">{colorName}</p>
          <p className="hex-code">{hexCode}</p>
        </button>
      </li>
    );
  }
}

export default GeneratedSwatch;
