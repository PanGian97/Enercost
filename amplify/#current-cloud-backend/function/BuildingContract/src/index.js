exports.handler = async (event) => {
    console.log(event)
    const buildingId = event.pathParameters.buildingId;
    const building = {'buildingId': buildingId, 'buildingName': "building " + buildingId };
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
     headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "*"
     }, 
        body: JSON.stringify(building),
    };
    return response;
};