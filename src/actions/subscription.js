import {
    MQTT_BUILDING_DATA,MQTT_UNSUBSCRIBE
} from "./types";
import { Amplify } from 'aws-amplify'
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { PubSub } from "aws-amplify";
import { PubSubClass } from "@aws-amplify/pubsub/lib-esm/PubSub";

const pubsub = new PubSubClass({})
let subscription;

export const mqttSubscription = (selectedBuildingTopic) => async (dispatch) => {
    pubsub.addPluggable(new AWSIoTProvider({
        aws_pubsub_region: 'us-east-2',
        aws_pubsub_endpoint: 'wss://al3qi2b1mxp67-ats.iot.us-east-2.amazonaws.com/mqtt',
    }))

    subscription = pubsub.subscribe('buildings/B-1').subscribe({//Attention! The function that will be called it uses the old values and not the ones seted after this function called
        next: data => {
            let energyDataArray=[]
            console.log(data.value)//it outputs the old state values when the function run 
            energyDataArray.push(data.value['watt_value'].toString())
            energyDataArray.push(data.value['watt_price_value'].toString())
            energyDataArray.push(data.value['cng_value'].toString())
            energyDataArray.push(data.value['cng_price_value'].toString())
            energyDataArray.push(data.value['water_value'].toString())
            energyDataArray.push(data.value['water_price_value'].toString())
     
            dispatch({
                type: MQTT_BUILDING_DATA,
                payload: energyDataArray
            })
        },
        error: error => console.error(error),
        complete: () => console.log('Done'),
    })
}

export const mqttUnsubscribe = () => async (dispatch) => {
    console.log('UNSUB callled')
    console.log(pubsub.getProviders())
    subscription.unsubscribe('buildings')
    pubsub.removePluggable('AWSIoTProvider')
    dispatch({
        type: MQTT_UNSUBSCRIBE,
        payload: []
    })
}