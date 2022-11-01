import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap'
import {
  getBuildingInfo, updateBuildingInfo
} from "../actions/buildings";


export const BuildingInfo = () => {

  const [showUpdModal, setShowUpdModal] = useState(false);
  const [updModalMultType, setUpdModalMultType] = useState("");
  const [updModalMultValue,setUpdModalMultValue] = useState("");

  const userOptions = useSelector(state => state.userOptions)
  const buildingInfo = useSelector(state => state.buildingInfo)
  const sessionData = useSelector(state => state.sessionData)
  const dispatch = useDispatch();


  useEffect(() => {
    if (Object.keys(sessionData).length !== 0) {
      const idJwtToken = sessionData.idToken.jwtToken
      console.log(userOptions.defaultBuildingId)
      dispatch(getBuildingInfo(idJwtToken, userOptions.defaultBuildingId))

    }

  }, [sessionData])

  useEffect(() => {
    if (Object.keys(buildingInfo).length !== 0) {
      console.log(buildingInfo)
    }
  }, [buildingInfo])

  function editContractMultiplier(multiplierType) {
    setShowUpdModal(true)
    switch (multiplierType) {
      case "watt":
        setUpdModalMultType("power")
        break;
      case "cng":
        setUpdModalMultType("cng")
        break;
      case "water":
        setUpdModalMultType("water")
        break;
      default:
        break;
    }
  }

  function updateContractMultiplier(multiplierType,multiplierValue){
    const idJwtToken = sessionData.idToken.jwtToken
    console.log(idJwtToken)
    dispatch(updateBuildingInfo(idJwtToken, userOptions.defaultBuildingId,multiplierType,multiplierValue))
    console.log(multiplierType)
    console.log(multiplierValue)

  }
  return (

    <div className="container-xl px-4 mt-4">
      <div className="row">
        <div className="col-xl-12">
          <div className="card mb-4 ">
            <div className="card-header">
              <h4 >Building Details</h4>
            </div>
            <div className="card-body">
              <form>
                {/* Form Row*/}
                <label className="small mb-1">Address:</label>
                <div >{buildingInfo.building_address}</div>
                {/* Form Group (email address)*/}
                <div className="row gx-4 mb-1">
                  <div className="col-md-4">
                    <label className="small mb-1" >Power index:</label>
                    <div >{buildingInfo.indices.watt}</div>
                    <Button ><i className="bi bi-pen-fill" onClick={() =>editContractMultiplier("watt")}> Edit</i></Button>
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1" >Cng index:</label>
                    <div >{buildingInfo.indices.cng}</div>
                    <Button ><i className="bi bi-pen-fill" onClick={() =>editContractMultiplier("cng")}> Edit</i></Button>
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1" >Water index:</label>
                    <div >{buildingInfo.indices.water}</div>
                    <Button ><i className="bi bi-pen-fill" onClick={() =>editContractMultiplier("water")}> Edit</i></Button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div >

      <Modal show={showUpdModal} onHide={() => setShowUpdModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change {updModalMultType} multiplier value</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
              <label htmlFor="multiplier">Multiplier</label>
              <input type="number" step="0.01" id="multiplier" onChange={e=>{setUpdModalMultValue(e.target.value)}}/>         
              <button className="btn btn-primary" type="submit" onClick={()=>{
                updateContractMultiplier(updModalMultType,updModalMultValue); setShowUpdModal(false)}}>
                Update
              </button>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdModal(false)}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
    </div>

  )
}