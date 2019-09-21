import React, { Component } from "react";
import CopyText from "react-copy-text";

class SubmittedSwatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textToCopy: "",
      textIsCopied: false
    };
  }

  clickToCopy = () => {
    this.setState(
      {
        textToCopy: this.props.hexCode,
        textIsCopied: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            textIsCopied: false
          });
        }, 700);
      }
    );
  };

  render() {
    const { hexCode, colorName } = this.props;
    const { textIsCopied } = this.state;

    return (
      <li
        className="submitted-swatch"
        title="Copy hexcode"
        onClick={this.clickToCopy}
      >
        <button>
          <div style={{ background: hexCode }} className="color-blob"></div>
          <p>{textIsCopied ? "copied!" : colorName}</p>
          <CopyText text={this.state.textToCopy}></CopyText>
        </button>
      </li>
    );
  }
}

export default SubmittedSwatch;
