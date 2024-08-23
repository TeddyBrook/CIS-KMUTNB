import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

/* CSS */
import '../style/EditProfile.css';

/* Component AuthContext */
import AuthContext from "./AuthContext";

import axios from 'axios';

function EditProfile() {

    /* Function Authentication User */
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    /* Function Select Menu */
    const [selectedMenu, setSelectedMenu] = useState('');

    const handleMenuChange = (e) => {
        setSelectedMenu(e.target.value);
    };

    /* Function Edit Personal */
    const [isEdit, setIsEdit] = useState(false);

    /* Function Save Edit Personal */
    const handleSaveEdit = () => {
  
    };

    return (
        <>
            <div className="page-container">

                {/* MENU */}
                <div className="menu-container">
                    <div className="menu-name"> MENU USER </div>
                    <select
                        className="btn-menu-select"
                        value={selectedMenu}
                        onChange={handleMenuChange}
                    >
                        <option> กรุณาเลือกเมนู : </option>
                        <option value="personal"> ข้อมูลส่วนตัว </option>
                    </select>
                </div>

                {/* PERSONAL */}
                {selectedMenu === 'personal' && (
                    <div className="from-container-user">

                        <div className="form-description">
                            <div className="title-name"> ข้อมูลส่วนตัว </div>
                        
                            <form>
                                <div className="description">
                                    <label className="from-name"> First Name </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="First Name"
                                        required
                                    />

                                    <label className="from-name"> Last Name </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Last Name"
                                        required
                                    />

                                    <label className="from-name"> Username </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Username"
                                        required
                                    />

                                    <label className="from-name"> Password </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Password"
                                        required
                                    />

                                    <label className="from-name"> Email </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Email"
                                        required
                                    />

                                    <label className="from-name"> Qualification </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Qualification"
                                        required
                                    />
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button" onClick={handleSaveEdit}> Save </button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}

            </div>
        </>
    )
}

export default EditProfile;