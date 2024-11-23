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

    /* Function Edit Personal */
    const [Profile, setProfile] = useState({
        user_Name: '',
        user_FirstName: '',
        user_LastName: '',
        email: '',
        passwords: '',
        qualification: '',
        positions: '',
    });

    /* Function Edit Role */
    const [roles, setRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [newRoleName, setNewRoleName] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    /* Function Save Edit Personal */
    const handleSaveEdit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const updateProfile = {
                ...Profile,
                roleId: selectedRoleId,
                newRoleName: newRoleName
            };

            if (!Profile.passwords) {
                delete updateProfile.passwords;
            }

            await axios.put('http://localhost:8081/api/profile', updateProfile, {
                headers: { 'Authorization': `Bearer ${token}`, },
            });

            alert('Profile Updated Successful');
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            setError('Failed to Updated Profile');
            console.error(err);
        }
    };

    useEffect(() => {
        if (!user || (user.role_Name !== 'Course Instructor'
            && user.role_Name !== 'Subject Instructor')) {
            navigate('/');
        } else {
            const fetchProfile = async () => {
                try {
                    const token = localStorage.getItem('token');

                    if (!token) throw new Error('No token found');

                    /* Profile */
                    const profileResponse = await axios.get('http://localhost:8081/api/profile', {
                        headers: { Authorization: `Bearer ${token}`, },
                    });
                    setProfile(profileResponse.data.user);

                    /* Role */
                    const rolesResponse = await axios.get('http://localhost:8081/api/user/roles', {
                        headers: { Authorization: `Bearer ${token}`, },
                    });
                    setRoles(rolesResponse.data.roles);

                    if (rolesResponse.data.roles.length > 0) {
                        setSelectedRoleId(rolesResponse.data.roles[0].role_Id);
                    }
                } catch (err) {
                    setError('Failed to fetch profile');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [user, navigate]);

    const availableRoleNames = ['Admin', 'Course Instructor', 'Subject Instructor'];

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) throw new Error('No token found');

                const response = await axios.get('http://localhost:8081/api/resCourse', {
                    headers: { Authorization: `Bearer ${token}`, },
                    params: { user_Id: user.user_Id }
                });
                setCourses(response.data.courses);
            } catch (error) {
                console.error('Failed to Fetch Course', error);
            }
        };

        if (selectedMenu === 'courses') {
            fetchCourses();
        }
    }, [selectedMenu, user]);

    if (loading) return <p> Loading... </p>;
    if (error) return <p> {error} </p>;

    return (
        <>
            <div className="page-container">

                {/* MENU */}
                <div className="menu-container">
                    <div className="menu-name" onClick={() => setSelectedMenu('')}> MENU USER </div>
                    <button className={`btn-menu ${selectedMenu === 'personal' ? 'active' : ''}`} id="personal-menu-btn" onClick={() => setSelectedMenu('personal')}> ข้อมูลส่วนตัว </button>
                    <button className={`btn-menu ${selectedMenu === 'courses' ? 'active' : ''}`} id="courses-menu-btn" onClick={() => setSelectedMenu('courses')}> วิชาที่สอน </button>
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
                                        name="user_FirstName"
                                        value={Profile.user_FirstName}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Last Name </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Last Name"
                                        name="user_LastName"
                                        value={Profile.user_LastName}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Username </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Username"
                                        name="user_Name"
                                        value={Profile.user_Name}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Password </label>
                                    <input
                                        className="input-form"
                                        type="password"
                                        placeholder="Password"
                                        name="passwords"
                                        value={Profile.passwords}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Email </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Email"
                                        name="email"
                                        value={Profile.email}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Qualification </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Qualification"
                                        name="qualification"
                                        value={Profile.qualification}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Positions </label>
                                    <input
                                        className="input-form"
                                        type="text"
                                        placeholder="Positions"
                                        name="positions"
                                        value={Profile.positions}
                                        onChange={handleProfileChange}
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Role </label>
                                    {roles.length > 0 ? (
                                        roles.map((role, index) => (
                                            <p key={index} className="input-form">
                                                {role.role_Name}
                                            </p>
                                        ))
                                    ) : (<p> No roles available </p>)}

                                    <div className="container-role">
                                        <label className="select-role"> Role </label>
                                        <select
                                            className="select-form"
                                            disabled={!isEditing}
                                            value={selectedRoleId}
                                            onChange={(e) => setSelectedRoleId(e.target.value)}
                                        >
                                            <option value=""> Role </option>
                                            {roles.map((role) => (
                                                <option key={role.role_Id} value={role.role_Id}>
                                                    {role.role_Name}
                                                </option>
                                            ))}
                                        </select>

                                        <label className="select-role"> Update </label>
                                        <select
                                            className="select-form"
                                            disabled={!isEditing}
                                            value={newRoleName}
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                        >
                                            <option value=""> New Role </option>
                                            {availableRoleNames.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {isEditing ? (
                                        <div className="button-container">
                                            <button className="save-edit" onClick={handleSaveEdit}> Save </button>
                                            <button className="cancel-edit" onClick={() => setIsEditing(false)}> Cancel </button>
                                        </div>
                                    ) : (
                                        <button className="click-edit" onClick={() => setIsEditing(true)}> Edit </button>
                                    )}
                                </div>
                            </form>

                        </div>

                    </div>
                )}

                {/* SUBJECT */}
                {selectedMenu === 'courses' && (
                    <div className="from-container-user">

                        <div className="form-description">
                            <div className="title-name"> วิชาที่สอน </div>

                            <table className="course-table">
                                <thead>
                                    <tr>
                                        <th> รหัสวิชา </th>
                                        <th> ชื่อวิชา </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length > 0 ? (courses.map((course) => (
                                        <tr key={course.course_Id}>
                                            <td> {course.course_Code} </td>
                                            <td> {course.course_Name} </td>
                                        </tr>
                                    ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3}> ไม่มีวิชาที่สอน </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}

            </div>
        </>
    )
}

export default EditProfile;