import React, { Component } from 'react';
import Qs from 'qs';
import axios from 'axios';
import Input from './components/Input';
import Swatch from './components/Swatch';
import './partials/App.scss';

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentImageURL: '',
      currentPalette: [],
      colorPaletteName: '',
      apiDataLoading: false,
      submissions: [],
      submissionNum: 0
    }
  }

  getColors = (e) => {
    e.preventDefault();

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
      document.querySelector('#currentImageURL').value === '' ? alert('Please enter a URL') : alert('No results found. Please try again.');
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
                <form action="">
                  <Input
                    placeholder="name your color palette"
                    name="colorPaletteName"
                    value={this.state.colorPaletteName}
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
          </div>
        </section>
        {/* APP ENDS */} </div>
    )
  }
}

export default App;
