
import {
  GET_BUILDING_TS_DATA, CLEAN_ARRAY_DATA,MQTT_BUILDING_DATA
} from "../actions/types";

let initialState = 
  []

const buildingDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BUILDING_TS_DATA:
      return payload;
    case MQTT_BUILDING_DATA:
      return [payload, ...state];
    case CLEAN_ARRAY_DATA:
      return payload;
    default:
      return state;
  }
};

export default buildingDataReducer;