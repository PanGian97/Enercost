const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();



async function userHasAuthority(userId,buildingId){
    const params = {
  TableName : 'seecost',
  Key: {
  
  'PK':userId,
  'SK':buildingId
  }
} 
try {
    const data = await docClient.get(params).promise()
    if(data!=null){//if user has authority for this building (so record exist)
        return true;
    }
    else return false;
  } catch (err) {
    return false;
  }
}





async function updateBuildingContract(buildingId,multiplierType,multiplierValue){
  let params;
  switch (multiplierType) {
    case 'watt':
     params = {
        TableName : 'seecost',
            Key: {
  
          'PK':buildingId,
          'SK':buildingId
              },
        UpdateExpression:"SET #ind.#indexType = :value",
         ExpressionAttributeNames:{
          '#ind': "indices",
          '#indexType': 'watt',
            },
        ExpressionAttributeValues:{
        ':value': multiplierValue
            },
            ReturnValues:"ALL_NEW"
         } 
    break;
    case 'cng':
      params = {
        TableName : 'seecost',
            Key: {
  
          'PK':buildingId,
          'SK':buildingId
              },
        UpdateExpression:"SET #ind.#indexType = :value",
         ExpressionAttributeNames:{
          '#ind': "indices",
          '#indexType': 'cng',
            },
        ExpressionAttributeValues:{
        ':value': multiplierValue
            },
         ReturnValues:"ALL_NEW"
         } 
    break;
     case 'water':
      params = {
        TableName : 'seecost',
            Key: {
  
          'PK':buildingId,
          'SK':buildingId
              },
        UpdateExpression:"SET #ind.#indexType = :value",
         ExpressionAttributeNames:{
          '#ind': "indices",
          '#indexType': 'water',
            },
        ExpressionAttributeValues:{
        ':value': multiplierValue
            },
        ReturnValues:"ALL_NEW"
         } 
    break;
  }
 
         
   return await  docClient.update(params).promise()
    .then(function(data){
       
        if(data!==null)
            return data;
        else if (data==null)return"nothing updated"
        
    })
    .catch(function(error){
        console.log(error)
        return error;
    })
}
async function updateDevice(buildingId,buildingValue,buildingValueType){
    var iotdata = new AWS.IotData({endpoint:"al3qi2b1mxp67-ats.iot.us-east-2.amazonaws.com"});
    
    var payloadObject = {
    index: parseFloat(buildingValue),
    type:buildingValueType
  };

  // Convert the JSON payload to a string

      var params = {
        topic: 'buildings/upd/'+buildingId,
        payload: JSON.stringify(payloadObject),
        qos: 0
        };
console.log(buildingId)

    try {
        const data = await iotdata.publish(params).promise();
        console.log("Published successfully:", data);
        return data;
    } catch (err) {
        console.error("Error publishing:", err);
        throw err; // or return some error response if you don't want to throw
    }


}

exports.handler = async (event,context,callback) => {
    let headers = {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH"
        }
        
     console.log(event.body)
     const body = JSON.parse(event.body)
          
    const buildingId = body['buildingid'];
    const multiplierType = body['multipliertype'];
    const multiplierValue = body['multipliervalue'];
    const authUserClaims = event.requestContext.authorizer.claims
    const userId = authUserClaims['cognito:username']
    // const buildingId = "B-2";
    // const multiplierType = "watt";
    // const multiplierValue = "0.27";
    
    
    
    //if(userHasAuthority(userId,buildingId)){

    const res = await updateBuildingContract(buildingId,multiplierType,multiplierValue);
try {
    const updDevInfo = await updateDevice(buildingId, multiplierValue,multiplierType );
    console.log(updDevInfo)
} catch (error) {
    // handle the error, for example, return an error response or log the error
    console.log(error)
}
    console.log(res)
   
     
    const response = {
        statusCode: 200,
        headers:headers,
        body: JSON.stringify(res)
    };
    return response;
    // }
    // else{
    //   const response={
    //   statusCode: 401,
    //   headers:headers,
    //   body: JSON.stringify("user is unauthorized for this building")
    //     }
    // return 0;
  //  }
};