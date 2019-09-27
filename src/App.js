import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    total: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 1000);
    //   this.setState({ intervalIsSet: interval });
    // }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://10.193.154.69:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data, total: res.data.length }    
        ));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://10.193.154.69:3001/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://10.193.154.69:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://10.193.154.69:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div>        
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <header className="mdl-layout__header">
            <div className="mdl-layout__header-row">
             
              <span className="mdl-layout-title">UPromo</span>
             
              <div className="mdl-layout-spacer"></div>
              
              <nav className="mdl-navigation mdl-layout--large-screen-only">
                <a className="mdl-navigation__link" href="/">Feed</a>
                <a className="mdl-navigation__link" href="/help">Help</a>
                <div className="drawer-option">
                  <button className="enable-notifications mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-color--accent js-push-btn">
                    Enable Notifications
                  </button>
                </div>
              </nav>
            </div>
          </header>
          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">UPromo</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="/">Feed</a>
              <a className="mdl-navigation__link" href="/help">Help</a>
              <div className="drawer-option">
                <button className="enable-notifications mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-color--accent">
                  Enable Notifications
                </button>
              </div>
            </nav>
          </div>
    <main className="mdl-layout__content mat-typography">
      <div id="create-post">
        <form>
          <div className="input-section mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input className="mdl-textfield__input" type="text" id="title" />
            <label className="mdl-textfield__label" for="title" name="title">Title</label>
          </div>
          <div className="input-section mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="manual-location">
            <input className="mdl-textfield__input" type="text" id="location" />
            <label className="mdl-textfield__label" for="location" name="location">Location</label>
          </div>
          <br></br>
          <div>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-color--accent"
                    type="submit" id="post-btn">Post!
            </button>
          </div>
          <br></br>
          <div>
            <button className="mdl-button mdl-js-button mdl-button--fab" id="close-create-post-modal-btn" type="button">
              <i className="material-icons">close</i>
            </button>
          </div>
        </form>
      </div>
      <img src="http://10.193.154.69:3000/images/main-image.jpg"
           alt="Explore the City"
           className="main-image"/>
            <div className="page-content">
              <h5 className="text-center mdl-color-text--primary">Share what you bought</h5>
              <div id="shared-moments"></div>
            </div>
            <div className="floating-button">
              <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored"
                      id="share-image-button">
                <i className="material-icons">add</i>
              </button>
            </div>
            <div id="confirmation-toast" aria-live="assertive" aria-atomic="true" aria-relevant="text" className="mdl-snackbar mdl-js-snackbar">
              <div className="mdl-snackbar__text"></div>
              <button type="button" className="mdl-snackbar__action"></button>
            </div>
            {/* <video id="gum" playsinline autoPlay muted></video>
            <video id="recorded" playsinline loop></video> */}
            <div id='results'>
  <div className="vid-container">
    <button id='getUserMediaButton' className="btn">Scan your product</button>
    <video playsinline autoPlay muted></video>
  </div>
  <div className=" hidden">
    <canvas id='grabFrameCanvas'></canvas>
    
  </div>
  <div className="vid-container">
    <button id='takePhotoButton' className="btn" disabled>Take Photo</button>
    <button id='grabFrameButton' className="btn " disabled>Recognise</button>
    <canvas id='takePhotoCanvas'></canvas>
    <img alt="img" src="" id="mirror" />
  </div>
</div>
           
           
            <div>
                <span id="errorMsg"></span>
            </div>
            <div id="popup1" className="overlay">
              <div className="popup">
                <h3>Congratulation</h3>
                <a title="" className="close" href="test.html">X</a>
                <div className="content">
                  You have unlocked a gift from Unilever. <a title="" href="https://www.axe.com/us/en/secure/sign-up.html">click Here to get it</a>
                </div>
              </div>
            </div>
    </main>
    <ul className="data-db">
      <div className="total" id="total">Sacnned Product - {data.length}</div>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.message}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}> data: </span>
                  {dat.message}
                  <span style={{ color: 'gray' }}> location: </span>
                  {dat.lat}
                  {dat.long}
                  
                </li>
              ))}
        </ul>
      
  </div>
  
      </div>
    );
  }
}
export default App;