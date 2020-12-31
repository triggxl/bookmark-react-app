import React from 'react';
import PropTypes from 'prop-types';
import './Rating.css';

export default function Bookmark(props) {
  const stars = [0,0,0,0,0]
    .map((_, i) => i < props.value
      ? <span key={i}>&#9733;</span>
      : <span key={i}>&#9734;</span>
    );
  return (
    <div className="rating">
      {stars}
    </div>
  );
}

Bookmark.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  rating: PropTypes.number,
  description: PropTypes.string
};

Bookmark.default = {
  rating: 1,
  description: ""
}
