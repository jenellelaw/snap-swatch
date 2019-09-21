import React, { Component } from "react";
import Qs from "qs";
import axios from "axios";
import firebase from "./firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CopyText from "react-copy-text";
import Background from "./components/Background";
import Search from "./components/Search";
import Loader from "./components/Loader";
import Results from "./components/Results";
import ColorWall from "./components/ColorWall";
import "./partials/App.scss";

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

    // Get Color Wall data from Firebase
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

    window.scrollTo(0, 0);

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

  addColor = (hexCode, colorName) => {
    const colorAlreadyExists = this.state.customPalette.some(obj => {
      return obj.hexCode === hexCode;
    });

    if (colorAlreadyExists) {
      return;
    }

    if (this.state.customPalette.length === 6) {
      this.setState({
        swatchError: true
      });
    } else {
      this.setState(prevState => ({
        customPalette: [...prevState.customPalette, { hexCode, colorName }],
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
        return item.hexCode !== hexCode;
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

    const formattedPaletteName = paletteName
      .toLowerCase()
      .split(" ")
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");

    const newPalette = {
      image: enteredImageURL,
      paletteName: formattedPaletteName,
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
      <div className="App">
        <Background />
        <div className="palette-generator">
          <div className={showSearch ? "wrapper" : "wrapper white-bg"}>
            <h1 className="animated bounceIn">
              <a href="App.js">SnapSwatch</a>
            </h1>

            {apiDataLoading && <Loader />}

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
