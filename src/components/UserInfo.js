import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../actions/userinfo";
import './styles/UserInfo.css'
export const UserInfo = () => {



  const sessionData = useSelector(state => state.sessionData)
  const userInfo = useSelector(state => state.userInfo)
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(sessionData).length !== 0) {
      const idJwtToken = sessionData.idToken.jwtToken
      dispatch(getUserInfo(idJwtToken))
    }
  }, [sessionData])

  useEffect(() => {
    console.log(userInfo)
  }, [userInfo])
  return (

    <div className="container-xl px-4 mt-4">
     
      <div className="row">

        <div className="col-xl-12">
          {/* Account details card*/}
          <div className="card mb-4 ">
            <div className="card-header">
              <h4 >Account Details</h4>
              </div>
            <div className="card-body">
              <form>
                {/* Form Row*/}
                <div className="row gx-3 mb-3">
                  {/* Form Group (first name)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputFirstName">First name:</label>
                    <div >{userInfo.firstname}</div>
                  </div>
                  {/* Form Group (last name)*/}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLastName">Last name:</label>
                    <div >{userInfo.lastname}</div>
                  </div>
                </div>
                {/* Form Group (email address)*/}
                <div className="row gx-3 mb-3">
                <div className="col-md-6">
                  <label className="small mb-1" >Email address:</label>
                  <div >{userInfo.email}</div>
                </div>
                <div className="col-md-6">
                  <label className="small mb-1" >Subscription Plan:</label>
                  <div >{userInfo.plan}</div>
                </div>
            </div>
            {/* Form Row*/}
            <div className="row gx-3 mb-3">
              {/* Form Group (phone number)*/}
              <div className="col-md-6">
                <label className="small mb-1" >Phone number:</label>
                <div >{userInfo.phone}</div>
              </div>
              <div className="col-md-6">
                <label className="small mb-1" >Address:</label>
                <div >{userInfo.address}</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
      </div >
    </div >
  );
}
