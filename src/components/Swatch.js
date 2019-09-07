import React, { Component } from "react";
import CopyText from "react-copy-text";

class Swatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // hexCode: this.props.hexCode,
      // colorName: this.props.colorName,
      // swatchType: this.props.swatchType,
      // id: this.props.id,
      textToCopy: ""
    };
  }

  clickToCopy = () => this.setState({ textToCopy: this.state.hexCode });

  render() {
    const {
      hexCode,
      colorName,
      swatchType,
      textToCopy,
      addColor = () => {},
      removeColor = () => {},
      customPalette
    } = this.props;

    const isSelected = `swatch ${swatchType} selected-swatch`;
    const notSelected = `swatch ${swatchType}`;

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
        <div
          className="color-blob"
          onClick={this.clickToCopy}
          title="click to copy hex code"
          style={{ background: hexCode }}
        >
          <CopyText text={textToCopy}></CopyText>
        </div>
        />
        <p className="color-name">{colorName}</p>
        <p className="hex-code">{hexCode}</p>
      </li>
    );
  }
}

export default Swatch;
