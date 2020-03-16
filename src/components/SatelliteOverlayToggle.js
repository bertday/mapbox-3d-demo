import React from 'react';
import ReactDom from 'react-dom';
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

  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      // TODO this should be consolidated with App.shouldShowSatelliteOverlay so
      // there's a single source of truth for whether to show the satellite
      // layer. a global state store like redux might be a good solution.
      active: false,
    };
  }

  componentDidMount() {
    this.props.didMount(this);
  }

  onAdd(map) {
    return ReactDom.findDOMNode(this);
  }

  onRemove(map) {
    // TODO it's unlikely we'd ever want to remove this control, but may want to
    // implement this at some point
    return;
  }

  handleClick(e) {
    this.setState({
      active: !this.state.active,
    });

    // pass event up to the parent to add/remove the layer
    this.props.handleClick();
  }

  render () {
    const { active } = this.state;

    return (
      <div className={`mapboxgl-ctrl mapboxgl-ctrl-group ${active ? 'SatelliteOverlayToggle--active' : ''}`}>
        <button onClick={this.handleClick.bind(this)}>
          <i className="fas fa-globe"></i>
        </button>
      </div>
    );
  }
}

export default SatelliteOverlayToggle;
