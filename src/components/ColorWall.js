import React from "react";
import uuidv4 from "uuid";
import SubmittedSwatch from "./SubmittedSwatch";

const ColorWall = ({ submissions }) => {
  return (
    <section className="color-wall" id="colorWall">
      <div className="wrapper">
        <h2>The ColorWall</h2>
        <h3>click on the swatches to copy their hexcodes!</h3>
        <ul className="submissions">
          {submissions.map(submission => {
            return (
              <li key={uuidv4()} className="submission">
                <ul className="submitted-swatches">
                  {submission.paletteColors.map(obj => {
                    return (
                      <SubmittedSwatch
                        key={uuidv4()}
                        hexCode={obj.hexCode}
                        colorName={obj.colorName}
                      />
                    );
                  })}
                </ul>
                <p className="submission-name">{submission.paletteName}</p>
                <div className="image-container">
                  <img
                    className="submission-image"
                    src={submission.image}
                    alt=""
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ColorWall;
