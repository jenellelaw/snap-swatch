import React, { Component } from "react";
import Background from "./components/Background";
import Search from "./components/Search";
import Loader from "./components/Loader";
import Results from "./components/Results";
import ColorWall from "./components/ColorWall";
import ColorWallLink from "./components/ColorWallLink";
import CreditText from "./components/CreditText";
import "./partials/App.scss";

import Qs from "qs";
import axios from "axios";
import firebase from "./firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
      files: []
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
        submissions: storedSubmissions.reverse()
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateScreenIfTablet);
    window.removeEventListener("resize", this.calculateScreenIfSmallTablet);
  }

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

  getRandoImage = e => {
    const API_KEY = process.env.REACT_APP_UNSPLASH_API_KEY;

    axios
      .get(`https://api.unsplash.com/photos/random/?client_id=${API_KEY}`)
      .then(res => {
        const enteredImageURL = res.data.urls.regular;

        this.setState(
          {
            enteredImageURL
          },
          () => {
            this.getColors(e);
          }
        );
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

    const API_KEY = process.env.REACT_APP_COLORTAG_API_KEY;

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
          "x-rapidapi-key": API_KEY
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
            confirmButton:
              "custom-alert-style no-results confirm-button-class got-it"
          }
        });
      })
      .finally(() => {
        this.setState({
          apiDataLoading: false
        });
      });
  };

  getColorsFromUpload = e => {
    e.preventDefault();
    const form = new FormData();
    form.append("palette", "w3c");
    form.append("sort", "relevance");
    form.append("image", this.state.files[0]);

    console.log(this.state.files[0]);

    const MySwal = withReactContent(Swal);

    window.scrollTo(0, 0);

    if (this.state.file === []) {
      return MySwal.fire({
        title: "Please upload an image",
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

    const API_KEY = process.env.REACT_APP_COLORTAG_API_KEY;

    axios({
      url: "https://proxy.hackeryou.com",
      method: "POST",
      dataResponse: "json",
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: "https://apicloud-colortag.p.rapidapi.com/tag-file.json",
        params: {
          data: form
        },
        proxyHeaders: {
          "x-rapidapi-host": "apicloud-colortag.p.rapidapi.com",
          "x-rapidapi-key": API_KEY,
          "content-type": "multipart/form-data"
        },
        xmlToJSON: false
      }
    })
      .then(res => {
        console.log(res);
        // this.setState({
        //   showSearch: false,
        //   generatedPalette: res.data.tags
        // });
      })
      .catch(error => {
        MySwal.fire({
          title: "Unable to processs image...",
          confirmButtonText: "Try again",
          animation: false,
          customClass: {
            popup: "animated bounceIn custom-alert-style no-results container",
            title: "custom-alert-style no-results title-class",
            confirmButton:
              "custom-alert-style no-results confirm-button-class got-it"
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

  handleFileChange = e => {
    console.log("run function");
    const files = e.target.files;
    const filesArr = Array.prototype.slice.call(files);
    this.setState({ files: filesArr });
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
      confirmButtonText: "See it on the Color Wall!",
      animation: false,
      customClass: {
        popup: "animated bounceIn custom-alert-style saved-palette container",
        title: "custom-alert-style saved-palette title-class",
        confirmButton: "custom-alert-style saved-palette confirm-button-class"
      }
    }).then(() => {
      window.location.href = "/#colorWall";

      this.resetSearch();
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
      files,
      generatedPalette,
      customPalette,
      swatchError,
      paletteName,
      submissions,
      isTablet,
      isSmallTablet,
      isPhone
    } = this.state;

    const {
      getColors,
      getColorsFromUpload,
      handleChange,
      handleFileChange,
      resetSearch,
      addColor,
      removeColor,
      savePalette,
      resetError,
      getRandoImage
    } = this;

    return (
      <div className="App">
        <Background />
        <div className="palette-generator">
          <div className={showSearch ? "wrapper" : "wrapper white-bg"}>
            <h1 className="animated bounceIn">
              <a href="App.js">snap-swatch</a>
            </h1>

            {apiDataLoading && <Loader />}

            {this.state.showSearch ? (
              <Search
                appear="fadeInRight"
                getColors={getColors}
                getColorsFromUpload={getColorsFromUpload}
                getRandoImage={getRandoImage}
                value={enteredImageURL}
                files={files}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
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
            <CreditText />
          </div>

          <ColorWallLink
            showSearch={showSearch}
            isPhone={isPhone}
            isSmallTablet={isSmallTablet}
          />
        </div>
        <ColorWall submissions={submissions} />;
      </div>
    );
  }
}

export default App;
