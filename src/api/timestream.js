/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.                                                                              
 ******************************************************************************************************************** */
  const Tsquery = require('aws-sdk/clients/timestreamquery')

  const AWS = require('aws-sdk');

  

let tsq = null




const setConfiguration = (region, accessKeyId, secretAccessKey) => {


  tsq = new Tsquery({
     region,
    accessKeyId,
    secretAccessKey,
  })
}



const getMeasures = () => {
  return tsq
    .query({
     //old query  QueryString: `SELECT measure_value::double,time FROM "sample".IoT WHERE truck_id= '368680024' ORDER BY time `
     QueryString: `SELECT watt_value,cng_value,water_value,time FROM "buildings".building1 WHERE device_id= '123' ORDER BY time `
    })
    .promise()
}


export default {
  getMeasures,
  setConfiguration

  // describeTable,
  // query,
  // rawQuery,
}
