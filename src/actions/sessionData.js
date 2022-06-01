import {USER_SESSION,} from './types'



export const userSession = (userSession) => async (dispatch)=>{
    dispatch({
      type:USER_SESSION,
      payload: userSession
    })
  };