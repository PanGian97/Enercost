import React from "react";
import { Amplify } from 'aws-amplify';
import Body2 from './Body2'
import {Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from "../aws-config-custom"
Amplify.configure(awsExports);

export const AuthenticatorComp=() =>{
    
        return(
          <Authenticator loginMechanisms={['email']}>         
            {({ signOut, user }) => (
            <main>
              {/* <Body2></Body2> */}
              <button onClick={signOut}>Sign out</button>
            </main>
             )}
           </Authenticator> 
            )
            
            
          }