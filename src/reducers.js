import shortid from 'shortid';
import {
  ADD_USER_POINT,
  UPDATE_USER_POINT_LNGLAT,
  FETCH_USER_POINT_WEATHER_BEGIN,
  FETCH_USER_POINT_WEATHER_SUCCESS,
  FETCH_USER_POINT_WEATHER_FAILURE,
  TOGGLE_SATELLITE_OVERLAY,
} from './actions';

const initialState = {
  userPoints: {},
  shouldShowSatelliteOverlay: false,
};

function rootReducer(state = initialState, action) {
  // TODO refactor these into individual files in an /actions directory
  switch (action.type) {
    case ADD_USER_POINT: {
      const { lngLat } = action;

      // assign unique id to correlate user points in state with map markers
      const id = shortid.generate();

      const nextState = {
        ...state,
        userPoints: {
          ...state.userPoints,
          [id]: {
            id,
            lngLat,
            weather: {
              isFetching: true,
              error: null,
              data: null,
            }
          },
        },
      };

      return nextState;
    }
    case UPDATE_USER_POINT_LNGLAT: {
      const { id, lngLat } = action;

      return {
        ...state,
        userPoints: {
          ...state.userPoints,
          [id]: {
            id,
            lngLat,
            weather: {
              ...state.userPoints[id].weather,
            }
          },
        }
      }
    }

    /*
    weather
    */
    case FETCH_USER_POINT_WEATHER_BEGIN: {
      const { id } = action;

      return {
        ...state,
        userPoints: {
          ...state.userPoints,
          [id]: {
            id,
            lngLat: {
              ...state.userPoints[id].lngLat,
            },
            weather: {
              data: null,
              isFetching: true,
              error: null,
            },
          },
        },
      };
    }
    case FETCH_USER_POINT_WEATHER_SUCCESS: {
      const { id, payload } = action;

      // pluck just the values we need in the ui
      const temperature = payload.main.temp;
      // FIX these assume at least one item in "weather" array
      const description = payload.weather[0].description;
      const iconId = payload.weather[0].icon;

      return {
        ...state,
        userPoints: {
          ...state.userPoints,
          [id]: {
            id,
            lngLat: {
              ...state.userPoints[id].lngLat,
            },
            weather: {
              data: {
                temperature,
                description,
                iconId,
              },
              isFetching: false,
              error: null,
            },
          },
        },
      };
    }
    case FETCH_USER_POINT_WEATHER_FAILURE: {
      // TODO
      return;
    }
    case TOGGLE_SATELLITE_OVERLAY: {
      return {
        ...state,
        shouldShowSatelliteOverlay: !state.shouldShowSatelliteOverlay,
      };
    }
    default: {
      return state;
    }
  }
}

export default rootReducer;
