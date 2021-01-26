import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';
import BookmarksContext from './BookmarksContext';
import Rating from './rating/Rating';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
    console.log(bookmark)
  }

  
  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm => bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT + '/bookmarks', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': 'localhost:3001',
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      }).then(res => res)
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }
  
  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark
    }
    return (
      <main className='App'>
        {/* validation not working */}
        <Rating rating={'0,1,2,3,4,5'}/>
        {/* validation not working */}
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
          <Route 
            exact path='/'
            component={BookmarkList}
          />
          <Route 
            path='/add-bookmark'
            component={AddBookmark}
          />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;

/*

How to add a console.log using ||
 }).then(res => console.log(res) || res)
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
      
create context object with a default value (any type of data, does not have to be state) that any child component can access
wrap your highest level component with the context provider
provider will include a value for whatever data you are going to pass
ie: <Context.Provider value={contextValue}>
(look at the context that you've made to know what value you're going to give to your provider)
wrap any component JSX that needs to utilize context in a context consumer 
inside consumer you're going to create an arrow function with a parameter to expose the context object -->
swap props with context use that context inside your JSX (context doesn't replace ALL props all the time, only when needed)

dummy data:
const bookmarks = [
  {
    id: 0,
    title: 'Google',
    url: 'http://www.google.com',
    rating: '3',
    desc: 'Internet-related services and products.'
  },
  {
    id: 1,
    title: 'Thinkful',
    url: 'http://www.thinkful.com',
    rating: '5',
    desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  },
  {
    id: 2,
    title: 'Github',
    url: 'http://www.github.com',
    rating: '4',
    desc: 'brings together the world\'s largest community of developers.'
  }
];


Server for the bookmarks assignemnt has CORS disabled so it doesn't work

Refactor the bookmarks app to use context:
make context instance to store in bookmarkContext (as empty functions to 'shape' context)
wrap 'swap' bookmark for context.provider in App.js
*swap the render callback prop for the more simple component approach to routing
ex: component={component}
(App.js should now be using state to store the bookmarks and populating the context from the state)
use context in the BookmarksList Component
  add static contextType = ComponentName
  change this.props --> this.context
...AddBookmark component
  ""
  ""
  implement the cancel button directly inside this component instead of accepting an onClickCancel prop 
  handleClickCancel = () => {
    this.props.history.push('/')
  };

Implement the delete button:
implement request (CRUD) in desired component to enable use of function (ie: BookmarkList)
wrap Consumer context where function is to be used (ie: BookmarkItem)
remove the deleted bookmark from the bookmarks array in state using the context.deleteBookmark callback fx

Left off at "Assignment"
*/