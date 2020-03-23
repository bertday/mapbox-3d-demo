import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './SatelliteOverlayToggle.css';

class SatelliteOverlayToggle extends React.Component {
  /*
    a custom map control for toggling the satellite imagery on/off.

    implements mapbox gl icontrol interface
    https://docs.mapbox.com/mapbox-gl-js/api/#icontrol

    the way this is managed is:
    1. map load event handler instantiates this component and renders it
       initially to a dummy div (see index.html)
    2. componentDidMount below sends an event back up to the parent to notify it
       that it mounted
    3. parent adds it to the map controls

    the reason for this workflow is that we want react to manage rendering the
    toggle dom element, but react isn't aware of mapbox's map so we need to add
    it via the mapboxgl.Map.addControl api.
  */

  componentDidMount() {
    this.props.didMount(this);
  }

  onAdd(map) {
    return ReactDOM.findDOMNode(this);
  }

  onRemove(map) {
    // TODO it's unlikely we'd ever want to remove this control, but may want to
    // implement this at some point
    return;
  }

  handleClick(e) {
    // pass event up to the parent to add/remove the layer
    this.props.handleClick();
  }

  render () {
    let className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    if (this.props.shouldShowSatelliteOverlay) {
      className += ' SatelliteOverlayToggle--active'
    }

    return (
      <div className={className}>
        <button onClick={this.handleClick.bind(this)}>
          <i className="fas fa-globe"></i>
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  shouldShowSatelliteOverlay: state.shouldShowSatelliteOverlay,
});

export default connect(mapStateToProps)(SatelliteOverlayToggle);
