import React from 'react';
import Rating from '../Rating/Rating';
import config from '../config';
import './BookmarkItem.css';
import BookmarksContext from '../BookmarksContext';

const deleteBookmarkRequest = bookmarkId => {
  console.log('hello')
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`
    }
  })
  .then(res => {
    console.log('abc')
    if (!res.ok) {
      return res.json().then(error => {
        throw error;
      })
    }
    console.log(bookmarkId)
    this.deleteBookmark(bookmarkId)
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
}
