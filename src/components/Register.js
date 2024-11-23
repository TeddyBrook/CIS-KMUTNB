import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* CSS */
import '../style/Register.css';

function Register() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        user_FirstName: '',
        user_LastName: '',
        user_Name: '',
        passwords: '',
        email: '',
        qualification: '',
        positions: '',
    })

    const [roles, setRoles] = useState([
        { role_Name: 'Course Instructor', checked: false },
        { role_Name: 'Subject Instructor', checked: false },
        { role_Name: 'Admin', checked: false }
    ]);

    const [selectedRoles, setSelectedRoles] = useState([]);

    const handleRoleChange = (e) => {
        const { checked, name } = e.target;

        if (checked) {
            setSelectedRoles(prevSelectedRoles => [...prevSelectedRoles, name]);
        } else {
            setSelectedRoles(prevSelectedRoles => prevSelectedRoles.filter(role => role !== name));
        }

        setRoles(prevRoles => {
            return prevRoles.map(role => {
                if (role.role_Name === name) {
                    return { ...role, checked: checked };
                }
                return role;
            });
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const roleIds = [];

            for (const roleName of selectedRoles) {
                const response = await fetch('http://localhost:8081/api/role', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ role_Name: roleName }),
                });

                const data = await response.json();
                roleIds.push(data.insertedRoleIds);
            }

            const userData = {
                user_FirstName: inputs.user_FirstName,
                user_LastName: inputs.user_LastName,
                user_Name: inputs.user_Name,
                passwords: inputs.passwords,
                email: inputs.email,
                qualification: inputs.qualification,
                positions: inputs.positions,
                role_Id: roleIds,
            };

            const response = await fetch('http://localhost:8081/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to Register User');
            }

            console.log('Saving Data User Successful');
            navigate('/LoginUser');
        } catch (error) {
            console.error('Registration failed', error.message);
        }
    };

    /* Function Resize Input */
    const [description1, setDescription1] = useState('');

    const handleResize = (event, setDescription) => {
        setDescription(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
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
                            autoComplete='given-name'
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
                            autoComplete='family-name'
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
                            autoComplete="username"
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
                            autoComplete="current-password"
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
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-container">
                        <label> Qualification </label>
                        <textarea
                            className="input-qualification"
                            name="qualification"
                            type="text"
                            placeholder="Qualification"
                            value={inputs.qualification || ""}
                            onChange={handleInputChange}
                            required
                            autoComplete="organization-title"
                            onInput={(event) => handleResize(event, setDescription1)}
                        />
                    </div>

                    <div className="input-container">
                        <label> Positions </label>
                        <input
                            className="input-register"
                            name="positions"
                            type="text"
                            placeholder="ตำแหน่งวิชาการ"
                            value={inputs.positions || ""}
                            onChange={handleInputChange}
                            required
                            autoComplete="organization"
                        />
                    </div>

                    <div className="position-head">
                        {roles.map((role, index) => (
                            <div className="position-contain" key={index}>
                                <input
                                    className="position-form"
                                    name={`${role.role_Name}`}
                                    type="checkbox"
                                    checked={role.checked}
                                    onChange={handleRoleChange}
                                />
                                <label className="position-name">{role.role_Name}</label>
                            </div>
                        ))}
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