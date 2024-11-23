import React, { useState, useEffect, useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

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

    const [key, setKey] = useState(0);

    const text = "OBE Document Management System for Department of Computer and Information Science";

    useEffect(() => {
        const totalDuration = text.length * 150;

        const timer = setTimeout(() => {
            setKey(prevKey => prevKey + 1);
        }, totalDuration);

        return () => clearTimeout(timer);
    }, [key, text]);

    return (
        <>
            <div className="Header">

                <div className="Header-Main">
                    <p className="Animated-text">
                        {text.split("").map((char, index) => (
                            <span key={`${key}-${index}`} className="Animated-char" style={{ animationDelay: `${index * 0.1}s` }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </p>
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
                                    <button className="dropbtn"> <FontAwesomeIcon icon={faUser} className="icon" /> {user.user_Name} </button>

                                    <div className="dropdown-content">
                                        {user.role_Name === 'Admin' && (
                                            <button className="edit-btn" onClick={handleEditAdminClick}>
                                                <FontAwesomeIcon icon={faEdit} className="icon" /> Edit
                                            </button>
                                        )}
                                        {(user.role_Name === 'Course Instructor' || user.role_Name === 'Subject Instructor') && (
                                            <button className='edit-btn' onClick={handleEditProfileClick}>
                                                <FontAwesomeIcon icon={faEdit} className='icon' /> Edit
                                            </button>
                                        )}
                                        <button className="logout-btn" onClick={handleWhenLogoutClick}>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NavLink to="/Login">
                                <button className="Login-btn">
                                    <FontAwesomeIcon icon={faSignInAlt} className="icon" /> Login
                                </button>
                            </NavLink>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default Menu;