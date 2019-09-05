import React, { Component } from 'react';
import Results from './Results'

class Main extends Component {
  constructor() {
    super();
    this.state = {
      imageURL: '',
      colorPalette: {}
    }
  }
  render() {
    return (
      <main>
        <Results />
      </main>
    )
  }
}

export default Main;