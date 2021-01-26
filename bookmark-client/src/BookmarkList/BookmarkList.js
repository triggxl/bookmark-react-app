import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import BookmarkItem from '../BookmarkItem/BookmarkItem';
import './BookmarkList.css';
import Proptypes from 'prop-types';

class BookmarkList extends Component {

  static contextType = BookmarksContext

  render() {
    const { bookmarks } = this.context
    return (
      <section className='BookmarkList'>
        <h2>Your bookmarks</h2>
        <ul className='BookmarkList__list' aria-live='polite'>
          {bookmarks.map(bookmark =>
          console.log(bookmark.url, bookmark.rating)||
            <BookmarkItem
              key={bookmark.id}
              {...bookmark}
            />
          )}
        </ul>
      </section>
    );
  }
}

export default BookmarkList;

//add PropTypes to the BookmarkList component to check that the prop is an array and shape gives us the means to specify precisely what we want our object to look like
BookmarkList.propTypes = {
  bookmarks : Proptypes.arrayOf(Proptypes.shape({
    title : Proptypes.string.isRequired,
    url : Proptypes.string.isRequired,
    rating : Proptypes.number,
    description : Proptypes.string
  }))
}