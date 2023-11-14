import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import {components,formFields} from './components/AuthComponents.js'
import { useDispatch, useSelector } from "react-redux";
import { onLogout } from "./actions/userOptions"
import { userSession } from "./actions/sessionData"
import {  Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Hub, Logger } from 'aws-amplify';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Buildings } from './components/Buildings';
import { UserInfo } from './components/UserInfo';
import { BuildingInfo } from './components/BuildingInfo'
import { BuildingDash } from './components/BuildingDash'
import { BuildingCharts } from './components/BuildingCharts'
import { NavBar } from './components/NavBar';
import { Auth } from 'aws-amplify';
function App() {
  const dispatch = useDispatch()
  const sessionData = useSelector(state => state.sessionData)
  const [isAlreadySignedIn, setIsAlreadySignedIn] = useState(false)

  useEffect(()=>{
    
   async function checkIfAlreadySignedIn(){
    try {
      const session =  await Auth.currentSession()//if empty user is not signed in
        console.log(session)
        dispatch(userSession(session))
      
      console.log('user has already signed in')
    } catch (error) {
     
      console.log('no current user')
    }
  }
    checkIfAlreadySignedIn()
  },[])
  

  


const listener = async(data) => {
  switch (data.payload.event) {
    case 'signIn':
      const session = await Auth.currentSession()
      console.log(session)
      dispatch(userSession(session))
      break;
    case 'signOut':
      dispatch(onLogout())

      break;
    case 'signIn_failure':

      break;
  }
}
Hub.listen('auth', listener);



return (
  <Authenticator hideSignUp formFields={formFields} components={components} loginMechanisms={['email']}>
    {({ signOut, user }) => (
      <main>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path='/' component={UserInfo}></Route>
            <Route path='/buildings' component={Buildings}></Route>
            <Route path='/userInfo' component={UserInfo}></Route>
            <Route path='/buildingInfo' component={BuildingInfo}></Route>
            <Route path='/buildingCharts' component={BuildingCharts}></Route>
            <Route path='/buildingDashboard' component={BuildingDash}></Route>
          </Switch>
        </Router>

       
      </main>
    )}
  </Authenticator>

);
}

export default App
//cognito identity id-->  us-east-2:75edd088-e45e-4d8d-a12d-e10c07f70e6b
// aws cognito-idp sign-up --region us-east-2  --client-id 488qq4ulhmqvaish76gsq35b5d --username admin@example.com  --password 1234qwer
// aws cognito-idp admin-confirm-sign-up --region us-east-2 --user-pool-id us-east-2_gXvYmTlCU --username admin@example.com