
import {
    GET_BUILDING_INFO,UPD_BUILDING_INFO
  } from "../actions/types";
  
  let initialState = 
    {indices:{cng:'',watt:'',water:''}}
  
  const buildingInfoReducer = (state = initialState, action) => {
    const { type, payload } = action;
    
    switch (type) {    
      case GET_BUILDING_INFO: 
      console.log("Returned get payload", payload)
      const { cng:cngIndexValue, watt:wattIndexValue, water:waterIndexValue } = payload.indices;   
      return {
        ...state,
        indices: {
          cng: cngIndexValue,
          watt: wattIndexValue,
          water: waterIndexValue
        }
      };
      case UPD_BUILDING_INFO:
        console.log("Returned upd payload", payload)
        const { cng:newCngIndexValue, watt:newWattIndexValue, water:newWaterIndexValue } = payload.indices;
        return {
          ...state,
          indices: {
            cng: newCngIndexValue,
            watt: newWattIndexValue,
            water: newWaterIndexValue
          }
        };
      default:
        return state;
    }
  };
  
  export default buildingInfoReducer;