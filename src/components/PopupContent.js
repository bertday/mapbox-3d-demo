import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  updateUserPointLngLat,
  fetchWeatherForUserPoint,
} from '../actions';
import EditableLabel from './EditableLabel';
import './PopupContent.css';

class PopupContent extends React.Component {
  render() {
    return (
      <>
        <section className="weather">
          <h1>Weather</h1>

          {this.getWeather().isFetching === true ?
            'Loading...' :
            <div className="weather-container">
              {
                // TODO fix alt tag for accessibility
              }
              <img className="weather-icon" src={`//openweathermap.org/img/wn/${this.getWeather().data.iconId}@2x.png`} alt="Weather conditions" />
              <span className="temperature">{this.getWeatherText()}</span>
            </div>
          }

          <div className="last-updated">
            Last updated: {moment(this.getWeather().updatedAt).format('l [at] h:mm:ss a')}
            </div>
        </section>

        <section>
          <h1>Location</h1>
          <p className="help-text">
            To edit coordinates, drag the marker on the map or click the text below and start typing. Hit Enter ↵ when you're
            done.
          </p>

          <div className="coordinate">
            <div className="coordinate-label">Latitude:</div>
            <EditableLabel
              value={this.getLngLat().lat}
              validator={this.validateCoordinate}
              onUpdate={(nextCoord) => {
                this.handleLngOrLatUpdate(nextCoord, 'lat');
              }}
              errorMessage="Please check the latitude you entered and try again."
            />
          </div>

          <div className="coordinate">
            <div className="coordinate-label">Longitude:</div>
            <EditableLabel
              value={this.getLngLat().lng}
              validator={this.validateCoordinate}
              onUpdate={(nextCoord) => {
                this.handleLngOrLatUpdate(nextCoord, 'lng');
              }}
              errorMessage="Please check the longitude you entered and try again."
            />
          </div>
        </section>
      </>
    );
  }

  getUserPoint() {
    const { userPointId, userPoints } = this.props;
    const userPoint = userPoints[userPointId];
    return userPoint;
  }

  getLngLat() {
    return this.getUserPoint().lngLat;
  }

  getWeather() {
    return this.getUserPoint().weather;
  }

  validateCoordinate(coorindate) {
    return !/^\s*$/.test(coorindate) && !isNaN(coorindate);
  }

  handleLngOrLatUpdate(nextCoordStr, latOrLng) {
    const { userPointId } = this.props;
    // cast next coord string (from text input) to a float
    const nextCoord = parseFloat(nextCoordStr);
    const prevLngLat = this.getLngLat();
    const nextLngLat = { ...prevLngLat };
    nextLngLat[latOrLng] = nextCoord;

    this.props.dispatch(updateUserPointLngLat(userPointId, nextLngLat));
    this.props.dispatch(fetchWeatherForUserPoint(userPointId));
  }

  getWeatherText() {
    return `It's ${Math.floor(this.getWeather().data.temperature)}°F with ${this.getWeather().data.description}.`;
  }
}

const mapStateToProps = (state) => ({
  userPoints: state.userPoints,
});

export default connect(mapStateToProps)(PopupContent);
