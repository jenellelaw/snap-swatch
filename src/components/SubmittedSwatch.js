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
    return (
      <li
        style={{ background: this.props.hexCode }}
        className="color-blob swatch swatch-submitted"
        title="click to copy swatch hexcode"
        onClick={this.clickToCopy}
      >
        <CopyText text={this.state.textToCopy}></CopyText>
      </li>
    );
  }
}

export default SubmittedSwatch;
