import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    retrieveBuildings
} from "../actions/buildings";
import { userSession } from '../actions/sessionData'
import { saveSelectedBuildingId, loadSelectedBuildingId } from "../actions/userOptions"
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import ListGroup from 'react-bootstrap/ListGroup';

export const Buildings = () => {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [currentBuilding, setCurrentBuilding] = useState(null);


    const buildings = useSelector(state => state.buildings);
    const userOptions = useSelector(state => state.userOptions)
    const sessionData = useSelector(state => state.sessionData)
    const dispatch = useDispatch();



    useEffect(()=>{
        if (Object.keys(sessionData).length !== 0) {//if user session info loaded because the request needs session tokenid
            const idJwtToken = sessionData.idToken.jwtToken
            dispatch(retrieveBuildings(idJwtToken));
            dispatch(loadSelectedBuildingId())
        }
    },[sessionData])
      



    useEffect(() => {
        if (buildings.length > 0) {//if buildings are loaded
            buildings.filter((building, index) => {
                if (building.SK === userOptions.defaultBuildingId) {
                    setActiveBuilding(building, index, false)
                }
            })
        }

    }, [buildings]);

    const setActiveBuilding = (building, index, isChanged) => {//isChanged is true only if we manually change by click
        setCurrentBuilding(building);
        setCurrentIndex(index);
        if (isChanged) dispatch(saveSelectedBuildingId(building.SK))

    };
    return (


        <div className="list-group list-group-horizontal justify-content-center">
       
                
                 <ul className="list-group ">
                 <h4>My Buildings</h4>
                     {buildings &&
                         buildings.map((building, index) => (
                             <a href="#"
                                 className={
                                     "list-group-item list-group-item" + (index === currentIndex ? "-primary" : "")

                                 }
                                 onClick={() => setActiveBuilding(building, index, true)}
                                 key={index}
                             >
                                {building.building_name}
                            </a>
                         ))}
                 </ul>
                 </div>
                
       

    )
}

//us-east-2:1b5c886c-e065-42ea-9207-a6bebc0c2f62  (cognito identity id -when no logged in user)
//aws iot attach-policy --policy-name enercost_sensor_access --target us-east-2:1b5c886c-e065-42ea-9207-a6bebc0c2f62