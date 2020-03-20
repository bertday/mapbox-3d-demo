import React from 'react';
import Map from './Map';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <img src="aon-logo.svg" className="logo" alt="AON" />
          <span className="center">Center</span>
        </header>
        <Map />
      </div>
    );
  }
}

export default App;
