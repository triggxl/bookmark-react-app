//client
import React from 'react';
import Rating from '../rating/Rating';
import config from '../config';
import './BookmarkItem.css';
import BookmarksContext from '../BookmarksContext';
import Proptypes from 'prop-types';

const deleteBookmarkRequest = (bookmarkId, cb) => {
  console.log('bi1')
  //DELETE http://localhost:8001/bookmarks/2 400 (Bad Request)
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`
    }
  })
  .then(res => {
    console.log('bi2')
    if (!res.ok) {
      return res.json().then(error => {
        throw error;
      })
    }
    cb(bookmarkId)
  })
  .catch(error => {
    console.error(error);
  })
}
export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context)=> (
         <li className='BookmarkItem'>
          <div className='BookmarkItem__row'>
            <h3 className='BookmarkItem__title'>
              <a
                href={props.url}
                target='_blank'
                rel='noopener noreferrer'>
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className='BookmarkItem__description'>
            {props.description}
          </p>
          <div className='BookmarkItem__buttons'>
            <button
              className='BookmarkItem__description'
              onClick={()=> {
                deleteBookmarkRequest(
                  props.id,
                  context.deleteBookmark
                )
              }}
            >
              Delete
            </button>
          </div>
         </li>
      )}
    </BookmarksContext.Consumer>
   
  )
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
  rating : 1,
  description : ''
}

//add propTypes for required values and expected data types
BookmarkItem.propTypes = {
  title: Proptypes.string.isRequired,
  // url : Proptypes.string.isRequired,
  // rating : Proptypes.number,
  // description : Proptypes.string,

  url: (props, propName, componentName) => {
    const prop = props[propName];

    if(!prop) {
      return new Error(`Invalid prop, ${propName} is required in ${componentName}. Validation failed.`);
    }
    if(typeof prop != 'string') {
      return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
    }
    if(prop.length < 5 || prop.match(new RegExp(/^https?:\/\//))) {
      return new Error(`Invalid prop, ${propName} must be a minimum length of 5 and begin with http(s)://. Validation failed.`);
    }
  },
  rating: Proptypes.number,
  description: Proptypes.string
}

/*
Why is 97 true?
log console.log(prop) < than 5, matching regex
*/
