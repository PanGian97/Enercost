
import {
    RETRIEVE_BUILDINGS,GET_BUILDING_INFO
  } from "./types";
  
  import buildingDataService from "../services/ProfileService";
  
export const retrieveBuildings = (authToken) => async (dispatch) => {
    const savedUserBuildings = JSON.parse(localStorage.getItem('user_buildings'))//get user buildings from localstorage
    if (savedUserBuildings == null) {//if nothing there...
      try {
        const res = await buildingDataService.getAll(authToken);
        localStorage.setItem('user_buildings',JSON.stringify(res.data))//save buildings to localstorage(further filtering needed)
        dispatch({
          type: RETRIEVE_BUILDINGS,
          payload: res.data,
        });
        console.log(res.data)
      } catch (err) {
        console.log(err);
      }
    }else{
      dispatch({
        type:RETRIEVE_BUILDINGS,//dispatch user buildings from localstorage without a web request
        payload:savedUserBuildings
      })
      console.log("loaded from localstorage")
    }
  };
  export const getBuildingInfo = (buildingId)=>async(dispatch)=>{
    try {
      const res = await buildingDataService.getBuildingInfo(buildingId);
     
      dispatch({
        type: GET_BUILDING_INFO,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  }