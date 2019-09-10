import React from "react";
import uuidv4 from "uuid";
import SubmittedSwatch from "./SubmittedSwatch";

const ColorWall = ({ submissions }) => {
  return (
    <section className="color-wall" id="colorWall">
      <div className="wrapper">
        <h2>The ColorWall</h2>
        <h3>our palette treasure trove</h3>
        <ul className="submissions">
          {submissions.map(submission => {
            return (
              <li key={uuidv4()} className="submission">
                <ul className="submitted-swatches">
                  {submission.paletteColors.map(color => {
                    return <SubmittedSwatch key={uuidv4()} hexCode={color} />;
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
