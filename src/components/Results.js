import React from "react";
import uuidv4 from "uuid";
import Input from "./Input";
import GeneratedSwatch from "./GeneratedSwatch";
import AddedSwatch from "./AddedSwatch";

const Results = ({
  resetSearch,
  enteredImageURL,
  generatedPalette,
  addColor,
  removeColor,
  customPalette,
  swatchError,
  savePalette,
  paletteName,
  handleChange,
  isTablet,
  isSmallTablet,
  isPhone,
  resetError
}) => {
  return (
    <section className="results animated fadeIn">
      <div className="results-panel results-left">
        <div className="image-container">
          <img src={enteredImageURL} alt="" />
        </div>
        <button className="reset-btn" onClick={resetSearch}>
          {isTablet || isSmallTablet || isPhone ? (
            <span>&#8592;</span>
          ) : (
            "reset image"
          )}
        </button>
      </div>
      <div className="results-panel results-right">
        <p className="results-heading">Add up to six colors to your palette</p>
        <ul className="current-palette-container">
          {generatedPalette.map(paletteColor => {
            return (
              <GeneratedSwatch
                key={uuidv4()}
                hexCode={paletteColor.color}
                colorName={paletteColor.label}
                addColor={addColor}
                removeColor={removeColor}
                customPalette={customPalette}
              />
            );
          })}
        </ul>
      </div>
      <div className="results-panel results-bottom">
        <p className="results-heading your-palette">Your palette</p>
        {swatchError && resetError()}
        <ul className="custom-palette">
          {customPalette.map(swatch => {
            return (
              <AddedSwatch
                key={uuidv4()}
                hexCode={swatch.hexCode}
                removeColor={removeColor}
              />
            );
          })}
        </ul>
        <form onSubmit={e => savePalette(e)}>
          <Input
            placeholder={
              isTablet || isPhone ? "palette name" : "name your palette"
            }
            name="paletteName"
            value={paletteName}
            handleChange={handleChange}
          />
          <button className="save-palette">
            {isTablet || isPhone ? "save palette!" : "save to Color Wall"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Results;
