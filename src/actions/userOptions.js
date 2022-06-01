
import {
    SAVE_BUILDING_SELECTION,LOAD_BUILDING_SELECTION,LOGOUT
  } from "./types";
  
export const saveSelectedBuildingId = (newSelBuildingId) => async (dispatch)=>{
   
    localStorage.setItem('selected_building',JSON.stringify(newSelBuildingId))
    dispatch({
      type:SAVE_BUILDING_SELECTION,
      payload: newSelBuildingId
    })
  };

  export const loadSelectedBuildingId = () => async (dispatch)=>{
 //if building selection exists in local storage,use it, otherwise set to empty array
    let selBuildingId = localStorage.getItem('selected_building')
    ?JSON.parse(localStorage.getItem('selected_building'))
    :"";
    dispatch({
      type:LOAD_BUILDING_SELECTION,
      payload: selBuildingId
    })
  }
export const onLogout = () => {
 localStorage.clear()
    return dispatch => {     
       dispatch({ type: LOGOUT});
    };
 }