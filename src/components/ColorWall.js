import React from "react";
import Masonry from "react-masonry-css";
import uuidv4 from "uuid";
import SubmittedSwatch from "./SubmittedSwatch";

const ColorWall = ({ submissions }) => {
  const breakpointColumnsObj = {
    default: 3,
    1500: 3,
    1200: 2,
    650: 1
  };

  const submissionsList = submissions.map(submission => {
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

        <div className="submission-name">
          <p>{submission.paletteName}</p>
        </div>
        <div className="image-container">
          <img className="submission-image" src={submission.image} alt="" />
        </div>
      </li>
    );
  });

  return (
    <section className="color-wall" id="colorWall">
      <div className="wrapper">
        <h2 className="animated pulse infinite">The Color Wall</h2>
        <h3>click on the swatches to copy their hexcodes!</h3>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {submissionsList}
        </Masonry>
      </div>
    </section>
  );
};

export default ColorWall;
