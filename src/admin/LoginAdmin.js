import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

/* CSS */
import '../style/LoginAdmin.css';

/* Component AuthContext */
import AuthContext from "../components/AuthContext";

function LoginAdmin() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        user_Name: '',
        passwords: '',
    })

    const { setAuth } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8081/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(inputs),
            });

            if (response.ok) {
                const { message, user, token } = await response.json();
                console.log(message);
                console.log(user);

                if (user && user.role_Name === 'Admin') {
                    localStorage.setItem('token', token);
                    setAuth(user, token);
                    setInputs({ user_Name: '', passwords: '' });
                    navigate('/')
                } else {
                    console.error('Only Admins are Allowed to Login Here');
                }
            } else {
                console.error('Invalid Response from Server');
                alert('Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.error("Error During Login:", error);
        }
    };

    const renderForm = (
        <>
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="input-container-admin">
                        <label> Username </label>
                        <input
                            className="input-admin"
                            name="user_Name"
                            type="text"
                            placeholder="Username"
                            value={inputs.user_Name}
                            onChange={(e) => setInputs(prevInputs => ({ ...prevInputs, user_Name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label> Password </label>
                        <input
                            className="input-admin"
                            name="passwords"
                            type="password"
                            placeholder="Password"
                            value={inputs.passwords}
                            onChange={(e) => setInputs(prevInputs => ({ ...prevInputs, passwords: e.target.value }))}
                            required
                            autocomplete="current-password"
                        />
                    </div>

                    <div className="button-container-admin">
                        <input type="submit" />
                    </div>

                </form>
            </div>
        </>
    );

    return (
        <>
            <div className="bar-login-admin">

                <div className="name-login-admin">
                    <div className="form-login-admin">
                        <div className="title-login-admin"> ADMIN LOGIN </div>
                        {renderForm}
                    </div>

                    <button className="type-admin" type="button">
                        <a href="/Login"> USER </a>
                    </button>
                </div>

            </div>
        </>
    )
}

export default LoginAdmin;