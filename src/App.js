import React, { Component } from "react";
import Qs from "qs";
import axios from "axios";
import uuidv4 from "uuid";
import Input from "./components/Input";
import Swatch from "./components/Swatch";
import GeneratedSwatch from "./components/GeneratedSwatch";
// import Search from "./components/Search";
import Results from "./components/Results";
import ColorWall from "./components/ColorWall";
import "./partials/App.scss";
import firebase from "./firebase";

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
      submissions: []
    };
  }

  componentDidMount() {
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

  getColors = e => {
    e.preventDefault();

    if (!this.state.enteredImageURL) {
      return alert("Please enter a URL");
    }

    this.setState({
      apiDataLoading: true
    });

    axios({
      url: "http://proxy.hackeryou.com",
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
      return this.setState({
        swatchError: true
      });
    }

    this.setState(prevState => ({
      customPalette: [...prevState.customPalette, hexCode],
      swatchError: false
    }));
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
    const dbRef = firebase.database().ref();
    const { enteredImageURL, paletteName, customPalette } = this.state;

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
    return (
      <div className="App">
        <div className="palette-generator">
          <div className="wrapper">
            <h1>
              <span>SnapSwatch</span>
            </h1>

            {this.state.showSearch ? (
              <header className="search">
                <h2>Create your photo-inspired color palette!</h2>
                <form onSubmit={e => this.getColors(e)}>
                  <Input
                    placeholder="enter image url"
                    name="enteredImageURL"
                    value={this.state.enteredImageURL}
                    handleChange={this.handleChange}
                  />
                  <button className="generate-palette">
                    generate palette!
                  </button>
                </form>
              </header>
            ) : (
              <section className="results">
                <button className="reset" onClick={this.resetSearch}>
                  reset
                </button>
                <div className="results-panel results-left">
                  <p className="results-heading">submitted image:</p>
                  <div className="image-container">
                    {<img src={this.state.enteredImageURL} alt="" />}
                  </div>
                </div>

                <div className="results-panel results-right">
                  <p className="results-heading">generated colors:</p>
                  <ul className="current-palette-container">
                    {this.state.generatedPalette.map((paletteColor, index) => {
                      return (
                        <Swatch
                          swatchType="generated-swatch"
                          key={`${uuidv4()}-${index}`}
                          hexCode={paletteColor.color}
                          colorName={paletteColor.label}
                          addColor={this.addColor}
                          removeColor={this.removeColor}
                          customPalette={this.state.customPalette}
                        />
                      );
                    })}
                  </ul>
                </div>

                <div className="results-panel results-bottom">
                  <p className="results-heading your-palette">Your palette</p>
                  {this.state.swatchError && alert("NO MORE")}
                  <ul className="selected-palette">
                    {this.state.customPalette.map(swatch => {
                      return (
                        <GeneratedSwatch
                          key={uuidv4()}
                          hexCode={swatch}
                          removeColor={this.removeColor}
                        />
                      );
                    })}
                  </ul>
                  <form onSubmit={e => this.savePalette(e)}>
                    <Input
                      placeholder="name your color palette"
                      name="paletteName"
                      value={this.state.paletteName}
                      handleChange={this.handleChange}
                    />
                    <button className="save-palette">
                      save to the color wall!
                    </button>
                  </form>
                </div>
              </section>
            )}
          </div>
        </div>
        {/* PALETTE GENERATOR ENDS */}
        <section className="color-wall">
          <div className="wrapper">
            <ul>
              {this.state.submissions.map((submission, index) => {
                return (
                  <li key={uuidv4()} className="submission">
                    <p className="submission-image">{submission.image}</p>
                    <p className="submission-name">{submission.paletteName}</p>
                    <ul></ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        {/* APP ENDS */}{" "}
      </div>
    );
  }
}

export default App;
