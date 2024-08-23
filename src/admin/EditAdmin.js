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

    const handleMenuChange = (e) => {
        setSelectedMenu(e.target.value);
    };

    /* SUBJECT */
    const [formSubject, setFormSubject] = useState({
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
        course_Instructor: '',
        course_Instructor2: '',
        course_Instructor3: '',
        course_Instructor4: '',
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

    const handleSubjectSave = async (e) => {
        e.preventDefault();
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
                return;
            }

            const newCurriculumId = curriculumResponse.data.newCurriculumId;

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
                responsible_Teacher: formSubject.responsible_Teacher,
                prerequisites: formSubject.prerequisites,
                corequisites: formSubject.corequisites,
                study_Area: formSubject.study_Area,
                course_Instructor: formSubject.course_Instructor,
                course_Instructor2: formSubject.course_Instructor2,
                course_Instructor3: formSubject.course_Instructor3,
                course_Instructor4: formSubject.course_Instructor4,
                curriculum_Id: newCurriculumId,
            };

            const subjectResponse = await axios.post('http://localhost:8081/api/subject', subjectData);

            if (!subjectResponse.data.success) {
                console.log('Failed to Save Subject');
                return;
            }

            const updateCurriculumInCourseData = {
                curriculum_Id: newCurriculumId,
            };

            const updateCurriculumInCourseResponse = await axios.put('http://localhost:8081/api/updatecurriculumId', updateCurriculumInCourseData);

            if (updateCurriculumInCourseResponse.data.success) {
                console.log('Subject Saved Successful');
                window.location.reload();
            } else {
                console.log('Failed to Save Subject');
                alert('Failed to Update Curriculum in Course');
            }
        } catch (error) {
            console.error('Failed to Send Request', error);
            alert('Failed to Send Request. Please Check the Console for Details.');
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
                console.error('Failed to Save ELOs:', responseData.message);
                alert('Failed to Save ELOs');
            }
        } catch (error) {
            console.error('Error Saving ELOs:', error.message);
            alert('Error Saving ELOs');
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
                console.log('Basic CLOs Saved Successful');
                alert('Basic CLOs Saved Successful');
            } else if (response.status === 401) {
                console.error('Unauthorized: User not authenticated');
                alert('Unauthorized: User not authenticated');
            } else {
                const responseData = await response.json();
                console.error('Failed to Save Basic CLOs:', responseData.message);
                alert('Failed to Save Basic CLOs');
            }
        } catch (error) {
            console.error('Error Saving Basic CLOs:', error.message);
            alert('Error Saving Basic CLOs');
        }
    }

    /* EXPERIENCE */
    const [formExperience, setFormExperience] = useState({
        teaching_method_Name: '',
        results_Name: '',
    });

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setFormExperience((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleExperienceSave = async (e) => {
        e.preventDefault();
        try {
            const responseExp = await fetch('http://localhost:8081/api/addteaching', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(formExperience),
            });

            if (responseExp.status === 200) {
                console.log('วิธีการจัดการสอน Saved Successful');
                alert('วิธีการจัดการสอน Saved Successful');
            } else if (responseExp.status === 401) {
                console.error('Unauthorized: User not authenticated');
                alert('Unauthorized: User not authenticated');
            } else {
                const responseex = await responseExp.json();
                console.error('Failed to Save วิธีการจัดการสอน:', responseex.message);
                alert('Failed to Save วิธีการจัดการสอน');
            }
        } catch (error) {
            console.error('Error Saving วิธีการจัดการสอน:', error.message);
            alert('Error saving วิธีการจัดการสอน');
        }
    };

    /* MEASURING */
    const handleMeasuringSave = async (e) => {
        e.preventDefault();
        try {
            const responseRe = await fetch('http://localhost:8081/api/addresults', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(formExperience),
            });

            if (responseRe.status === 200) {
                console.log('วิธีการวัดผลลัพธ์ Saved Successful');
                alert('วิธีการวัดผลลัพธ์ Saved Successful');
            } else if (responseRe.status === 401) {
                console.error('Unauthorized: User not authenticated');
                alert('Unauthorized: User not authenticated');
            } else {
                const responseR = await responseRe.json();
                console.error('Failed to Save วิธีการวัดผลลัพธ์:', responseR.message);
                alert('Failed to Save วิธีการวัดผลลัพธ์');
            }
        } catch (error) {
            console.error('Error Saving วิธีการวัดผลลัพธ์:', error.message);
            alert('Error Saving วิธีการวัดผลลัพธ์');
        }
    };

    /* SUPPORT */
    const [formSupport, SetSupportForm] = useState({
        support_Name: '',
    })

    const handleSupportChange = (e) => {
        const { name, value } = e.target;
        SetSupportForm((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!user || user.role_Name !== 'Admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || user.role_Name !== 'Admin') {
        navigate('EditAdmin');
        return null;
    }

    return (
        <>
            <div className="page-container">

                {/* MENU ADMIN */}
                <div className="menu-container">
                    <div className="menu-name"> MENU ADMIN </div>
                    <select
                        className="btn-menu-select"
                        value={selectedMenu}
                        onChange={handleMenuChange}
                    >
                        <option> กรุณาเลือกเมนู : </option>
                        <option value="subject"> SUBJECT </option>
                        <option value="elo"> ELOs </option>
                        <option value="basic"> คุณลักษณะพื้นฐานร่วมกันของบัณฑิตที่พึงประสงค์ </option>
                        <option value="evolution"> การพัฒนานักศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง </option>
                        <option value="support"> สิ่งสนับสนุนเพื่อประสิทธิผลในการเรียนรู้ของนักศึกษา </option>
                    </select>
                </div>

                {/* SUBJECT */}
                {selectedMenu === 'subject' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> SUBJECT </div>

                            <form>
                                <div className="description">
                                    <label className="from-name"> รหัสวิชา </label>
                                    <input
                                        className="input-form"
                                        name="course_Code"
                                        type="text"
                                        value={formSubject.course_Code}
                                        onChange={handleSubjectChange}
                                        placeholder="XXXXXXXXX"
                                        required
                                    />

                                    <label className="from-name"> ชื่อวิชาภาษาไทย </label>
                                    <input
                                        className="input-form"
                                        name="course_Name"
                                        type="text"
                                        value={formSubject.course_Name}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อวิชาภาษาไทย"
                                        required
                                    />

                                    <label className="from-name"> ชื่อวิชาภาษาอังกฤษ </label>
                                    <input
                                        className="input-form"
                                        name="course_NameEng"
                                        type="text"
                                        value={formSubject.course_NameEng}
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
                                        value={formSubject.course_Credit}
                                        onChange={handleSubjectChange}
                                        placeholder="จำนวนหน่วยกิต"
                                        required
                                    />

                                    <label className="from-name"> คำอธิบายรายวิชา </label>
                                    <input
                                        className="input-form"
                                        name="course_Description"
                                        type="text"
                                        value={formSubject.course_Description}
                                        onChange={handleSubjectChange}
                                        placeholder="คำอธิบายรายวิชา"
                                        required
                                    />

                                    <label className="from-name"> คำอธิบายรายวิชาภาษาอังกฤษ </label>
                                    <input
                                        className="input-form"
                                        name="course_DescriptionEng"
                                        type="text"
                                        value={formSubject.course_DescriptionEng}
                                        onChange={handleSubjectChange}
                                        placeholder="คำอธิบายรายวิชาภาษาอังกฤษ"
                                        required
                                    />

                                    <label className="from-name"> หลักสูตร </label>
                                    <input
                                        className="input-form"
                                        name="curriculum_Name"
                                        type="text"
                                        value={formSubject.curriculum_Name}
                                        onChange={handleSubjectChange}
                                        placeholder="หลักสูตร "
                                        required
                                    />

                                    <label className="from-name"> สาขาวิชา </label>
                                    <input
                                        className="input-form"
                                        name="branch"
                                        type="text"
                                        value={formSubject.branch}
                                        onChange={handleSubjectChange}
                                        placeholder="สาขาวิชา"
                                        required
                                    />

                                    <label className="from-name"> เป็นรายวิชา </label>
                                    <input
                                        className="input-form"
                                        name="course_Category"
                                        type="text"
                                        value={formSubject.course_Category}
                                        onChange={handleSubjectChange}
                                        placeholder="วิชาแกน หรือ วิชาเลือก"
                                        required
                                    />

                                    <label className="from-name"> รายวิชาบังคับก่อน </label>
                                    <input
                                        className="input-form"
                                        name="prerequisites"
                                        type="text"
                                        value={formSubject.prerequisites}
                                        onChange={handleSubjectChange}
                                        placeholder="รายวิชาบังคับก่อน (Pre-requisite)"
                                        required
                                    />

                                    <label className="from-name"> รายวิชาที่ต้องเรียนพร้อมกัน </label>
                                    <input
                                        className="input-form"
                                        name="corequisites"
                                        type="text"
                                        value={formSubject.corequisites}
                                        onChange={handleSubjectChange}
                                        placeholder="รายวิชาที่ต้องเรียนพร้อมกัน (Co-requisites)"
                                        required
                                    />

                                    <label className="from-name"> ภาคการศึกษา </label>
                                    <input
                                        className="input-form"
                                        name="semster_term"
                                        type="text"
                                        value={formSubject.semster_term}
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
                                        value={formSubject.year_of_study}
                                        onChange={handleSubjectChange}
                                        placeholder="ชั้นปีที่เรียน"
                                        required
                                    />

                                    <label className="from-name"> สถานที่เรียน </label>
                                    <input
                                        className="input-form"
                                        name="study_Area"
                                        type="text"
                                        value={formSubject.study_Area}
                                        onChange={handleSubjectChange}
                                        placeholder="สถานที่เรียน"
                                        required
                                    />

                                    <label className="from-name"> ชื่อสถาบันอุดมศึกษา </label>
                                    <input
                                        className="input-form"
                                        name="college"
                                        type="text"
                                        value={formSubject.college}
                                        onChange={handleSubjectChange}
                                        placeholder="สถาบันอุดมศึกษา"
                                        required
                                    />

                                    <label className="from-name"> วิทยาเขต </label>
                                    <input
                                        className="input-form"
                                        name="campus"
                                        type="text"
                                        value={formSubject.campus}
                                        onChange={handleSubjectChange}
                                        placeholder="วิทยาเขต"
                                        required
                                    />

                                    <label className="from-name"> คณะ </label>
                                    <input
                                        className="input-form"
                                        name="faculty"
                                        type="text"
                                        value={formSubject.faculty}
                                        onChange={handleSubjectChange}
                                        placeholder="คณะ"
                                        required
                                    />

                                    <label className="from-name"> ภาควิชา </label>
                                    <input
                                        className="input-form"
                                        name="department_Name"
                                        type="text"
                                        value={formSubject.department_Name}
                                        onChange={handleSubjectChange}
                                        placeholder="ภาควิชา"
                                        required
                                    />

                                    <label className="from-name"> ชื่ออาจารย์ผู้รับผิดชอบรายวิชา </label>
                                    <input
                                        className="input-form"
                                        name="responsible_Teacher"
                                        type="text"
                                        value={formSubject.responsible_Teacher}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อ-นามสกุล อาจารย์ผู้รับผิดชอบรายวิชา"
                                        required
                                    />

                                    <label className="from-name"> ชื่ออาจารย์ผู้สอน </label>
                                    <input
                                        className="input-form"
                                        name="course_Instructor"
                                        type="text"
                                        value={formSubject.course_Instructor}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อ-นามสกุล อาจารย์ประจำรายวิชา"
                                        required
                                    />
                                    <input
                                        className="input-form"
                                        name="course_Instructor2"
                                        type="text"
                                        value={formSubject.course_Instructor2}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อ-นามสกุล อาจารย์ประจำรายวิชา"
                                    />
                                    <input
                                        className="input-form"
                                        name="course_Instructor3"
                                        type="text"
                                        value={formSubject.course_Instructor3}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อ-นามสกุล อาจารย์ประจำรายวิชา"
                                    />
                                    <input
                                        className="input-form"
                                        name="course_Instructor4"
                                        type="text"
                                        value={formSubject.course_Instructor4}
                                        onChange={handleSubjectChange}
                                        placeholder="ชื่อ-นามสกุล อาจารย์ประจำรายวิชา"
                                    />
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button" onClick={handleSubjectSave}> Save </button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}

                {/* ELOs */}
                {selectedMenu === 'elo' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> ELOs </div>

                            <form>
                                <div className="description">
                                    <label className="from-name"> รหัส ELOs </label>
                                    <input
                                        className="input-form"
                                        name="elo_code"
                                        type="text"
                                        value={formElos.elo_code}
                                        onChange={handleELOsChange}
                                        placeholder="รหัสของ ELOs"
                                        required
                                    />

                                    <label className="from-name"> ชื่อ ELOs </label>
                                    <input
                                        className="input-form"
                                        name="elo_Name"
                                        type="text"
                                        value={formElos.elo_Name}
                                        onChange={handleELOsChange}
                                        placeholder="ชื่อของ ELOs"
                                        required
                                    />

                                    <label className="from-name"> รายละเอียด ELOs </label>
                                    <input
                                        className="input-form"
                                        name="elo_description"
                                        type="text"
                                        value={formElos.elo_description}
                                        onChange={handleELOsChange}
                                        placeholder="รายละเอียดของ ELOs"
                                        required
                                    />

                                    <label className="from-name"> ปีการศึกษาของ ELOs </label>
                                    <input
                                        className="input-form"
                                        name="years_elo"
                                        type="text"
                                        value={formElos.years_elo}
                                        onChange={handleELOsChange}
                                        placeholder="ปีการศึกษาของ ELOs"
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
                                    <input
                                        className="input-form"
                                        name="clo_basic_Name"
                                        type="text"
                                        value={basicformClo.clo_basic_Name}
                                        onChange={handleBasicCLOsChange}
                                        placeholder="ชื่อของคุณลักษณะพื้นฐาน"
                                        required
                                    />

                                    <label className="form-name"> ปีของคุณลักษณะพื้นฐาน </label>
                                    <input
                                        className="input-form"
                                        name="basicClo_year"
                                        value={basicformClo.basicClo_year}
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

                {/* EXPERIENCE & MEASURING */}
                {selectedMenu === 'evolution' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> การพัฒนานักศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง </div>

                            <form>
                                <div className="description">
                                    <label className="from-name"> วิธีการจัดการสอน/ประสบการณ์การเรียนรู้ตาม CLOs </label>
                                    <input
                                        className="input-form"
                                        name="teaching_method_Name"
                                        type="text"
                                        value={formExperience.teaching_method_Name}
                                        onChange={handleExperienceChange}
                                        placeholder="กรุณาใส่วิธีการจัดการสอนที่ต้องการ"
                                        required
                                    />

                                    {/* Save วิธีการจัดการสอน */}
                                    <div className="button-container">
                                        <button className="save-experience" type="button" onClick={handleExperienceSave}> Save </button>
                                    </div>

                                    <label className="from-name"> วิธีการวัดผลลัพธ์การเรียนรู้ตาม CLOs </label>
                                    <input
                                        className="input-form"
                                        name="results_Name"
                                        type="text"
                                        value={formExperience.results_Name}
                                        onChange={handleExperienceChange}
                                        placeholder="กรุณาใส่วิธีการวัดผลลัพธ์ที่ต้องการ"
                                        required
                                    />
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button" onClick={handleMeasuringSave}> Save </button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}

                {/* SUPPORT */}
                {selectedMenu === 'support' && (
                    <div className="from-container-admin">

                        <div className="form-description">
                            <div className="title-name"> สิ่งสนับสนุนเพื่อประสิทธิผลในการเรียนรู้ของนักศึกษา </div>

                            <form>
                                <div className="description">
                                    <label className="form-name"> สิ่งสนับสนุน </label>
                                    <input
                                        className="input-form"
                                        name="support_Name"
                                        type="text"
                                        placeholder="ชื่อสิ่งสนับสนุน"
                                        value={formSupport.support_Name}
                                        onChange={handleSupportChange}
                                        required
                                    />
                                </div>

                                <div className="button-container">
                                    <button className="save" type="button"> Save </button>
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