import { SAVE_BUILDING_SELECTION, LOAD_BUILDING_SELECTION } from "../actions/types";

let initialState = {
  defaultBuildingId: "",
}
if (localStorage.getItem('selected_building')) {
  initialState.defaultBuildingId = JSON.parse(localStorage.getItem('selected_building'))
} else {
  initialState.defaultBuildingId = ""
}


const userOptionsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {

    case SAVE_BUILDING_SELECTION:
     
      return {      
      defaultBuildingId:payload
      }
    case LOAD_BUILDING_SELECTION:
      return {
        defaultBuildingId: payload
      }
    default:
      return state;
  }
};

export default userOptionsReducer;