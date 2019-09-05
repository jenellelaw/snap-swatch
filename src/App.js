import React, { Component } from 'react';
import './App.scss';
import Form from './Components/Form/Form'
import Main from './Components/Main/Main'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Form />
        <Main />
      </div>
    )
  }
}

export default App;
