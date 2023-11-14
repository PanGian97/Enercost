import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BuildingInfo } from './BuildingInfo'
import { Buildings } from './Buildings'
import { useDispatch, useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.css'
import { Nav, Navbar, } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './styles/NavBar.css'
import logo from './assets/logo.png'
import { Auth } from 'aws-amplify';
export const NavBar = () => {
    const userOptions = useSelector(state => state.userOptions)
    const [selectedBuildingId, setSelectedBuildingId] = useState('')
    useEffect(() => {
        setSelectedBuildingId(userOptions.defaultBuildingId)
    }, [userOptions])

    function signUserOut() {
        Auth.signOut()
    }
    return (

        <Navbar bg="navbackground" variant="dark" expand="lg">
            <Navbar.Brand>
                <img src={logo} style={{ width: '6vw', height: 'auto', backgroundColor: 'white' }}/>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav className='me-auto'>
                    <LinkContainer to="/buildings">
                        <Nav.Link>Buildings</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/buildingCharts">
                        <Nav.Link>Charts</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/buildingDashboard">
                        <Nav.Link>Dashbaord</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav>
                  <button className="signout-btn"onClick={()=>signUserOut()}><i className="bi bi-power"></i></button>
                    <LinkContainer to="/userInfo">
                        <Nav.Link>UserInfo</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/buildingInfo">
                        <Nav.Link>Building {selectedBuildingId} Info</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>




        </Navbar>

    )
}
