import { combineReducers } from "redux";
import buildingTSData from "./buildingTSData";
import buildings from "./buildings";
import userOptions from"./userOptions";
import subscription from "./subscription";
import buildingInfo from './buildingInfo'
import sessionData from './sessionData'
import { LOGOUT } from "../actions/types";
const appReducer = combineReducers({
  buildings,buildingTSData,userOptions,subscription,buildingInfo,sessionData
});

 const rootReducer = (state,action)=>{
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
}
export default rootReducer;
