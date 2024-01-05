import { combineReducers } from "redux";
import buildingData from "./buildingData";
import buildings from "./buildings";
import userOptions from"./userOptions";
import subscription from "./subscription";
import buildingInfo from './buildingInfo'
import sessionData from './sessionData'
import userInfo from './userInfo'
import { LOGOUT } from "../actions/types";
const appReducer = combineReducers({
  buildings,buildingData,userOptions,subscription,buildingInfo,sessionData,userInfo
});

 const rootReducer = (state,action)=>{
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
}
export default rootReducer;
