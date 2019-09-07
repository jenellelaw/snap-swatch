import React from "react";

const Search = () => {
  return (
    <header className="search">
      <h2>Create your photo-inspired color palette!</h2>
      <form onSubmit={e => this.getColors(e)}>
        <Input
          placeholder="enter image url"
          name="enteredImageURL"
          value={this.state.enteredImageURL}
          handleChange={this.handleChange}
        />
        <button className="generate-palette">generate palette!</button>
      </form>
    </header>
  );
};

export default Search;

<Search
  getColors={this.getColors}
  value={this.state.enteredImageURL}
  handleChange={this.handleChange}
/>;
