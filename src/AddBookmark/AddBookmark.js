import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './AddBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class AddBookmark extends Component {

  static contextType = BookmarksContext

  state = {
    error: null,
  };

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { id, title, url, description, rating } = e.target
    const bookmark = {
      id: id.value,
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value,
    }
    console.log(bookmark)
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/bookmarks`, {
      method: 'POST',
      body: bookmark,
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        id.value = ''
        title.value = ''
        url.value = ''
        description.value = ''
        rating.value = ''
        this.props.history.push('/')
        this.context.onAddBookmark(data)
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Create a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue='1'
              min='1'
              max='5'
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default AddBookmark;
/*
history is now a prop for the AddBookmark component?
If you add a new bookmark, the page will redirect to the bookmark list!
help me enable the delete function?
*/