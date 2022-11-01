import { GET_USER_INFO } from "../actions/types";
  
let initialState = 
{}

  
const userInfoReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
  
      case GET_USER_INFO:
        return payload;
      default:
        return state;
    }
  };
  
  export default userInfoReducer;