import React, { Component } from 'react';
import './partials/App.scss';
import Form from './components/form/Form'
import Main from './components/main/Main'

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
