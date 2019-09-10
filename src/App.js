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
// import { Animated } from "react-animated-css";

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
      isPhone: false
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
      return Swal.fire({
        title: "Please enter a image URL",
        animation: false,
        customClass: {
          popup: "animated bounceIn empty-input enter-image-url"
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
        alert("No results found. Please try again.");
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
    alert("no more!");
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

    const { enteredImageURL, paletteName, customPalette } = this.state;

    if (paletteName) {
      return alert("please type in a name");
    }

    if (customPalette.length < 3) {
      return alert("please choose at least 3 colors ");
    }

    const dbRef = firebase.database().ref();

    const newPalette = {
      image: enteredImageURL,
      paletteName: paletteName,
      paletteColors: customPalette
    };

    dbRef.push(newPalette);
    alert("palette has been saved");
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
      isPhone
    } = this.state;

    const {
      getColors,
      handleChange,
      resetSearch,
      addColor,
      removeColor,
      savePalette,
      resetError
    } = this;

    return (
      <div className={apiDataLoading ? "App loading" : "App"}>
        <div className="palette-generator">
          <div className={showSearch ? "wrapper" : "wrapper white-bg"}>
            <h1>
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

            <p className="side-text credits">
              designed and coded by jenelle law
            </p>
          </div>

          {(showSearch || !isPhone) && (
            <p className="side-text colorwall-directions">
              {isSmallTablet ? (
                <span className="down-arrow">&#8595;</span>
              ) : (
                <span>&#8592;</span>
              )}
              The Color Wall
            </p>
          )}
        </div>
        <ColorWall submissions={submissions} />;
      </div>
    );
  }
}

export default App;
