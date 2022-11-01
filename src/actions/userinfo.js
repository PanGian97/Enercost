import { GET_USER_INFO } from "./types";
import userDataService from "../services/ProfileService";
export const getUserInfo = (userId)=>async(dispatch)=>{
    try {
      const res = await userDataService.getUserInfo(userId);
     
      dispatch({
        type: GET_USER_INFO,
        payload: res.data.Item,//Item is a nested object returned from DynDB request containing user info
      });
    } catch (err) {
      console.log(err);
    }
  }