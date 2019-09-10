import React, { Component } from "react";
import Search from "./components/Search";
import Results from "./components/Results";
import ColorWall from "./components/ColorWall";
import "./partials/App.scss";
import Qs from "qs";
import axios from "axios";
import firebase from "./firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CopyText from "react-copy-text";

class App extends Component {
  constructor() {
    super();

    this.state = {
      showSearch: true,
      apiDataLoading: false,
      enteredImageURL: "",
      generatedPalette: [],
      customPalette: [],
      swatchError: false,
      paletteName: "",
      submissions: [],
      isTablet: false,
      isSmallTablet: false,
      isPhone: false,
      textToCopy: ""
    };
  }

  componentDidMount() {
    this.calculateScreenIfTablet();
    this.calculateScreenIfSmallTablet();
    this.calculateScreenIfPhone();
    window.addEventListener("resize", this.calculateScreenIfTablet);
    window.addEventListener("resize", this.calculateScreenIfSmallTablet);
    window.addEventListener("resize", this.calculateScreenIfPhone);

    //Storing Firebase data in our state object

    const dbRef = firebase.database().ref();

    dbRef.on("value", response => {
      const storedSubmissions = [];
      const data = response.val();

      for (let key in data) {
        storedSubmissions.push(data[key]);
      }

      this.setState({
        submissions: storedSubmissions
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateScreenIfTablet);
    window.removeEventListener("resize", this.calculateScreenIfSmallTablet);
  }

  clickToCopy = () =>
    this.setState({
      textToCopy:
        "https://cdn.pixabay.com/photo/2019/09/06/20/25/refuge-4457275_1280.jpg"
    });

  calculateScreenIfTablet = () => {
    this.setState({
      isTablet: window.innerWidth < 780 && window.innerWidth >= 600
    });
  };

  calculateScreenIfSmallTablet = () => {
    this.setState({
      isSmallTablet: window.innerWidth < 600
    });
  };

  calculateScreenIfPhone = () => {
    this.setState({
      isPhone: window.innerWidth < 480
    });
  };

  getColors = e => {
    e.preventDefault();
    const MySwal = withReactContent(Swal);

    if (!this.state.enteredImageURL) {
      return MySwal.fire({
        title: "Please enter an image URL",
        confirmButtonText: "Got it!",
        animation: false,
        customClass: {
          popup: "animated bounceIn custom-alert-style empty-field container",
          title: "custom-alert-style empty-field title-class",
          confirmButton: "custom-alert-style empty-field confirm-button-class"
        }
      });
    }

    this.setState({
      apiDataLoading: true
    });

    axios({
      url: "https://proxy.hackeryou.com",
      dataResponse: "json",
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: "https://apicloud-colortag.p.rapidapi.com/tag-url.json",
        params: {
          palette: "w3c",
          sort: "relevance",
          url: this.state.enteredImageURL
        },
        proxyHeaders: {
          "x-rapidapi-host": "apicloud-colortag.p.rapidapi.com",
          "x-rapidapi-key": "a036396446msh88226c6849e787cp11ea84jsn3481ae1e567d"
        },
        xmlToJSON: false
      }
    })
      .then(res => {
        console.log(res);

        this.setState({
          showSearch: false,
          generatedPalette: res.data.tags
        });
      })
      .catch(error => {
        MySwal.fire({
          title: "No results found. Please try another URL.",
          confirmButtonText: "Got it!",
          animation: false,
          customClass: {
            popup: "animated bounceIn custom-alert-style no-results container",
            title: "custom-alert-style no-results title-class",
            confirmButton: "custom-alert-style no-results confirm-button-class"
          }
        });
      })
      .finally(() => {
        this.setState({
          apiDataLoading: false
        });
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addColor = hexCode => {
    if (this.state.customPalette.length === 6) {
      this.setState({
        swatchError: true
      });
    } else {
      this.setState(prevState => ({
        customPalette: [...prevState.customPalette, hexCode],
        swatchError: false
      }));
    }
  };

  resetError = () => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "No more than 6 swatches!",
      confirmButtonText: "Awww ok.",
      animation: false,
      customClass: {
        popup: "animated bounceIn custom-alert-style over-limit container",
        title: "custom-alert-style over-limit title-class",
        confirmButton: "custom-alert-style over-limit confirm-button-class"
      }
    });

    this.setState({
      swatchError: false
    });
  };

  removeColor = hexCode => {
    this.setState(prevState => ({
      swatchError: false,
      customPalette: prevState.customPalette.filter(item => {
        return item !== hexCode;
      })
    }));
  };

  savePalette = e => {
    e.preventDefault();
    const MySwal = withReactContent(Swal);
    const { enteredImageURL, paletteName, customPalette } = this.state;

    if (!paletteName && customPalette.length < 3) {
      return MySwal.fire({
        title: "Give your palette a name and choose at least 3 colors!",
        confirmButtonText: "Got it!",
        animation: false,
        customClass: {
          popup: "animated bounceIn custom-alert-style empty-field container",
          title: "custom-alert-style empty-field title-class",
          confirmButton: "custom-alert-style empty-field confirm-button-class"
        }
      });
    }

    if (!paletteName) {
      return MySwal.fire({
        title: "Give your palette a name!",
        confirmButtonText: "Got it!",
        animation: false,
        customClass: {
          popup: "animated bounceIn custom-alert-style empty-field container",
          title: "custom-alert-style empty-field title-class",
          confirmButton: "custom-alert-style empty-field confirm-button-class"
        }
      });
    }

    if (customPalette.length < 3) {
      return MySwal.fire({
        title: "Please choose at least 3 colors!",
        confirmButtonText: "Got it!",
        animation: false,
        customClass: {
          popup: "animated bounceIn custom-alert-style empty-field container",
          title: "custom-alert-style empty-field title-class",
          confirmButton: "custom-alert-style empty-field confirm-button-class"
        }
      });
    }

    const dbRef = firebase.database().ref();

    const newPalette = {
      image: enteredImageURL,
      paletteName: paletteName,
      paletteColors: customPalette
    };

    dbRef.push(newPalette);

    MySwal.fire({
      title: "Yay! Your palette has been saved.",
      confirmButtonText: "Cool, imma see it on the Color Wall now!",
      animation: false,
      customClass: {
        popup: "animated bounceIn custom-alert-style saved-palette container",
        title: "custom-alert-style saved-palette title-class",
        confirmButton: "custom-alert-style saved-palette confirm-button-class"
      }
    });
  };

  resetSearch = () => {
    this.setState({
      showSearch: true,
      enteredImageURL: "",
      generatedPalette: [],
      customPalette: [],
      paletteName: ""
    });
  };

  render() {
    const {
      apiDataLoading,
      showSearch,
      enteredImageURL,
      generatedPalette,
      customPalette,
      swatchError,
      paletteName,
      submissions,
      isTablet,
      isSmallTablet,
      isPhone,
      textToCopy
    } = this.state;

    const {
      getColors,
      handleChange,
      resetSearch,
      addColor,
      removeColor,
      savePalette,
      resetError,
      clickToCopy
    } = this;

    return (
      <div className={apiDataLoading ? "App loading" : "App"}>
        <svg
          className="background-blob blob-1"
          xmlns="http://www.w3.org/2000/svg"
          width="600"
          height="600"
          viewBox="0 0 600 600"
        >
          <path d="M477.2 201.2C504.4 244.7 483.6 319.3 446.1 379 408.5 438.7 354.3 483.3 293.8 486.9 233.3 490.5 166.6 453 139.9 399.6 113.2 346.2 126.5 276.8 159.8 229.8 193.2 182.7 246.6 157.8 310.8 151.6 375.1 145.3 450.1 157.7 477.2 201.2Z" />
        </svg>
        <svg
          className="background-blob blob-2"
          xmlns="http://www.w3.org/2000/svg"
          width="600"
          height="600"
          viewBox="0 0 600 600"
        >
          <path d="M480.8 168.7C524.5 210.6 543.4 285.2 528.9 353.7 514.5 422.2 466.7 484.5 409.7 502.2 352.6 519.8 286.4 492.8 237.5 458.3 188.6 423.8 157 381.8 142.2 331.7 127.4 281.7 129.2 223.5 158.3 184.9 187.4 146.2 243.7 127.1 306.1 122.2 368.5 117.3 437.1 126.7 480.8 168.7Z" />
        </svg>
        <svg
          className="background-blob blob-3"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 310 350"
        >
          <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z" />
        </svg>
        <svg
          className="background-blob blob-4"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 310 350"
        >
          <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z" />
        </svg>
        <div className="palette-generator">
          <div className={showSearch ? "wrapper" : "wrapper white-bg"}>
            <h1 className="animated bounceIn">
              <a href="App.js">SnapSwatch</a>
            </h1>

            {apiDataLoading && (
              <div className="loader">
                <div className="load">
                  <hr />
                  <hr />
                  <hr />
                  <hr />
                </div>
              </div>
            )}

            {this.state.showSearch ? (
              <Search
                appear="fadeInRight"
                getColors={getColors}
                value={enteredImageURL}
                handleChange={handleChange}
              />
            ) : (
              <Results
                resetSearch={resetSearch}
                enteredImageURL={enteredImageURL}
                generatedPalette={generatedPalette}
                addColor={addColor}
                removeColor={removeColor}
                customPalette={customPalette}
                swatchError={swatchError}
                savePalette={savePalette}
                paletteName={paletteName}
                handleChange={handleChange}
                isTablet={isTablet}
                isSmallTablet={isSmallTablet}
                isPhone={isPhone}
                resetError={resetError}
              />
            )}

            <p className="outside-text credits">
              <a onClick={clickToCopy} title="click for a image URL">
                designed and coded by jenelle law
              </a>
              <CopyText text={textToCopy}></CopyText>
            </p>
          </div>

          {(showSearch || !isPhone) && (
            <a className="outside-text colorwall-link" href="#colorWall">
              {isSmallTablet ? (
                <span className="down-arrow">&#8595;</span>
              ) : (
                <span>&#8592;</span>
              )}
              The Color Wall
            </a>
          )}
        </div>
        <ColorWall submissions={submissions} />;
      </div>
    );
  }
}

export default App;
