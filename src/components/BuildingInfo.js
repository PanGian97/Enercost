import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getBuildingInfo
} from "../actions/buildings";

export const BuildingInfo = () => {
    const userOptions = useSelector(state => state.userOptions)
    const buildingInfo = useSelector(state => state.buildingInfo)
    const sessionData = useSelector(state => state.sessionData)
    const dispatch = useDispatch();


    useEffect(() => {
        if (Object.keys(sessionData).length !== 0) {
            const idJwtToken = sessionData.idToken.jwtToken
            dispatch(getBuildingInfo(idJwtToken,userOptions.defaultBuildingId))
        }
    }, [sessionData])

    useEffect(() => {
        if (Object.keys(buildingInfo).length !== 0) {
            console.log(buildingInfo)
        }
    }, [buildingInfo])


    return (
        <></>
    )
}