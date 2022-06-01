import logo from './logo.svg';
import './App.css';
import {Amplify, API,PubSub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import {Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import AWS  from 'aws-sdk'
import { Auth } from 'aws-amplify';

const App2 = () => {
  // Auth.currentCredentials().then((info) => {
  //   console.log(info.identityId);
  // });

  useEffect(() => {    
    
    const setupPubSub =async ()=>{
      console.log("setupPubSub called")
       Amplify.addPluggable(new AWSIoTProvider({
        aws_pubsub_region: 'us-east-2',
        aws_pubsub_endpoint: 'wss://al3qi2b1mxp67-ats.iot.us-east-2.amazonaws.com/mqtt',
      }))
    }
  
  
  setupPubSub()
  .then(subscribe())
  

},[]);
async function subscribe() {
  console.log("I got called")
 PubSub.subscribe('buildings').subscribe({
  next: data => console.log('Message received', data),
  error: error => console.error(error),
  complete: () => console.log('Done'),
});
}

  return (
    
    
<Authenticator loginMechanisms={['email']}>
{({ signOut, user }) => (
  
     
          <button onClick={signOut}>Sign out</button>
 
)}
</Authenticator> 
    
  )
}

export default App2
//cognito identity id--> 
//aws iot attach-policy --policy-name admin --target us-east-2:1b5c886c-e065-42ea-9207-a6bebc0c2f62
// aws cognito-idp sign-up --region us-east-2  --client-id 488qq4ulhmqvaish76gsq35b5d --username admin@example.com  --password 1234qwer
// aws cognito-idp admin-confirm-sign-up --region us-east-2 --user-pool-id us-east-2_gXvYmTlCU --username admin@example.com