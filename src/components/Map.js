import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import store from '../store';
import {
  addUserPoint,
  toggleSatelliteOverlay,
} from '../actions';
import LayerManager from '../map-utils/layer-manager';
import Marker from './Marker';
import SatelliteOverlayToggle from './SatelliteOverlayToggle';
import './Map.css';

// REVIEW may want to obfuscate this somehow. see note about weather api token
// in PopupContent.js
mapboxgl.accessToken = 'pk.eyJ1IjoicGFuYmFsYW5nYSIsImEiOiJjam55MXU0aWMxNzN5M3Byd2NmYzR3Y24wIn0.0HbKIGeEpiDqh4ezOQOw-Q';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this._map = undefined;
  }

  componentDidMount() {
    // init and configure map
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-87.6229706, 41.8867756],
      zoom: 16,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    this._map = map;

    map.on('load', this.mapDidLoad.bind(this));
    map.on('click', this.handleMapClick.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldShowSatelliteOverlay === true) {
      if (prevProps.shouldShowSatelliteOverlay === false) {
        // add satellite overlay
        // TODO this could go into the LayerManager, but it's fairly simple so
        // leaving it here for now.
        // also this might be an improvement:
        // https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
        this._map.addLayer(
          {
            id: 'satellite',
            source: 'satellite',
            type: 'raster',
          },
          'aon-center'
        );
      }
    } else if (prevProps.shouldShowSatelliteOverlay === true) {
      this._map.removeLayer('satellite');
    }
  }
  mapDidLoad() {
    const map = this._map;

    // init layer manager
    const layerManager = new LayerManager(map);

    // remove labels
    map.style.stylesheet.layers.forEach((layer) => {
      if (layer.type === 'symbol') {
        map.removeLayer(layer.id);
      }
    });

    // add aon center
    // source: https://www.turbosquid.com/3d-models/simply-city-street-3ds-free/337573
    const aonCenterLayer = layerManager.getCustomObjLayer({
      id: 'aon-center',
      filePath: process.env.PUBLIC_URL + '/aon-center.obj',
      origin: [-87.6215000, 41.8852500],
      scale: 0.537,
    });
    map.addLayer(aonCenterLayer);

    // add mapbox buildings
    const mapboxBuildingsLayer = layerManager.getMapboxBuildingsLayer();
    map.addLayer(mapboxBuildingsLayer);

    // add navigation control
    map.addControl(new mapboxgl.NavigationControl());

    // add satellite overlay toggle
    // see SatelliteOverlayToggle.js for notes on how this works with the dom
    ReactDOM.render(
      <SatelliteOverlayToggle
        didMount={this.satelliteOverlayToggleDidMount.bind(this)}
        handleClick={this.didToggleSatelliteOverlay.bind(this)}
        store={store}
      />,
      document.getElementById('satellite-overlay-toggle')
    )

    // add satellite source
    map.addSource(
      'satellite',
      {
        type: 'raster',
        url: 'mapbox://mapbox.satellite',
      }
    );
  }

  satelliteOverlayToggleDidMount(comp) {
    this._map.addControl(comp);
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} className="mapContainer">
        {this.getUserPoints().map((userPoint) => {
          return <Marker userPointId={userPoint.id}
                         key={userPoint.id}
                         map={this}
                 />;
        })}
      </div>
    );
  }

  getUserPoints() {
    return Object.values(this.props.userPoints);
  }

  didToggleSatelliteOverlay() {
    this.props.dispatch(toggleSatelliteOverlay());
  }

  handleMapClick(e) {
    /*
    ignore marker click events

    problem: clicking on a map marker fires a map click event before the marker
    click event, which means a new marker gets created each time. because the
    map event comes first, we can't use event.stopPropagation() to prevent the
    duplicate event.

    solution: this checks map click events to see if the target is a marker, and
    ignores them. this isn't ideal, so...

    TODO: find out why the map click event fires first. maybe a side effect of
    using react + mapboxgl?
    */

    const isMarkerClick = e.originalEvent.target.classList.contains('marker');
    if (isMarkerClick) return;

    // the mapbox lnglat has extra stuff we don't need. paring it down here.
    const { lng, lat } = e.lngLat;
    const lngLat = { lng, lat};

    this.props.dispatch(addUserPoint(lngLat));
  }
}

const mapStateToProps = (state) => ({
  userPoints: state.userPoints,
  shouldShowSatelliteOverlay: state.shouldShowSatelliteOverlay,
});

export default connect(mapStateToProps)(Map);
