
import {
    RETRIEVE_BUILDINGS
  } from "../actions/types";
  
  let initialState = 
    []
  
  const buildingsReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
  
      case RETRIEVE_BUILDINGS:
        return payload;
      default:
        return state;
    }
  };
  
  export default buildingsReducer;