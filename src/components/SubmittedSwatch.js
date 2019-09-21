import React, { Component } from "react";
import CopyText from "react-copy-text";

class SubmittedSwatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textToCopy: ""
    };
  }

  clickToCopy = () => this.setState({ textToCopy: this.props.hexCode });

  render() {
    const { hexCode, colorName } = this.props;

    return (
      <li
        className="submitted-swatch"
        title="Copy hexcode"
        onClick={this.clickToCopy}
      >
        <button>
          <div style={{ background: hexCode }} className="color-blob"></div>
          <p>{colorName}</p>

          <CopyText text={this.state.textToCopy}></CopyText>
        </button>
      </li>
    );
  }
}

export default SubmittedSwatch;
