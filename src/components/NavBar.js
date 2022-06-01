import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { BuildingInfo } from './BuildingInfo'
import { Buildings } from './Buildings'
import { useDispatch, useSelector } from "react-redux";

import 'bootstrap/dist/css/bootstrap.css'
import { Nav, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './styles/NavBar.css'
import logo from './assets/logo.png'
export const NavBar = () => {
    const userOptions = useSelector(state => state.userOptions)
    const [selectedBuildingId,setSelectedBuildingId] = useState('')
    useEffect(()=>{
     setSelectedBuildingId(userOptions.defaultBuildingId)
    },[userOptions])
    return (

        <Navbar bg="navbackground" variant="dark" expand="lg">
            <Navbar.Brand>
                <img src={logo} />{' '}Enercost
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
                    <LinkContainer to="/userInfo">
                        <Nav.Link>UserInfo</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/buildingInfo">
                        <Nav.Link>Building {selectedBuildingId} Info</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>




        </Navbar>


        // <div className='sum'>   
        // <div className='logo'>
        //         Enercost
        //     </div>        
        //     <nav className='navbar'>
        //         <ul>
        //             <div className='navbar-items-left'>
        //             <li>
        //                 <Link to='/'>Home</Link>
        //             </li>
        //             <li>
        //                 <Link to='/buildings'>BUILDINGS</Link>
        //             </li>
        //             <li>
        //                 <Link to='/buildingCharts'>CHARTS</Link>
        //             </li>
        //             <li>
        //                 <Link to='/buildingDashboard'>DASHBAORD</Link>
        //             </li>
        //             </div>

        //             <div className='navbar-items-right'>
        //                 <li>
        //                     <Link to='/userInfo'>USERINFO</Link>
        //                 </li>
        //                 <li>
        //                     <Link to='/buildingInfo'>BUILDING-INFO</Link>
        //                 </li>

        //             </div>

        //         </ul>
        //     </nav>
        // </div>
    )
}
