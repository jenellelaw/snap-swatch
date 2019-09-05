import React, { Component } from 'react';
// import Input from './Input';
import SubmitButton from './SubmitButton';
import Qs from 'qs';
import axios from 'axios';


class Form extends Component {
  constructor() {
    super();
    this.state = {
      imageURL: '',
      colorPalette: {}
    }
  }

  getColors = (event) => {
    event.preventDefault();
    const input = document.querySelector('#imageURLInput');

    console.log(input.value);
    // console.log('worked');

    //   axios({
    //     url: 'http://proxy.hackeryou.com',
    //     dataResponse: 'json',
    //     paramsSerializer: function (params) {
    //       return Qs.stringify(params, { arrayFormat: 'brackets' })
    //     },
    //     params: {
    //       reqUrl: 'https://apicloud-colortag.p.rapidapi.com/tag-url.json',
    //       params: {
    //         palette: "w3c",
    //         sort: "relevance",
    //         url: "https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"
    //       },
    //       proxyHeaders: {
    //         "x-rapidapi-host": "apicloud-colortag.p.rapidapi.com",
    //         "x-rapidapi-key": "a036396446msh88226c6849e787cp11ea84jsn3481ae1e567d"
    //       },
    //       xmlToJSON: false
    //     }
    //   }).then((res) => {
    //     console.log(res);
    //   });
  }

  render() {
    return (
      <form onSubmit={this.getColors}>
        <p>Create your image-inspired color palette!</p>
        <label
          htmlFor="imageURLInput"
          className="visuallyHidden">
        </label>
        <input
          type="text"
          id="imageURLInput"
          placeholder="enter image url"
        />
        <SubmitButton />
      </form>
    )
  }
}

export default Form;