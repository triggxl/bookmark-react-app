import React, { Component } from 'react';
import './fab.css';
import BookmarkApp from '../bookmarkApp/bookmarkApp';

class Fab extends Component {
  render() {
    return (
    <>
      <BookmarkApp showForm={show => this.setShowAddForm(show)}/>
      <div className="fab" onClick={e => this.props.showForm(true)}>
        &#43;
      </div>
    </>
    );
  }
}

//commment-out debugging ---> infinite loop
export default Fab;

