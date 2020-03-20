import React from 'react';
import ReactDom from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './Marker.css';

class Marker extends React.Component {
  /*
    this component wraps mapboxgl.Marker so react can manage map markers.
    see Map.state.userPoints for where these are stored in state.
  */
  constructor(props) {
    super(props);

    this._marker = undefined;
  }

  componentDidMount() {
    const element = ReactDom.findDOMNode(this);

    const marker = new mapboxgl.Marker({
      element,
      draggable: true,
    })
      .setLngLat(this.props.lngLat)
      .addTo(this.props.map);

    this._marker = marker;
  }

  render() {
    return <div class="marker"></div>;
  }
}

export default Marker;
