/*
  this component wraps mapboxgl.Marker so react can manage map markers.
  see Map.state.userPoints for where these are stored in state.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import store from '../store';
import {
  updateUserPointLngLat,
  fetchWeatherForUserPoint,
} from '../actions';
import PopupContent from './PopupContent';
import './Marker.css';

class Marker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: {
        isFetching: true,
        updatedAt: undefined,
        data: {},
      },
    };

    this._marker = undefined;
  }

  componentDidMount() {
    const { userPointId } = this.props;

    const element = ReactDOM.findDOMNode(this);

    // create popup
    const popupContentEl = document.createElement('div');
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
    })
      .setDOMContent(popupContentEl);

    // create marker
    const marker = new mapboxgl.Marker({
      element,
      draggable: true,
    })
      .setLngLat(this.getLngLat())
      .setPopup(popup)
      .on('drag', this.handleDrag.bind(this))
      .on('dragend', this.handleDragEnd.bind(this))
      .addTo(this.props.map._map)
      .togglePopup();

    // add our internal id so this can be correlated to an object in
    // Map.state.userPoints on drag
    marker._userPointId = userPointId;

    // mount react popup content component to the container created by mapbox
    // const popupContentEl = popup._content;
    ReactDOM.render(
      <PopupContent
        userPointId={userPointId}
        store={store}
        handleLngLatUpdate={this.updateUserPointLngLat.bind(this)}
      />,
      popupContentEl
    );

    this._marker = marker;

    // fetch weather
    this.props.dispatch(fetchWeatherForUserPoint(userPointId));
  }

  componentDidUpdate(prevProps) {
    // check for if the user manually edited the lat or lng
    const lngLat = this.getLngLat();
    const { userPointId } = this.props;

    const prevLatLng = prevProps.userPoints[userPointId].lngLat;

    const shouldSetMarkerLngLat = (
      prevLatLng.lat !== lngLat.lat ||
      prevLatLng.lng !== lngLat.lng
    );

    if (shouldSetMarkerLngLat) {
      this._marker.setLngLat(lngLat);
    }
  }

  render() {
    return <div className="marker"></div>;
  }

  getLngLat() {
    const { userPointId, userPoints } = this.props;
    return userPoints[userPointId].lngLat;
  }

  handleDrag(e) {
    // get the user point with the same id as the marker
    const userPointId = e.target._userPointId;

    const nextLngLatFromEvent = e.target.getLngLat();
    // the lnglat attached to the event has unnecessary data/functions. pluck
    // just lng and lat to keep our state clean.
    const nextLngLat = {
      lng: nextLngLatFromEvent.lng,
      lat: nextLngLatFromEvent.lat,
    };

    this.updateUserPointLngLat(userPointId, nextLngLat);
  }

  handleDragEnd(e) {
    // only fetch weather on drag end to converve openweather api calls
    this.props.dispatch(fetchWeatherForUserPoint(this.props.userPointId));
  }

  updateUserPointLngLat(id, nextLngLat) {
    this.props.dispatch(updateUserPointLngLat(id, nextLngLat));
  }
}

const mapStateToProps = (state) => ({
  userPoints: state.userPoints,
});

export default connect(mapStateToProps)(Marker);
