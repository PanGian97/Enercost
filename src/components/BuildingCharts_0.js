import React, { useEffect, useState } from 'react'
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { Amplify, PubSub } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from "react-redux";
import Chart from 'react-apexcharts'



AWS.config.region = 'us-east-2'

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsCustomConfig.aws_cognito_identity_pool_id
});
AWS.config.credentials.get((err) => {
    if (err) {
        console.log(AWS.config.credentials);
        throw err;
    } else {
        console.log("acceskey " + AWS.config.credentials.accessKeyId + " secret " +
            AWS.config.credentials.secretAccessKey)
        mqttClient.updateWebSocketCredentials(
            AWS.config.credentials.accessKeyId,
            AWS.config.credentials.secretAccessKey,
            AWS.config.credentials.sessionToken
        );
    }
});

mqttClient.on('connect', () => {
    console.log('mqttClient connected')
    mqttClient.subscribe('buildings')
  });
  
  mqttClient.on('error', (err) => {
    console.log('mqttClient error:', err)
  });
  
  mqttClient.on('message', (topic, payload) => {
    const msg = JSON.parse(payload.toString());
    console.log('mqttClient message: ', msg);
  });
export const BuildingCharts = () => {

    

    const data = useSelector(state => state.buildingTSData);

    const dispatch = useDispatch();


    useEffect(() => {
        // Auth.currentCredentials().then((info) => {
        //     const cognitoIdentityId = info.identityId;
        //     console.log(cognitoIdentityId)
        // })
        dispatch(mqttSubscription())
        dispatch(buildingTSData(userOptions.defaultBuildingId))

        return () => {
                      
            //dispatch(mqttUnsubscribe())
        }
    }, [])

    return (
        <div>
         <Chart options={timeseries} series={values} type="line" width={1600} height={500} />
        </div>
    );
}
//aws dynamodb get-item --table-name 'Subscriptions'  --key='PK':'b_1'