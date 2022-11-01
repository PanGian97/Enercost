import {
  RETRIEVE_BUILDING_TS_DATA, GET_BUILDING_TS_DATA, CLEAN_ARRAY_DATA
} from "./types";

import buildingDataService from "../services/ProfileService";




export const buildingTSData = (idToken,buildingId,dateOption) => async (dispatch) => {
    try {
      console.log("loading building data from api")
      console.log(buildingId)
      console.log(dateOption)
      const res = await buildingDataService.getBuildingTSData(idToken,buildingId,dateOption);
      console.log(res)
      dispatch({
        type: GET_BUILDING_TS_DATA,
        payload: res.data.Rows
      })
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




