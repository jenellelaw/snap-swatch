import React, { Component } from 'react';
import Input from './Input';
import SubmitButton from './SubmitButton';
import Qs from '../../../node_modules/qs';
import axios from '../../../node_modules/axios';


class Form extends Component {
  constructor() {
    super();
    this.state = {
      imageURL: '',
      colorPalette: {}
    }
  }

  getColors = () => {
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
          url: "https://cdn.pixabay.com/photo/2019/09/03/13/13/landscape-4449408_1280.jpg"
        },
        proxyHeaders: {
          "x-rapidapi-host": "apicloud-colortag.p.rapidapi.com",
          "x-rapidapi-key": "a036396446msh88226c6849e787cp11ea84jsn3481ae1e567d"
        },
        xmlToJSON: false
      }
    }).then((res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <form action="">
        <Input />
        <SubmitButton onClick={this.getColors} />
      </form>
    )
  }
}

export default Form;