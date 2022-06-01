import {
    MQTT_BUILDING_DATA
  } from "../actions/types";
  
  let initialState = 
    {}
  
  
  const subscriptionReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
  
      case MQTT_BUILDING_DATA:
        return payload;
      default:
        return state;
    }
  };
  
  export default subscriptionReducer;