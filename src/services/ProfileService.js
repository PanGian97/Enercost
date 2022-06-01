import http from "../http-common";

const getAll = (authToken) => {
  return http.get("/user-account",{ 'headers': { 'Authorization': authToken }});
};
const getBuildingTSData = (buildingId) => {
  console.log(buildingId)
  return http.get("/user-account/building/data",{ 'headers': { 'buildingid': "B-1" }});
};
const getBuildingInfo=(authToken,buildingId)=>{
  return http.get("/user-account/building",{ 'headers': { 'Authorization': authToken,'buildingid': buildingId } })
}
const ProfileService = {
  getAll,getBuildingTSData,getBuildingInfo
};

export default ProfileService;