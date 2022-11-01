
import {
    RETRIEVE_BUILDINGS,GET_BUILDING_INFO,UPD_BUILDING_INFO
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
  export const getBuildingInfo = (authToken,buildingId)=>async(dispatch)=>{
    try {
      const res = await buildingDataService.getBuildingInfo(authToken,buildingId);
console.log(res.data.Item)
      dispatch({
        type: GET_BUILDING_INFO,
        payload: res.data.Item,
      });
    } catch (err) {
      console.log(err);
    }
  }
  export const updateBuildingInfo = (authToken,buildingId,type,value)=>async(dispatch)=>{
    try {
      const res  =await buildingDataService.updateBuildingInfo(authToken,buildingId,type,value);
      console.log(res)
      dispatch({
        type:UPD_BUILDING_INFO,
        payload:res
      });
    } catch (err) {
      console.log(err);//later will be replaced with dash msg
    }
  }