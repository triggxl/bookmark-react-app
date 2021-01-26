import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './AddBookmark.css';
import { v4 as uuidv4 } from 'uuid';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class AddBookmark extends Component {

  static contextType = BookmarksContext

  state = {
    error: null,
    title : '',
    url: '',
    description: '',
    rating: ''
  };

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    //can make your own snippets
    console.log(e.target)
    const bookmark = {
      id: uuidv4(),
      title: this.state.title,
      url: this.state.url,
      description: this.state.description,
      rating: this.state.rating
    }
    console.log(bookmark)
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/bookmarks`, {
      method: 'POST',
      body: JSON.stringify(bookmark),
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
        this.context.addBookmark(data)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error } = this.state
    //define value using short-circuit evaluation?
    // const value = {this.state.bookmarks.value || ''}
    console.log(this.state.bookmark)
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
              value={this.state.title}
              onChange={e => this.setState({title : e.target.value})}
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
              value={this.state.url}
              onChange={e => this.setState({url : e.target.value})}
              name='url'
              id='url'
              placeholder='www.great-website.com/'
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
              value={this.state.description}
              onChange={e => this.setState({description : e.target.value})}
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
              value={this.state.rating}
              onChange={e => this.setState({rating: e.target.value})}
              name='rating'
              id='rating'
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