import http from "../http-common";

const getAll = (authToken) => {
  return http.get("/user-account",{ 'headers': { 'Authorization': authToken }});
};
const getBuildingTSData = (authToken,buildingId,dateOption) => {
 
  return http.get("/user-account/building/data",{ 'headers': { 'Authorization': authToken,'buildingid': buildingId,'dateoption' :dateOption }});
};
const getUserInfo = (authToken)=>{
  return http.get("/user-account/info",{ 'headers': { 'Authorization': authToken }})
}
const getBuildingInfo=(authToken,buildingId)=>{
  return http.get("/user-account/building",{ 'headers': { 'Authorization': authToken,'buildingid': buildingId } })
}
const updateBuildingInfo=(authToken,buildingId,multiplierType,multiplierValue)=>{
  //return http.patch("/user-account/building",{'header':{'Authorization':authToken} ,'body':{'buildingid':buildingId,'multipliertype':multiplierType,'multipliervalue':multiplierValue}})
  return http.patch("/user-account/building", {
    buildingid: buildingId,
    multipliertype: multiplierType,
    multipliervalue: multiplierValue
  }, {
    headers: {
      'Authorization': authToken
    }
  })
}
const ProfileService = {
  getAll,getBuildingTSData,getBuildingInfo,getUserInfo,updateBuildingInfo
};

export default ProfileService;