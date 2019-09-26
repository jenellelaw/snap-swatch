import React from "react";
import Input from "./Input";

const Search = ({ getRandoImage, getColors, value, handleChange }) => {
  return (
    <header className="search animated fadeInDown">
      <h2 className="animated fadeInDown">
        Create your photo-inspired color palette!
      </h2>
      <form onSubmit={e => getColors(e)} className="animated fadeInUp ">
        <Input
          className="animated fadeInUp"
          placeholder="enter image url"
          name="enteredImageURL"
          value={value}
          handleChange={handleChange}
        />
        <div className="btn-container animated fadeInUp">
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
        </div>
      </form>
    </header>
  );
};

export default Search;
