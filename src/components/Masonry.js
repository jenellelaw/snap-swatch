import * as React from "react";
import Masonry from "react-masonry-component";
import uuidv4 from "uuid";
import SubmittedSwatch from "./SubmittedSwatch";

const masonryOptions = {
  transitionDuration: 0
};

class Gallery extends React.Component {
  render() {
    const { submissions } = this.props;

    const childElements = this.props.elements.map(() => {
      return (
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

                <div className="submission-name">
                  <p>{submission.paletteName}</p>
                </div>
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
      );
    });

    return (
      <Masonry
        className={"my-gallery-class"} // default ''
        elementType={"div"} // default 'div'
        options={masonryOptions} // default {}
      >
        {childElements}
      </Masonry>
    );
  }
}

export default Gallery;
