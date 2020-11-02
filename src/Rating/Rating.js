import React from 'react';
import Proptypes from 'prop-types';
import './Rating.css';

export default function Rating(props) {
  const stars = [0, 0, 0, 0, 0].map((_, i) =>
    (i < props.value)
      ? <span key={i}>&#9733; </span>
      : <span key={i}>&#9734; </span>
  );
  return (
    <div className="rating">
      {stars}
    </div>
  );
}

Rating.propTypes = {
  // value : PropTypes.oneOf([1,2,3,4,5]).isRequired
  //instuctions: Let us do a simple validator to check that the value prop is in the range 1 - 5.
  value : (props, propName, componentName) => {
    //first get the value of the prop
    const prop = props[propName];
    //check to make sure isRequired
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation failed`);
    }
    //check value type
    if(typeof prop != 'number') {
      return new Error(`Invalid prop, ${propName} is expected to be a number in ${componentName}`);
    }
    //checking range
    if(prop < 1 || prop > 5) {
      return new Error(`Invalid prop, ${propName} should be a range between 1 and 5 in ${componentName}. ${prop} found.`);
    }

  }
};

Rating.defaultProps = {
  value : 1
}
