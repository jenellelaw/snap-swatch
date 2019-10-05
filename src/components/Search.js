import React, { Component } from "react";
import Input from "./Input";
import uuidv4 from "uuid";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineImage: true,
      uploadImage: false
    };
  }

  selectOnlineTab = () => {
    this.setState({
      onlineImage: true,
      uploadImage: false
    });
  };

  selectUploadTab = () => {
    this.setState({
      onlineImage: false,
      uploadImage: true
    });
  };

  onChange = e => {};

  render() {
    const {
      getRandoImage,
      getColors,
      value,
      handleChange,
      handleFileChange,
      getColorsFromUpload,
      files
    } = this.props;
    const { onlineImage, uploadImage } = this.state;

    return (
      <header className="search">
        <h2>create your photo-inspired color palette!</h2>

        <div className="form-container">
          <button
            className={onlineImage ? "form-tab selected" : "form-tab"}
            onClick={this.selectOnlineTab}
          >
            <p>online image</p>
          </button>

          <button
            className={uploadImage ? "form-tab selected" : "form-tab"}
            onClick={this.selectUploadTab}
          >
            <p>upload image</p>
          </button>

          {onlineImage && (
            <form className="onlineImageForm" onSubmit={e => getColors(e)}>
              <div className="animated fadeIn">
                <Input
                  placeholder="enter image url"
                  name="enteredImageURL"
                  value={value}
                  handleChange={handleChange}
                />
                <div className="btn-container">
                  <button
                    type="button"
                    onClick={e => getRandoImage(e)}
                    className="submit-btn rando-image"
                  >
                    get rando image
                  </button>
                  <button type="submit" className="submit-btn generate-palette">
                    generate palette!
                  </button>
                </div>
              </div>
            </form>
          )}

          {uploadImage && (
            <form
              className="uploadImageForm"
              onSubmit={e => getColorsFromUpload(e)}
            >
              <div className="animated fadeIn">
                <div
                  className={
                    files.length === 0
                      ? "file-upload-container min"
                      : "file-upload-container"
                  }
                >
                  <button
                    className={
                      files.length === 0 ? "upload-btn" : "upload-btn min"
                    }
                    type="button"
                  >
                    <label>
                      <input
                        type="file"
                        name="files"
                        onChange={handleFileChange}
                      />
                      Upload image
                    </label>
                  </button>

                  <div className="file-preview">
                    {files.map(file => (
                      <p key={uuidv4()}>{file.name}</p>
                    ))}
                  </div>
                </div>
                <div className="btn-container">
                  <button type="submit" className="submit-btn generate-palette">
                    generate palette!
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </header>
    );
  }
}

export default Search;
