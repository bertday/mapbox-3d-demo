import React from 'react';
import ReactDom from 'react-dom';
import mapboxgl from 'mapbox-gl';
import LayerManager from '../layer-manager';
import SatelliteOverlayToggle from './SatelliteOverlayToggle';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicGFuYmFsYW5nYSIsImEiOiJjam55MXU0aWMxNzN5M3Byd2NmYzR3Y24wIn0.0HbKIGeEpiDqh4ezOQOw-Q';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.map = undefined;

    // set initial state
    this.state = {
      shouldShowSatelliteOverlay: false,
      markers: [],
    };
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

    this.map = map;

    map.on('load', this.mapDidLoad.bind(this));
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.state.shouldShowSatelliteOverlay) {
      if (nextState.shouldShowSatelliteOverlay) {
        // add satellite overlay
        // TODO this could go into the LayerManager, but it's fairly simple so
        // leaving it here for now.
        // also this might be an improvement:
        // https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
        this.map.addLayer(
          {
            id: 'satellite',
            source: 'satellite',
            type: 'raster',
          },
          'aon-center'
        );
      }
    } else if (!nextState.shouldShowSatelliteOverlay) {
      // remove satellite overlay
      this.map.removeLayer('satellite');
    }
  }

  render() {
    return <div ref={el => this.mapContainer = el} className="mapContainer" />;
  }

  mapDidLoad() {
    const { map } = this;

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
    ReactDom.render(
      <SatelliteOverlayToggle
        didMount={this.satelliteOverlayToggleDidMount.bind(this)}
        handleClick={this.didToggleSatelliteOverlay.bind(this)}
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
    this.map.addControl(comp);
  }

  didToggleSatelliteOverlay() {
    this.setState({
      shouldShowSatelliteOverlay: !this.state.shouldShowSatelliteOverlay,
    });
  }
}

export default Map;
