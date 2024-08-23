import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

/* CSS */
import '../style/LoginUser.css';

/* Component AuthContext */
import AuthContext from "./AuthContext";

function LoginUser() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        user_Name: '',
        passwords: ''
    })

    const { setAuth } = useContext(AuthContext);

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

                if (user && user.role_Name === 'Course Instructor' || user.role_Name === 'Subject Instructor') {
                    setAuth(user, token);
                    setInputs({ user_Name: '', passwords: '', });
                    navigate('/')
                } else {
                    console.error('Only Non-Admin Users are Allowed to Login Here');
                }
            } else {
                const errorResponse = await response.json();
                console.error("Error:", errorResponse.message);
                alert("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error During Login:", error);
        }
    };

    const renderForm = (
        <>
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="input-container-user">
                        <label> Username </label>
                        <input
                            className="input-user"
                            name="user_Name"
                            type="text"
                            placeholder="Username"
                            value={inputs.user_Name}
                            onChange={(e) => setInputs(prevInputs => ({ ...prevInputs, user_Name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="input-container-user">
                        <label> Password </label>
                        <input
                            className="input-user"
                            name="passwords"
                            type="password"
                            placeholder="Password"
                            value={inputs.passwords}
                            onChange={(e) => setInputs(prevInputs => ({ ...prevInputs, passwords: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="button-container-user">
                        <input type="submit" />
                    </div>

                    <div className="regis-link">
                        <a href="/Register"> Register </a>
                    </div>

                </form>
            </div>
        </>
    );

    return (
        <>
            <div className="bar-login-user">

                <div className="name-login-user">
                    <div className="form-login-user">
                        <div className="title-login-user"> LOG IN </div>
                        {renderForm}
                    </div>

                    <button className="type-user" type="button">
                        <a href="/LoginAdmin"> ADMIN </a>
                    </button>
                </div>

            </div>
        </>
    )
}

export default LoginUser;