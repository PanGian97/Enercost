import {
  RETRIEVE_BUILDING_TS_DATA, GET_BUILDING_TS_DATA, CLEAN_ARRAY_DATA
} from "./types";

import buildingDataService from "../services/ProfileService";

export const buildingTSData = (idToken, buildingId, dateOption) => async (dispatch) => {
    try {
        console.log("loading building data from api");
        console.log(buildingId);
        console.log(dateOption);
        const res = await buildingDataService.getBuildingTSData(idToken, buildingId, dateOption);
        console.log(res);
        
        // Check if res.data.Rows is undefined, if so dispatch an empty array
        const payloadData = res.data.Rows || [];
        
        dispatch({
            type: GET_BUILDING_TS_DATA,
            payload: payloadData
        });
    } catch (err) {
        console.log(err);
        // Dispatching an error action (optional)
        dispatch({
            type: 'API_ERROR',
            payload: err.message
        });
    }
};

export const cleanProfileStateArray = () => async (dispatch) => {
  dispatch({
    type: CLEAN_ARRAY_DATA,
    payload: [], //init an empty array
  });
};
