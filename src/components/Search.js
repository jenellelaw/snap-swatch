import React from "react";
import Input from "./Input";

const Search = ({ getColors, value, handleChange }) => {
  return (
    <header className="search">
      <h2>Create your photo-inspired color palette!</h2>
      <form onSubmit={e => getColors(e)}>
        <Input
          placeholder="enter image url"
          name="enteredImageURL"
          value={value}
          handleChange={handleChange}
        />
        <button className="generate-palette">generate palette!</button>
      </form>
    </header>
  );
};

export default Search;
