import {
  RETRIEVE_BUILDING_TS_DATA, GET_BUILDING_TS_DATA, CLEAN_ARRAY_DATA
} from "./types";

import buildingDataService from "../services/ProfileService";




export const buildingTSData = (buildingId) => async (dispatch) => {
    try {
      console.log("loading building data from api")
      const res = await buildingDataService.getBuildingTSData(buildingId);
      console.log(res)
    } catch (err) {
      console.log(err);
    }
};
export const cleanProfileStateArray = () => async (dispatch) => {
  dispatch({
    type: CLEAN_ARRAY_DATA,
    payload: [],//init an empty array
  })
};




