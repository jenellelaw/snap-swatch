import React, { Component } from 'react';
import CopyText from 'react-copy-text';

class Swatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hexCode: this.props.hexCode,
      colorName: this.props.colorName,
      textToCopy: ''
    }
  }

  clickToCopy = () => this.setState({ textToCopy: this.state.hexCode })

  // copyColor = (e) => {
  //   const copyText = e.target.nextElementSibling.innerText;
  //   copyText.select();
  //   document.execCommand('copy');

  //   // const copyText = this.props.hexCode;
  //   // copyText.select();
  //   // document.execCommand("copy");
  // }

  render() {
    return (
      <li className="swatch">
        <div className="color-blob"
          onClick={this.clickToCopy}
          style={{ background: this.state.hexCode }}>
          <CopyText
            text={this.state.textToCopy}
            title="click to copy hex code">
          </CopyText>
        </div>
        />
        <p className="hex-code">{this.state.hexCode}</p>
        <p className="color-name">{this.state.colorName}</p>
      </li>
    )
  }
}

export default Swatch;