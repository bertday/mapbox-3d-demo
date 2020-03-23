import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import Map from './Map';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <header>
            <div className="title">
              <img src="aon-logo.svg" className="logo" alt="AON" />
              <span className="center">Center +</span>
            </div>
            <p className="help-text">
              This app uses Mapbox GL to render a 3D building representing AON Center in Downtown
              Chicago.
            </p>
            <p className="help-text">
              Explore nearby locations by clicking on the map. A marker will appear with the current
              weather, along with the latitude and longitude of that point.
            </p>
            <p className="help-text">
              To toggle satellite imagery, click the <i className="fas fa-globe"></i> button just below the navigation controls
              in the upper-right corner of the map.
            </p>
          </header>
          <Map />
        </div>
      </Provider>
    );
  }
}

export default App;
