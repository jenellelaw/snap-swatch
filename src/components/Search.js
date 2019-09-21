import React from "react";
import Input from "./Input";
import { Animated } from "react-animated-css";

const Search = ({ getRandoImage, getColors, value, handleChange }) => {
  return (
    <Animated
      className="animated-wrapper"
      animationIn="fadeInDown"
      animationInDuration="800"
    >
      <header className="search">
        <Animated
          animationIn="fadeInDown"
          animationInDelay="800"
          animationInDuration="400"
        >
          <h2>Create your photo-inspired color palette!</h2>
        </Animated>
        <form onSubmit={e => getColors(e)}>
          <Animated
            animationIn="fadeInUp"
            animationInDelay="1300"
            animationInDuration="800"
          >
            <Input
              placeholder="enter image url"
              name="enteredImageURL"
              value={value}
              handleChange={handleChange}
            />
          </Animated>

          <Animated
            className="btn-container"
            animationIn="fadeInUp"
            animationInDelay="1700"
            animationInDuration="800"
          >
            <button
              type="button"
              onClick={e => getRandoImage(e)}
              className="rando-image"
            >
              get rando image
            </button>
            <button type="submit" className="generate-palette">
              generate palette!
            </button>
          </Animated>
        </form>
      </header>
    </Animated>
  );
};

export default Search;
