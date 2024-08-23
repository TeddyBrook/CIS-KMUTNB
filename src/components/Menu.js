import React, { useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

/* img */
import CIS from '../img/CIS.png';

/* CSS */
import '../style/Menu.css';

/* Component AuthContext */
import AuthContext from './AuthContext';

function Menu() {

    const { user, logout, isAdmin } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleEditProfileClick = () => {
        navigate('EditProfile');
    };

    const handleEditAdminClick = () => {
        navigate('EditAdmin');
    };

    const handleFillOutDocumentClick = (path) => {
        if (user) {
            navigate(path);
        } else {
            alert('Please Login First');
            setTimeout(() => {
                navigate('Login');
            }, 0);
        }
    };

    const handleWhenLogoutClick = () => {
        logout();
        navigate('/');
    }

    const handleUserActionChange = (event) => {
        const selectedAction = event.target.value;

        switch (selectedAction) {
            case 'editProfile':
                handleEditProfileClick();
                break;
            case 'editAdmin':
                handleEditAdminClick();
                break;
            case 'logout':
                handleWhenLogoutClick();
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div className="Header">

                <div className="Header-Main">
                    <p> OBE Document Management System for Department of Computer and Information Science </p>
                </div>

                <div className="Container">
                    <img src={CIS} alt="CIS.png" className="CIS" width="150" />

                    <div className="MenuBar">
                        <ul className="Menu">
                            <li className="Menu-Link">
                                <NavLink to="/"> หน้าแรก </NavLink>
                            </li>

                            <li className="Menu-Link">
                                <NavDropdown title="View Document">
                                    <LinkContainer to="/View_obe3">
                                        <NavDropdown.Item> Outcome-Based Education 3 </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/View_obe5">
                                        <NavDropdown.Item > Outcome-Based Education 5 </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/View_obe7">
                                        <NavDropdown.Item> Outcome-Based Education 7 </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            </li>

                            <li className="Menu-Link">
                                <NavDropdown title="Fill Out Document">
                                    <LinkContainer to="/Fill_obe3">
                                        <NavDropdown.Item onClick={() => handleFillOutDocumentClick('Fill_obe3')}> Outcome-Based Education 3 </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/Fill_obe5">
                                        <NavDropdown.Item onClick={() => handleFillOutDocumentClick('Fill_obe5')}> Outcome-Based Education 5 </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/Fill_obe7">
                                        <NavDropdown.Item onClick={() => handleFillOutDocumentClick('Fill_obe7')}> Outcome-Based Education 7 </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            </li>
                        </ul>
                    </div>

                    <div className="Menu-Log">
                        {user ? (
                            <>
                                <div className="dropdown">
                                    <button className="dropbtn"> {user.user_Name} </button>
                                    <div className="dropdown-content">
                                        <button className="edit-btn" onClick={handleEditProfileClick}> Edit Profile </button>
                                        {user.role_Name === 'Admin' && (
                                            <button className="edit-btn" onClick={handleEditAdminClick}> Edit Admin </button>
                                        )}
                                        <button className="logout-btn" onClick={handleWhenLogoutClick}> Logout </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NavLink to="/Login">
                                <button className="Login-btn" type="button"> เข้าสู่ระบบ </button>
                            </NavLink>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default Menu;