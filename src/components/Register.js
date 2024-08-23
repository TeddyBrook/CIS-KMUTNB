import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* CSS */
import '../style/Register.css';

import axios from 'axios';

function Register() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        user_FirstName: '',
        user_LastName: '',
        user_Name: '',
        passwords: '',
        email: '',
        qualification: '',
        role_Name: [],
    })

    const handleChange = (e) => {
        const { checked, name } = e.target;

        setInputs((prevInputs) => {
            const updatedRoles = checked
                ? [...prevInputs.role_Name, name]
                : prevInputs.role_Name.filter((role) => role !== name);

            return {
                ...prevInputs,
                role_Name: updatedRoles,
            };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            /* 1. Create User */
            const userResponse = await axios.post('http://localhost:8081/api/register', {
                user_FirstName: inputs.user_FirstName,
                user_LastName: inputs.user_LastName,
                user_Name: inputs.user_Name,
                passwords: inputs.passwords,
                email: inputs.email,
                qualification: inputs.qualification,
                role_Name: inputs.role_Name,
            });

            /* 2. Pull user_Id จากการสร้างผู้ใช้ */
            const user_Id = userResponse.data.user_Id;

            /* 3. Create Role */
            if (inputs.role_Name.length > 0) {
                await axios.post('http://localhost:8081/api/role', {
                    role_Name: inputs.role_Name,
                    user_Id,
                });
            }

            /* 4. Update role_Id ของผู้ใช้ */
            await axios.put(`http://localhost:8081/api/update-user-role/${user_Id}`, {
                role_Name: inputs.role_Name,
            });

            setInputs({
                user_FirstName: '',
                user_LastName: '',
                user_Name: '',
                passwords: '',
                email: '',
                qualification: '',
                role_Name: [],
            });
            navigate('LoginUser');
            console.log(userResponse.data);
        } catch (error) {
            console.error('Registration Failed !', error);
        }
    };

    const renderForm = (
        <>
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="input-container">
                        <label> First Name </label>
                        <input
                            className="input-register"
                            name="user_FirstName"
                            type="text"
                            id="firstName"
                            placeholder="First Name"
                            value={inputs.user_FirstName || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label> Last Name </label>
                        <input
                            className="input-register"
                            name="user_LastName"
                            type="text"
                            id="lastName"
                            placeholder="Last Name"
                            value={inputs.user_LastName || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label> Username </label>
                        <input
                            className="input-register"
                            name="user_Name"
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={inputs.user_Name || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label> Password </label>
                        <input
                            className="input-register"
                            name="passwords"
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={inputs.passwords || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label> Email </label>
                        <input
                            className="input-register"
                            name="email"
                            type="text"
                            id="email"
                            placeholder="Email"
                            value={inputs.email || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label> Qualification </label>
                        <input
                            className="input-register"
                            name="qualification"
                            type="text"
                            id="email"
                            placeholder="Qualification"
                            value={inputs.qualification || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="position-head">
                        <div className="position-contain">
                            <input
                                className="position-form"
                                name="Course Instructor"
                                type="checkbox"
                                id="pcourse"
                                checked={inputs.role_Name.includes('Course Instructor')}
                                value={inputs.role_Name || ""}
                                onChange={handleChange}
                            />
                            <label className="position-name"> Course Instructor </label>
                        </div>

                        <div className="position-contain">
                            <input
                                className="position-form"
                                name="Subject Instructor"
                                type="checkbox"
                                id="psubject"
                                value={inputs.role_Name || ""}
                                checked={inputs.role_Name.includes('Subject Instructor')}
                                onChange={handleChange}
                            />
                            <label className="position-name"> Subject Instructor </label>
                        </div>

                        <div className="position-contain">
                            <input
                                className="position-form"
                                name='Admin'
                                type='checkbox'
                                id='admin'
                                value={inputs.role_Name || ""}
                                checked={inputs.role_Name.includes('Admin')}
                                onChange={handleChange}
                            />
                            <label className="position-name"> Admin </label>
                        </div>
                    </div>

                    <div className="button-container">
                        <input type="submit" />
                    </div>

                    <div className="login-link">
                        <a href="/Login"> Already have an Account? Login </a>
                    </div>

                </form>
            </div>
        </>
    );

    return (
        <>
            <div className="bar-regis">

                <div className="name-regis">
                    <div className="form-regis">
                        <div className="title-regis"> REGISTER </div>
                        {renderForm}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Register;