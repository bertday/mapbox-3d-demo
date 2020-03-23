/*
action constants
*/
export const ADD_USER_POINT = 'ADD_USER_POINT';
export const UPDATE_USER_POINT_LNGLAT = 'UPDATE_USER_POINT_LNGLAT';
export const FETCH_USER_POINT_WEATHER_BEGIN = 'FETCH_USER_POINT_WEATHER_BEGIN';
export const FETCH_USER_POINT_WEATHER_SUCCESS = 'FETCH_USER_POINT_WEATHER_SUCCESS';
export const FETCH_USER_POINT_WEATHER_FAILURE = 'FETCH_USER_POINT_WEATHER_FAILURE';
export const TOGGLE_SATELLITE_OVERLAY = 'TOGGLE_SATELLITE_OVERLAY';

/*
action creators
*/
export function addUserPoint(lngLat) {
  return {
    type: ADD_USER_POINT,
    lngLat,
  };
}

export function updateUserPointLngLat(id, lngLat) {
  return {
    type: UPDATE_USER_POINT_LNGLAT,
    id,
    lngLat,
  };
}

export function fetchUserPointWeatherBegin(id) {
  return {
    type: FETCH_USER_POINT_WEATHER_BEGIN,
    id,
  };
}

export function fetchUserPointWeatherSuccess(id, payload) {
  return {
    type: FETCH_USER_POINT_WEATHER_SUCCESS,
    id,
    payload,
  };
}

export function fetchUserPointWeatherFailure() {
  return {
    type: FETCH_USER_POINT_WEATHER_FAILURE,
  };
}

export function toggleSatelliteOverlay() {
  return {
    type: TOGGLE_SATELLITE_OVERLAY,
  };
}


/*
effects
*/

// TODO put this in a config file
// may want to reconsider having this checked in to source control; it could be
// injected somehow during the ci build instead. but even so, someone could
// sniff it out in the browser. it might be worth exploring other options for
// securing this and other api keys (e.g. mapbox).
const OPEN_WEATHER_APP_ID = '8e7a58f2a535ae9dbcc72ac6ab249a6d';

// helper to handle fetch errors
// adapted from https://daveceddia.com/where-fetch-data-redux/
function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res;
}

export function fetchWeatherForUserPoint(id) {
  return async (dispatch, getState) => {
    dispatch(fetchUserPointWeatherBegin(id));

    const state = getState();
    const lngLat = state.userPoints[id].lngLat;
    const { lng, lat } = lngLat;

    const url = `//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&APPID=${OPEN_WEATHER_APP_ID}`;

    try {
      const res = await fetch(url);

      handleErrors(res);

      const json = await res.json();

      dispatch(fetchUserPointWeatherSuccess(id, json));

      // REVIEW do we need to return something here
      return json;
    } catch (e) {
      dispatch(fetchUserPointWeatherFailure(e));
    }
  }
}
