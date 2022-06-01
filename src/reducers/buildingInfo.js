
import {
    GET_BUILDING_INFO
  } from "../actions/types";
  
  let initialState = 
    {}
  
  const buildingInfoReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
  
      case GET_BUILDING_INFO:
        return payload;
      default:
        return state;
    }
  };
  
  export default buildingInfoReducer;