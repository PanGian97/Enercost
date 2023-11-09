import {
  RETRIEVE_BUILDING_TS_DATA, GET_BUILDING_TS_DATA, CLEAN_ARRAY_DATA, UPDATE_BUILDING_CHART_DATA
} from "./types";

import buildingDataService from "../services/ProfileService";
const propertyNames = [
  //order has to follow be the same as the incoming data
  "device_loc",
  "device_id",
  "device_type",
  "metric",
  "timestamp",
  "water_value",
  "watt_price_value",
  "water_price_value",
  "cng_price_value",
  "watt_value",
  "cng_value"
];
export const buildingTSData = (idToken, buildingId, dateOption) => async (dispatch) => {
  try {
    
    console.log(dateOption);
    const res = await buildingDataService.getBuildingTSData(idToken, buildingId, dateOption);

    // Check if res.data.Rows is undefined, if so dispatch an empty array   
    const payloadData = res.data.Rows.map(row =>
      row.Data.reduce((acc, dataObj, index) => {
        acc[propertyNames[index]] = dataObj.ScalarValue;
        return acc;
      }, [])
    ) || [];
    console.log(payloadData)
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

export const updateChartData = (incomingSensorData) => async (dispatch) => {
  dispatch({
    type: UPDATE_BUILDING_CHART_DATA,
    payload: incomingSensorData
  });
}
