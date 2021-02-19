import React, { Component } from 'react';

class EditBookmarkForm extends Component {
  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId
    fetch(`https://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: 'GET'
    })
      .then(/*some data omitted*/)
      .then(responseData => {
        this.setState({
          // fields state updates here
        })
      })
      .catch(error => {/*some content omitted */ })
  }

  handleSubmit = e => {
    e.preventDefault()
    // validation not shown
    fetch(`https://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(this.state.inputValues)
    })
      .then(/*some content omitted */)
      .then(responseData => {
        this.context.updateBookmark(responseData)
      })
  }

  render() {
    const { title, url, rating, description } = this.state

    return (
      <section className='EditArticleForm'>
        <h2>Edit article</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              value={title}
              onChange={e => this.setState({ title: e.target.value })}
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
              value={url}
              onChange={e => this.setState({ url: e.target.value })}
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
              value={description}
              onChange={e => this.setState({ description: e.target.value })}
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
              value={rating}
              onChange={e => this.setState({ rating: e.target.value })}
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
    )
  }
}

module.export = EditBookmarkForm;

/*
unable to test b/c unable to access db
still need to fill in componentDidMount + handleSubmit methods
Steps needed for building the update form in a React application:
1. Add an update method to your context, and also add the method in the context provider component.
2. Add a route for editing the item, e.g. article.
3. Make a component containing a <form> for editing the item.
*4. Assuming the edit form uses controlled inputs: set initial values for the fields in state, based on the current values for the entity.
5. When the form is submitted, validate and perform the PATCH request.
6. If the PATCH is successful, call the update method on context.
7. Implement the update method to update the context's data in the provider component.

And that should be the full-stack implementation! We'd have built a new route for updating individual articles that renders a form. When the form is rendered, we'd fetch the current values for the article. When the form is submitted we'd send a PATCH request to update the article in the database, then if the PATCH request is successful we would update the context provider component so the new article's values are in shared state.
*/