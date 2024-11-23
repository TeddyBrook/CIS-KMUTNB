import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

/* CSS */
import '../style/EditAdmin.css';

/* Component AuthContext */
import AuthContext from "../components/AuthContext";

import axios from 'axios';

function EditAdmin() {

    /* Function Authentication User */
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    /* Function Select Menu */
    const [selectedMenu, setSelectedMenu] = useState('');

    /* PROFILE */
    const [Profile, setProfile] = useState({
        user_Name: '',
        user_FirstName: '',
        user_LastName: '',
        email: '',
        passwords: '',
        qualification: '',
        positions: '',
        role_Name: '',
    });

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
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            alert('Profile Updated Successful');
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            setError('Failed to Updated Profile');
            console.error(err);
        }
    };

    /* SUBJECT */
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const handleSelectedChange = (e) => {

        const courseId = e.target.value;
        setSelectedCourseId(courseId);

        const selectedCourse = courses.find(course => course.course_Id.toString() === courseId);

        if (selectedCourse) {

            setFormSubject({
                course_Id: courseId,
                course_Code: selectedCourse.course_Code || '',
                course_Name: selectedCourse.course_Name || '',
                course_NameEng: selectedCourse.course_NameEng || '',
                course_Credit: selectedCourse.course_Credit || '',
                course_Description: selectedCourse.course_Description || '',
                course_DescriptionEng: selectedCourse.course_DescriptionEng || '',
                course_Category: selectedCourse.course_Category || '',
                responsible_Teacher: selectedCourse.responsible_Teacher || '',
                prerequisites: selectedCourse.prerequisites || '',
                corequisites: selectedCourse.corequisites || '',
                semster_term: selectedCourse.semster_term || '',
                year_of_study: selectedCourse.year_of_study || '',
                study_Area: selectedCourse.study_Area || '',
                curriculum_Name: selectedCourse.curriculum_Name || '',
                curriculum_Id: selectedCourse.curriculum_Id || '',
                college: selectedCourse.college || '',
                campus: selectedCourse.campus || '',
                faculty: selectedCourse.faculty || '',
                department_Name: selectedCourse.department_Name || '',
                branch: selectedCourse.branch || '',
            });
        } else {
            console.warn('Course Not Found:', courseId);
            setFormSubject({
                course_Code: '',
                course_Name: '',
                course_NameEng: '',
                course_Credit: '',
                course_Description: '',
                course_DescriptionEng: '',
                course_Category: '',
                responsible_Teacher: '',
                prerequisites: '',
                corequisites: '',
                semster_term: '',
                year_of_study: '',
                study_Area: '',
                curriculum_Id: '',
                curriculum_Name: '',
                college: '',
                campus: '',
                faculty: '',
                department_Name: '',
                branch: '',
            });
        }
    };

    useEffect(() => {
        axios.get('http://localhost:8081/api/course')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the courses!", error);
            });
    }, []);

    useEffect(() => {
        console.log('Selected Course ID:', selectedCourseId);
    }, [selectedCourseId]);

    const [formSubject, setFormSubject] = useState({
        course_Id: '',
        curriculum_Id: '',
        course_Code: '',
        course_Name: '',
        course_NameEng: '',
        course_Credit: '',
        course_Description: '',
        course_DescriptionEng: '',
        course_Category: '',
        responsible_Teacher: '',
        prerequisites: '',
        corequisites: '',
        semster_term: '',
        year_of_study: '',
        study_Area: '',
        curriculum_Name: '',
        college: '',
        campus: '',
        faculty: '',
        department_Name: '',
        branch: '',
    });

    const handleSubjectChange = (e) => {
        const { name, value } = e.target;
        setFormSubject((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [courseInstructor, setInstructor] = useState([{ course_Instructor: '', }]);
    const [responTeacher, setresponTeacher] = useState([{ responsible_Teacher: '', }]);
    const [instructorsList, setInstructorsList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/api/instructors')
            .then(response => {
                setInstructorsList(response.data.instructors);
            })
            .catch(error => {
                console.error('Error Fetching Instructors:', error);
            });
    }, []);

    const handleInstructorChange = (e, index) => {
        const { value } = e.target;
        setInstructor(prevState => {
            const updatedInstructors = [...prevState];
            updatedInstructors[index] = { ...updatedInstructors[index], course_Instructor: value };
            return updatedInstructors;
        });
    }

    const handleAddInstructor = (e) => {
        e.preventDefault();
        setInstructor([...courseInstructor, { course_Instructor: '' }]);
    };

    const handleDeleteInstructor = (index) => {
        const instructors = courseInstructor.filter((_, i) => i !== index);
        setInstructor(instructors);
    };

    const handleResponsible = (e, index) => {
        const selectedFullName = e.target.value;
        setresponTeacher(prevState => {
            const updatedResponsibles = [...prevState];
            updatedResponsibles[index] = { ...updatedResponsibles[index], responsible_Teacher: selectedFullName };
            return updatedResponsibles;
        });
    };

    const handleSubjectSave = async () => {
        try {
            const curriculumData = {
                curriculum_Name: formSubject.curriculum_Name,
                branch: formSubject.branch,
                college: formSubject.college,
                campus: formSubject.campus,
                faculty: formSubject.faculty,
                department_Name: formSubject.department_Name,
            };

            const curriculumResponse = await axios.post('http://localhost:8081/api/curriculum', curriculumData);

            if (!curriculumResponse.data.success) {
                console.log('Failed to Save Curriculum');
                return null;
            }

            const newCurriculumId = curriculumResponse.data.newCurriculumId;
            const selectedResponsibleTeacher = responTeacher[0]?.responsible_Teacher;

            const subjectData = {
                course_Code: formSubject.course_Code,
                course_Name: formSubject.course_Name,
                course_NameEng: formSubject.course_NameEng,
                course_Credit: formSubject.course_Credit,
                course_Description: formSubject.course_Description,
                course_DescriptionEng: formSubject.course_DescriptionEng,
                course_Category: formSubject.course_Category,
                semster_term: formSubject.semster_term,
                year_of_study: formSubject.year_of_study,
                responsible_Teacher: selectedResponsibleTeacher,
                prerequisites: formSubject.prerequisites,
                corequisites: formSubject.corequisites,
                study_Area: formSubject.study_Area,
                curriculum_Id: newCurriculumId,
            };

            const subjectResponse = await axios.post('http://localhost:8081/api/subject', subjectData);

            if (!subjectResponse.data.success) {
                console.log('Failed to Save Subject:', subjectResponse.data.message);
                return null;
            }

            const course_Id = subjectResponse.data.course_Id;

            const updateCurriculumInCourseData = {
                curriculum_Id: newCurriculumId,
            };

            const updateCurriculumInCourseResponse = await axios.put('http://localhost:8081/api/updatecurriculumId', updateCurriculumInCourseData);

            if (updateCurriculumInCourseResponse.data.success) {
                console.log('Subject Saved Successful');
                console.log('course_Id:', course_Id);
                return course_Id;
            } else {
                console.log('Failed to Save Subject');
                alert('Failed to Update Curriculum in Course');
                return null;
            }
        } catch (error) {
            console.error('Failed to Send Request', error);
            alert('Failed to Send Request. Please Check the Console for Details.');
            return null;
        }
    };

    const handleSaveUserCourse = async (course_Id) => {
        try {
            const UserCourse = courseInstructor.map((ins, index) => {
                const instruc = {
                    user_Id: ins.course_Instructor,
                    course_Id: course_Id,
                }
                console.log(`Sending Data for User Course Data Index ${index}:`, instruc);
                return axios.post('http://localhost:8081/api/updateUserCourse', instruc);
            });

            const responses = await Promise.all(UserCourse);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for User Course Data ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for User Course ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data', error);
        }
    }

    const handleSaveCourse = async (e) => {
        e.preventDefault();

        try {
            const course_Id = await handleSubjectSave();

            if (course_Id) {
                console.log('Successful Saved Subject:', course_Id);
                await handleSaveUserCourse(course_Id);
            } else {
                console.error('Error Saving Data All');
            }
            alert('Save New Subject Successful');
        } catch (error) {
            console.error('Error Handling Save Course', error);
        }
    };

    const handleEditCourse = async (e) => {
        e.preventDefault();

        try {
            const updateCurriculum = axios.put('http://localhost:8081/api/updatecurriculum', {
                curriculum_Id: formSubject.curriculum_Id,
                curriculum_Name: formSubject.curriculum_Name,
                branch: formSubject.branch,
                college: formSubject.college,
                campus: formSubject.campus,
                faculty: formSubject.faculty,
                department_Name: formSubject.department_Name
            });

            const updateSubject = axios.put('http://localhost:8081/api/updateSubject', {
                course_Id: formSubject.course_Id,
                course_Code: formSubject.course_Code,
                course_Name: formSubject.course_Name,
                course_NameEng: formSubject.course_NameEng,
                course_Credit: Number(formSubject.course_Credit),
                course_Description: formSubject.course_Description,
                course_DescriptionEng: formSubject.course_DescriptionEng,
                course_Category: formSubject.course_Category,
                semster_term: formSubject.semster_term,
                year_of_study: formSubject.year_of_study,
                responsible_Teacher: formSubject.responsible_Teacher,
                prerequisites: formSubject.prerequisites,
                corequisites: formSubject.corequisites,
                study_Area: formSubject.study_Area,
                curriculum_Id: formSubject.curriculum_Id
            });

            const updateInstructors = courseInstructor.length > 0 ? axios.put('http://localhost:8081/api/updateCourseInstructors', {
                course_Id: formSubject.course_Id,
                instructors: courseInstructor.map(instructor => instructor.course_Instructor)
            }) : Promise.resolve();

            await Promise.all([updateCurriculum, updateSubject, updateInstructors]);
            alert('All Updates Successful');
        } catch (error) {
            console.error('Error Updating All Data:', error.response ? error.response.data : error.message);
            alert('Failed to Update All Data');
        }
    };

    /* ELOs */
    const [formElos, setFormElos] = useState({
        elo_code: '',
        elo_Name: '',
        elo_description: '',
        years_elo: '',
    });

    const handleELOsChange = (e) => {
        const { name, value } = e.target;
        setFormElos((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    const handleELOsSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/api/elo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(formElos),
            });

            if (response.status === 200) {
                console.log('ELOs Saved Successful');
                alert('ELOs Saved Successful');
            } else if (response.status === 401) {
                console.error('Unauthorized: User not Authenticated');
                alert('Unauthorized: User not Authenticated');
            } else {
                const responseData = await response.json();
                console.error('Failed to Save ELO:', responseData.message);
                alert('Failed to Save ELO');
            }
        } catch (error) {
            console.error('Error Saving ELO:', error.message);
            alert('Error Saving ELO');
        }
    };

    /* BASIC CLOs */
    const [basicformClo, setBasicFormClo] = useState({
        clo_basic_Name: '',
        basicClo_year: '',
    })

    const handleBasicCLOsChange = (e) => {
        const { name, value } = e.target;
        setBasicFormClo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBasicCLOsSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/api/basicCLO', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(basicformClo),
            });

            if (response.status === 200) {
                console.log('Basic CLO Saved Successful');
                alert('Basic CLO Saved Successful');
            } else if (response.status === 401) {
                console.error('Unauthorized: User not authenticated');
                alert('Unauthorized: User not authenticated');
            } else {
                const responseData = await response.json();
                console.error('Failed to Save Basic CLO:', responseData.message);
                alert('Failed to Save Basic CLO');
            }
        } catch (error) {
            console.error('Error Saving Basic CLO:', error.message);
            alert('Error Saving Basic CLO');
        }
    };

    const [roles, setRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        if (!user || user.role_Name !== 'Admin') {
            navigate('/');
        } else {
            const fetchProfile = async () => {
                try {
                    const token = localStorage.getItem('token');

                    if (!token) throw new Error('No token Found');

                    const profileResponse = await axios.get('http://localhost:8081/api/profile', {
                        headers: { Authorization: `Bearer ${token}`, },
                    });
                    setProfile(profileResponse.data.user);

                    const rolesResponse = await axios.get('http://localhost:8081/api/user/roles', {
                        headers: { Authorization: `Bearer ${token}`, },
                    });
                    setRoles(rolesResponse.data.roles);

                    if (rolesResponse.data.roles.length > 0) {
                        setSelectedRoleId(rolesResponse.data.roles[0].role_Id);
                    }
                } catch (err) {
                    setError('Failed to fetch Profile');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [user, navigate]);

    const availableRoleNames = ['Admin', 'Course Instructor', 'Subject Instructor'];

    /* Function Resize Input */
    const [description1, setDescription1] = useState('');
    const [description2, setDescription2] = useState('');
    const [description3, setDescription3] = useState('');
    const [description4, setDescription4] = useState('');

    const handleResize = (event, setDescription) => {
        setDescription(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    if (loading) return <p> Loading... </p>;
    if (error) return <p> {error} </p>;

    return (
        <>
            <div className="page-container">

                {/* MENU */}
                <div className="menu-container">
                    <div className="menu-name" onClick={() => setSelectedMenu('')}> MENU ADMIN </div>
                    <button className={`btn-menu ${selectedMenu === 'personal' ? 'active' : ''}`} id="personal-menu-btn" onClick={() => setSelectedMenu('personal')}> ข้อมูลส่วนตัว </button>
                    <button className={`btn-menu ${selectedMenu === 'subject' ? 'active' : ''}`} id="subject-menu-btn" onClick={() => setSelectedMenu('subject')}> รายวิชา </button>
                    <button className={`btn-menu ${selectedMenu === 'elo' ? 'active' : ''}`} id="elo-menu-btn" onClick={() => setSelectedMenu('elo')}> Expected Learning Outcome </button>
                    <button className={`btn-menu ${selectedMenu === 'basic' ? 'active' : ''}`} id="basic-menu-btn" onClick={() => setSelectedMenu('basic')}> คุณลักษณะพื้นฐาน </button>
                </div>

                {/* PROFILE */}
                {selectedMenu === 'personal' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> ข้อมูลส่วนตัว </div>

                            <form>
                                <div className="description">
                                    <label className="from-name"> First Name </label>
                                    <input
                                        className="input-form"
                                        name="user_FirstName"
                                        type="text"
                                        value={Profile.user_FirstName}
                                        onChange={handleProfileChange}
                                        placeholder="First Name"
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Last Name </label>
                                    <input
                                        className="input-form"
                                        name="user_LastName"
                                        type="text"
                                        value={Profile.user_LastName}
                                        onChange={handleProfileChange}
                                        placeholder="Last Name"
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Username </label>
                                    <input
                                        className="input-form"
                                        name="user_Name"
                                        type="text"
                                        value={Profile.user_Name}
                                        onChange={handleProfileChange}
                                        placeholder="Username"
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Password </label>
                                    <input
                                        className="input-form"
                                        name="passwords"
                                        type="password"
                                        value={Profile.passwords}
                                        onChange={handleProfileChange}
                                        placeholder="Password"
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Email </label>
                                    <input
                                        className="input-form"
                                        name="email"
                                        type="text"
                                        value={Profile.email}
                                        onChange={handleProfileChange}
                                        placeholder="Email"
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Qualification </label>
                                    <input
                                        className="input-form"
                                        name="qualification"
                                        type="text"
                                        value={Profile.qualification}
                                        onChange={handleProfileChange}
                                        placeholder="Qualification"
                                        disabled={!isEditing}
                                        required
                                    />

                                    <label className="from-name"> Positions </label>
                                    <input
                                        className="input-form"
                                        name="positions"
                                        type="text"
                                        value={Profile.positions}
                                        onChange={handleProfileChange}
                                        placeholder="Position"
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
                                    ) : (
                                        <p> No roles available </p>
                                    )}

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
                {selectedMenu === 'subject' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> SUBJECT </div>

                            <form onSubmit={handleSubjectSave}>
                                <label className="from-name"> เลือกวิชา </label>
                                <select className="selected-course" onChange={handleSelectedChange} value={selectedCourseId}>
                                    <option value=""> เลือกวิชา </option>
                                    {courses.map(c => (
                                        <option key={c.course_Id} value={c.course_Id.toString()}>
                                            {c.course_Code} {c.course_Name}
                                        </option>
                                    ))}
                                </select>

                                <div className="description">
                                    <label className="from-name"> รหัสวิชา </label>
                                    <input
                                        className="input-form"
                                        name="course_Code"
                                        type="text"
                                        value={formSubject.course_Code || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="XXXXXXXXX"
                                        required
                                    />

                                    <label className="from-name"> ชื่อวิชาภาษาไทย </label>
                                    <input
                                        className="input-form"
                                        name="course_Name"
                                        type="text"
                                        value={formSubject.course_Name || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อวิชาภาษาไทย"
                                        required
                                    />

                                    <label className="from-name"> ชื่อวิชาภาษาอังกฤษ </label>
                                    <input
                                        className="input-form"
                                        name="course_NameEng"
                                        type="text"
                                        value={formSubject.course_NameEng || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อวิชาภาษาอังกฤษ"
                                        required
                                    />

                                    <label className="from-name"> จำนวนหน่วยกิต </label>
                                    <input
                                        className="input-form"
                                        name="course_Credit"
                                        type="number"
                                        min={1} max={3}
                                        value={formSubject.course_Credit || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="จำนวนหน่วยกิต"
                                        required
                                    />

                                    <label className="from-name"> คำอธิบายรายวิชา </label>
                                    <textarea
                                        className="input-description"
                                        name="course_Description"
                                        type="text"
                                        value={formSubject.course_Description || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="คำอธิบายรายวิชา"
                                        required
                                        onInput={(event) => handleResize(event, setDescription1)}
                                    />

                                    <label className="from-name"> คำอธิบายรายวิชาภาษาอังกฤษ </label>
                                    <textarea
                                        className="input-description"
                                        name="course_DescriptionEng"
                                        type="text"
                                        value={formSubject.course_DescriptionEng}
                                        onChange={handleSubjectChange}
                                        placeholder="คำอธิบายรายวิชาภาษาอังกฤษ"
                                        required
                                        onInput={(event) => handleResize(event, setDescription2)}
                                    />

                                    <label className="from-name"> หลักสูตร </label>
                                    <input
                                        className="input-form"
                                        name="curriculum_Name"
                                        type="text"
                                        value={formSubject.curriculum_Name || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="หลักสูตร"
                                        required
                                    />

                                    <label className="from-name"> สาขาวิชา </label>
                                    <input
                                        className="input-form"
                                        name="branch"
                                        type="text"
                                        value={formSubject.branch || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="สาขาวิชา"
                                        required
                                    />

                                    <label className="from-name"> เป็นรายวิชา </label>
                                    <input
                                        className="input-form"
                                        name="course_Category"
                                        type="text"
                                        value={formSubject.course_Category || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="วิชาแกน วิชาเฉพาะด้าน หรือวิชาเลือก"
                                        required
                                    />

                                    <label className="from-name"> รายวิชาบังคับก่อน </label>
                                    <input
                                        className="input-form"
                                        name="prerequisites"
                                        type="text"
                                        value={formSubject.prerequisites || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="รายวิชาบังคับก่อน (Pre-requisite)"
                                        required
                                    />

                                    <label className="from-name"> รายวิชาที่ต้องเรียนพร้อมกัน </label>
                                    <input
                                        className="input-form"
                                        name="corequisites"
                                        type="text"
                                        value={formSubject.corequisites || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="รายวิชาที่ต้องเรียนพร้อมกัน (Co-requisites)"
                                        required
                                    />

                                    <label className="from-name"> ภาคการศึกษา </label>
                                    <input
                                        className="input-form"
                                        name="semster_term"
                                        type="text"
                                        value={formSubject.semster_term || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="ภาคการศึกษา"
                                        required
                                    />

                                    <label className="from-name"> ชั้นปีที่เรียน </label>
                                    <input
                                        className="input-form"
                                        name="year_of_study"
                                        type="number"
                                        min={1} max={8}
                                        value={formSubject.year_of_study || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="ชั้นปีที่เรียน"
                                        required
                                    />

                                    <label className="from-name"> สถานที่เรียน </label>
                                    <input
                                        className="input-form"
                                        name="study_Area"
                                        type="text"
                                        value={formSubject.study_Area || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="สถานที่เรียน"
                                        required
                                    />

                                    <label className="from-name"> ชื่อสถาบันอุดมศึกษา </label>
                                    <input
                                        className="input-form"
                                        name="college"
                                        type="text"
                                        value={formSubject.college || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="สถาบันอุดมศึกษา"
                                        required
                                    />

                                    <label className="from-name"> วิทยาเขต </label>
                                    <input
                                        className="input-form"
                                        name="campus"
                                        type="text"
                                        value={formSubject.campus || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="วิทยาเขต"
                                        required
                                    />

                                    <label className="from-name"> คณะ </label>
                                    <input
                                        className="input-form"
                                        name="faculty"
                                        type="text"
                                        value={formSubject.faculty || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="คณะ"
                                        required
                                    />

                                    <label className="from-name"> ภาควิชา </label>
                                    <input
                                        className="input-form"
                                        name="department_Name"
                                        type="text"
                                        value={formSubject.department_Name || ''}
                                        onChange={handleSubjectChange}
                                        placeholder="ภาควิชา"
                                        required
                                    />

                                    <label className="from-name"> ชื่ออาจารย์ผู้รับผิดชอบรายวิชา </label>
                                    {responTeacher.map((rsinst, index) => (
                                        <div key={index}>
                                            <select
                                                className="selected-instructor"
                                                name="responsible_Teacher"
                                                value={rsinst.responsible_Teacher}
                                                onChange={(e) => handleResponsible(e, index)}
                                            >
                                                <option value=""> Select Instructor </option>
                                                {instructorsList.map((ins) => (
                                                    <option key={ins.user_Id} value={`${ins.user_FirstName} ${ins.user_LastName}`}>
                                                        {ins.user_FirstName} {ins.user_LastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}

                                    <label className="from-name"> ชื่ออาจารย์ผู้สอน </label>
                                    <button className="btn-add" onClick={handleAddInstructor}> + </button>
                                    {courseInstructor.map((instructor, index) => (
                                        <div key={index}>
                                            <select
                                                className="selected-instructor"
                                                name="course_Instructor"
                                                value={instructor.course_Instructor}
                                                onChange={(e) => handleInstructorChange(e, index)}
                                            >
                                                <option value=""> Select Instructor </option>
                                                {instructorsList.map((ins, i) => (
                                                    <option key={ins.user_Id} value={ins.user_Id}>
                                                        {ins.user_FirstName} {ins.user_LastName}
                                                    </option>
                                                ))}
                                            </select>

                                            <button className="btn-delete" onClick={() => handleDeleteInstructor(index)}> - </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button" onClick={handleSaveCourse}> Save </button>
                                    <button className="update" type="button" onClick={handleEditCourse}> Update </button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}

                {/* ELO */}
                {selectedMenu === 'elo' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> Expected Learning Outcome (ELO) </div>

                            <form>
                                <div className="description">
                                    <label className="from-name"> รหัส ELO </label>
                                    <input
                                        className="input-form"
                                        name="elo_code"
                                        type="text"
                                        value={formElos.elo_code || ''}
                                        onChange={handleELOsChange}
                                        placeholder="รหัสของ ELO"
                                        required
                                    />

                                    <label className="from-name"> ชื่อ ELO </label>
                                    <textarea
                                        className="input-elo"
                                        name="elo_Name"
                                        type="text"
                                        value={formElos.elo_Name || ''}
                                        onChange={handleELOsChange}
                                        placeholder="ชื่อของ ELO"
                                        required
                                        onInput={(event) => handleResize(event, setDescription3)}
                                    />

                                    <label className="from-name"> รายละเอียด ELO </label>
                                    <input
                                        className="input-form"
                                        name="elo_description"
                                        type="text"
                                        value={formElos.elo_description || ''}
                                        onChange={handleELOsChange}
                                        placeholder="รายละเอียดของ ELO"
                                        required
                                    />

                                    <label className="from-name"> ปีการศึกษาของ ELO </label>
                                    <input
                                        className="input-form"
                                        name="years_elo"
                                        type="text"
                                        value={formElos.years_elo || ''}
                                        onChange={handleELOsChange}
                                        placeholder="ปีการศึกษาของ ELO"
                                        required
                                    />
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button" onClick={handleELOsSave}> Save </button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}

                {/* BASIC CLOs */}
                {selectedMenu === 'basic' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> คุณลักษณะพื้นฐานร่วมกันของบัณฑิตที่พึงประสงค์ มจพ./CLOs </div>

                            <form>
                                <div className="description">
                                    <label className="form-name"> คุณลักษณะพื้นฐานร่วมกันของบัณฑิตที่พึงประสงค์ มจพ </label>
                                    <textarea
                                        className="input-basic"
                                        name="clo_basic_Name"
                                        type="text"
                                        value={basicformClo.clo_basic_Name || ''}
                                        onChange={handleBasicCLOsChange}
                                        placeholder="ชื่อของคุณลักษณะพื้นฐาน"
                                        required
                                        onInput={(event) => handleResize(event, setDescription4)}
                                    />

                                    <label className="form-name"> ปีของคุณลักษณะพื้นฐาน </label>
                                    <input
                                        className="input-form"
                                        name="basicClo_year"
                                        type="text"
                                        value={basicformClo.basicClo_year || ''}
                                        onChange={handleBasicCLOsChange}
                                        placeholder="ปีการศึกษาของคุณลักษณะพื้นฐานร่วมกันของบัณฑิตที่พึงประสงค์"
                                        required
                                    />
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button" onClick={handleBasicCLOsSave}> Save </button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}

            </div>
        </>
    )
}

export default EditAdmin;