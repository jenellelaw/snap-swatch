import React, { Component } from 'react';
import Qs from 'qs';
import axios from 'axios';
import Input from './components/Input';
import Swatch from './components/Swatch';
import './partials/App.scss';
import firebase from './firebase';

class App extends Component {
  constructor() {
    super();

    this.state = {
      apiDataLoading: false,
      currentImageURL: '',
      currentPalette: [],
      paletteName: '',
      submissions: [],
    }
  }

  componentDidMount() {
    //Storing Firebase data in our state object

    const dbRef = firebase.database().ref();

    dbRef.on('value', response => {
      const storedSubmissions = [];
      const data = response.val();

      for (let key in data) {
        storedSubmissions.push(data[key]);
      }

      this.setState({
        submissions: storedSubmissions
      })

    })
  }

  getColors = (e) => {
    e.preventDefault();

    if (document.querySelector('#currentImageURL').value === '') {
      alert('Please enter a URL');
    }

    this.setState({
      apiDataLoading: true
    })

    axios({
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://apicloud-colortag.p.rapidapi.com/tag-url.json',
        params: {
          palette: "simple",
          sort: "relevance",
          url: this.state.currentImageURL
        },
        proxyHeaders: {
          "x-rapidapi-host": "apicloud-colortag.p.rapidapi.com",
          "x-rapidapi-key": "a036396446msh88226c6849e787cp11ea84jsn3481ae1e567d"
        },
        xmlToJSON: false
      }
    }).then((res) => {
      console.log(res);
      document.querySelector('.search').classList.add('hide');
      document.querySelector('.results').classList.remove('hide');
      this.setState({
        currentPalette: res.data.tags,
      })
    }).catch((error) => {
      alert('No results found. Please try again.');
    }).finally(() => {
      this.setState({
        apiDataLoading: false
      })
    })
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  savePalette = (e) => {
    e.preventDefault();
    const dbRef = firebase.database().ref();
    const { currentImageURL, paletteName, currentPalette } = this.state;

    const newPalette = {
      image: currentImageURL,
      paletteName: paletteName,
      paletteColors: currentPalette
    }

    dbRef.push(newPalette);
  }

  // copyColor = (e) => {
  //   console.log(e.target);
  //   console.log(this.props.hexCode)
  // }

  render() {
    return (
      <div className="App">

        <div className="palette-generator">
          <div className="wrapper">

            <header className="search">
              <h1>SnapSwatch</h1>
              <h2>Create your photo-inspired color palette!</h2>
              <form onSubmit={(e) => this.getColors(e)}>
                <Input
                  placeholder="enter image url"
                  name="currentImageURL"
                  value={this.state.currentImageURL}
                  handleChange={this.handleChange}
                />
                <button className="generate-palette">generate palette!</button>
              </form>
            </header>

            <section className="results hide">
              <div className="results-panel results-left">
                <p className="results-heading">submitted image:</p>
                <div className="image-container">
                  {<img src={this.state.currentImageURL} alt="" />}
                </div>
                <form onSubmit={(e) => this.savePalette(e)}>
                  <Input
                    placeholder="name your color palette"
                    name="paletteName"
                    value={this.state.paletteName}
                    handleChange={this.handleChange}
                  />
                  <button className="save-palette">save to the color wall!</button>
                </form>
              </div>
              <div className="results-panel results-right">
                <p className="results-heading your-colors">your colors:</p>
                <ol className="current-palette-container">
                  {this.state.currentPalette.map((paletteColor, index) => {
                    return (
                      <Swatch
                        key={index}
                        hexCode={paletteColor.color}
                        colorName={paletteColor.label}
                        copyColor={this.copyColor}
                      />
                    )
                  })}
                </ol>
              </div>
            </section>
          </div>
        </div> {/* PALETTE GENERATOR ENDS */}

        <section className="color-wall">
          <div className="wrapper">
            <ul>
              {this.state.submissions.map((submission, index) => {
                return (
                  <li key={index} className="submission">
                    <p className="submission-image">{submission.image}</p>
                    <p className="submission-name">{submission.paletteName}</p>
                    {submission.paletteColors.map(swatch => {
                      return (
                        <div className="submission-swatch">
                          <p>{swatch.color}</p>
                          <p>{swatch.label}</p>
                        </div>
                      )
                    })}
                  </li>
                )
              })}
            </ul>

          </div>
        </section>
        {/* APP ENDS */} </div>
    )
  }
}

export default App;
