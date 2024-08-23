import React, { useState, useEffect, useContext } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

/* CSS */
import Fill7 from '../style/Fill7.css';

/* Component AuthContext */
import AuthContext from './AuthContext';

/* Component MyDocument7 (PDF) */
import MyDocument7 from './MyDocument7';

import axios from "axios";

function Fill_obe7() {

    /* Function Authentication User OBE 7 */
    const { user } = useContext(AuthContext);

    /* Function ข้อมูล FromData */
    const [formData, setFormData] = useState({
        years: '',
        qualification_Level: '',
        obe_Report_Date: '',
        report_Academic_Year: '',

        /* Mode 2 */
        analysis_DataStudent: '',

        /* Mode 3 */
        obe_Dscript_7301: '',
        obe_Dscript_7302: '',
        elos_Achieved: '',
        elo_NtArchive_Dscript: '',

        /* Mode 4 */
        obe_Dscript_74201: '',
        obe_Dscript_74301: '',

        /* Mode 5 */
        people: '',
        obe_75201Other_Dscript: '',
        people_other: '',
        obe_75301Other_Dscript: '',

        /* Mode 6 */
        obe_76201_Dscript: '',

        /* Mode 7 */
        obe_77201_Dscript: '',
        obe_77202_Dscript: '',
        obe_77203_Dscript: '',
        plan_next_year: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    /* Function การประเมินคุณภาพหลักสูตรตามกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ */
    const obe_Dscript_75400 = [
        {
            indicators: '1) อาจารย์ประจำหลักสูตรอย่างน้อย ร้อยละ 80 มีส่วนร่วมในการประชุม เพื่อวางแผนติดตาม และทบทวน การดำเนินงานหลักสูตร',
            performance: '',
            explanation: '',
        },
        {
            indicators: '2) มีรายละเอียดของหลักสูตร ตามแบบ มคอ.2 ที่สอดคล้องกับกรอบมาตรฐาน คุณวุฒิระดับอุดมศึกษาแห่งชาติ หรือมาตรฐานคุณวุฒิสาขา/สาขาวิชา',
            performance: '',
            explanation: '',
        },
        {
            indicators: '3) มีรายละเอียดของรายวิชาและราย ละเอียดของประสบการณ์ภาคสนาม (ถ้ามี) ตามแบบ OBE 3 และ OBE 4 อย่างน้อยก่อนการเปิดสอนในแต่ละภาค การศึกษาให้ครบทุกรายวิชา',
            performance: '',
            explanation: '',
        },
        {
            indicators: '4) จัดทำรายงานผลการดำเนินการ ของรายวิชาและรายงานผลการดำเนินการ ภาคสนาม (ถ้ามี) ตามแบบ OBE 5 และ OBE 6 ภายใน 30 วัน หลังสิ้นสุด ภาคการศึกษาที่เปิดสอนให้ครบทุกรายวิชา',
            performance: '',
            explanation: '',
        },
        {
            indicators: '5) จัดทำรายงานผลการดำเนินการ ของหลักสูตร ตามแบบ OBE 7 ภายใน 60 วัน หลังสิ้นสุดปีการศึกษา',
            performance: '',
            explanation: '',
        },
        {
            indicators: '6) มีการทวนสอบผลสัมฤทธิ์ของนัก ศึกษาตามมาตรฐานผลการเรียนรู้ที่ กำหนดใน OBE 3 และ OBE 4 (ถ้ามี) อย่างน้อยร้อยละ 25 ของรายวิชาที่เปิด สอนในแต่ละปีการศึกษา',
            performance: '',
            explanation: '',
        },
        {
            indicators: '7) มีการพัฒนา/ปรับปรุงการจัดการ เรียนการสอน กลยุทธ์การสอน หรือ การประเมินผลการเรียนรู้จากผลการ ประเมินการดำเนินงานที่รายงานใน OBE 7 ปีที่แล้ว',
            performance: '',
            explanation: '',
        },
        {
            indicators: '8) อาจารย์ใหม่ (ถ้ามี) ทุกคนได้รับ การปฐมนิเทศหรือคำแนะนำ ด้านการจัดการเรียนการสอน',
            performance: '',
            explanation: '',
        },
        {
            indicators: '9) อาจารย์ประจำทุกคนได้รับ การพัฒนาทางวิชาการและ/หรือ วิชาชีพอย่างน้อยปีละหนึ่งครั้ง',
            performance: '',
            explanation: '',
        },
        {
            indicators: '10) จำนวนบุคลากรสนับสนุนการ เรียนการสอน (ถ้ามี) ได้รับการ พัฒนาวิชาการและ/หรือวิชาชีพ ไม่น้อยกว่าร้อยละ 50 ต่อปี',
            performance: '',
            explanation: '',
        },
        {
            indicators: '11) ระดับความพึงพอใจของ นักศึกษาปีสุดท้าย/บัณฑิตใหม่ที่มี ต่อคุณภาพหลักสูตร เฉลี่ยไม่น้อยกว่า 3.5 จากคะแนนเต็ม 5.0',
            performance: '',
            explanation: '',
        },
        {
            indicators: '12) ระดับความพึงพอใจของ ผู้ใช้บัณฑิตที่มีต่อบัณฑิตใหม่ เฉลี่ยไม่ต่ำกว่า 3.5 จากคะแนนเต็ม 5.0',
            performance: '',
            explanation: '',
        },
        {
            indicators: '13) อื่นๆ ถ้ามี',
            performance: '',
            explanation: '',
        },
        {
            indicators: 'รวมตัวบ่งชี้ในปีนี้',
            performance: '',
            explanation: '',
        },
        {
            indicators: 'จำนวนตัวบ่งชี้ที่ดำเนิน การผ่านเฉพาะตัวบ่งชี้ที่ 1-5',
            performance: '',
            explanation: '',
        },
        {
            indicators: 'ร้อยละของตัวบ่งชี้ที่ 1-5',
            performance: '',
            explanation: '',
        },
        {
            indicators: 'ร้อยละของตัวบ่งชี้ที่ 1-5',
            performance: '',
            explanation: '',
        },
        {
            indicators: 'จำนวนตัวบ่งชี้ในปีนี้ที่ดำเนินการผ่าน 1-5',
            performance: '',
            explanation: '',
        },
        {
            indicators: 'ร้อยละของตัวบ่งชี้ทั้งหมด ในปีนี้ที่ดำเนินการผ่าน',
            performance: '',
            explanation: '',
        },
    ];

    const [qualifications, setQualifications] = useState(obe_Dscript_75400);

    const handleQualificationChange = (index, field, value) => {
        const newQuali = [...qualifications];
        newQuali[index][field] = value;
        setQualifications(newQuali);
    }

    const ELOsToggleText = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox" && name === "elos_Achieved") {
            if (value === "ELOs ไม่บรรลุครบทุกตัว") {
                setFormData(prevState => ({
                    ...prevState,
                    elos_Achieved: checked ? value + " " + prevState.elo_NtArchive_Dscript : " "
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    elos_Achieved: checked ? value : " "
                }));
            }
        } else if (name === "elo_NtArchive_Dscript") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                elos_Achieved: prevState.elos_Achieved.includes("ELOs ไม่บรรลุครบทุกตัว") ? "ELOs ไม่บรรลุครบทุกตัว" + value : prevState.elos_Achieved
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        const setCurrentData = () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear() + 543;
            const currentData = yyyy;
            const currentData2 = dd + '/' + mm;

            setFormData((prevFormData) => ({
                ...prevFormData, years: currentData,
                obe_Report_Date: currentData2,
                report_Academic_Year: currentData,
                plan_next_year: currentData,
            }));
        };

        setCurrentData();
    }, []);

    const Check = (e) => {
        e.preventDefault();
        console.log('Value:', formData.elos_Achieved)
    }

    const [curriculum, setCurriculum] = useState({
        college: '',
        campus: '',
        faculty: '',
        department_Name: '',
        curriculum: '',
        branch: '',
    });

    const handleCurriculumChange = (name, value) => {
        setCurriculum((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => { fetchCurriculum(); }, []);

    const fetchCurriculum = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/curriculumData');
            const data = response.data;

            if (data && data.length > 0) {
                const curriculumData = data[0]; /* ดึงข้อมูลจากออบเจ็กต์แรกในอาร์เรย์ */
                setCurriculum({
                    college: curriculumData.college || '',
                    campus: curriculumData.campus || '',
                    faculty: curriculumData.faculty || '',
                    department_Name: curriculumData.department_Name || '',
                    curriculum: curriculumData.curriculum_Name || '',
                    branch: curriculumData.branch || '',
                });
            } else {
                console.error('No Data Available to Display');
            }
        } catch (error) {
            console.error('Error Fetching Data', error);
        }
    };

    const AdjustInputSize = (e) => {
        e.target.style.width = ((e.target.value.length + 1) * 8) + 'px';
    };

    /* Function อาจารย์ผู้รับผิดชอบหลักสูตร */
    const [curriculum_Teacher, setCurriculumTeacher] = useState(Array.from({ length: 5 }, () => ({
        instructor: '',
        qualification: '',
        positions: '',
    })));

    const [instructor, setInstructor] = useState([]);
    const [qualification, setQualification] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/api/courseInstructors')
            .then(response => {
                console.log('Fetched Data:', response.data);
                setInstructor(response.data.map(item => `${item.user_FirstName} ${item.user_LastName}`));
                setQualification(response.data.map(item => item.qualification));
                setPositions(response.data.map(item => item.positions));
            })
            .catch(error => {
                console.error('Error Fetching Instructor Data:', error);
            });
    }, []);

    const handleAddCurriculumTeacher = () => {
        setCurriculumTeacher([...curriculum_Teacher, {
            instructor: '',
            qualification: '',
            positions: '',
        }]);
    }

    const handleDeleteCurriculumTeacher = (index) => {
        setCurriculumTeacher(curriculum_Teacher.filter((_, i) => i !== index));
    }

    const handleCurriculumTeacherChange = (index, event) => {
        const { name, value } = event.target;
        const updateCurriculumTeacher = [...curriculum_Teacher];

        updateCurriculumTeacher[index][name] = value;
        setCurriculumTeacher(updateCurriculumTeacher);
    };

    const handleSaveCurriculumTeacher = async (obe7_Id) => {
        try {
            const curriTeacher = curriculum_Teacher.map((cur, index) => {
                const curT = {
                    instructor: cur.instructor,
                    qualification: cur.qualification,
                    position: cur.positions,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Curriculum Responsible Index ${index}:`, curT);
                return axios.post('http://localhost:8081/api/responsibleCurri', curT);
            })

            const responses = await Promise.all(curriTeacher);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Curriculum Responsible ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Curriculum Responsible ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function Image Input */
    const [imgFile, setImgFile] = useState({
        obe7_img_analysis: null
    });

    const handleDeleteFile = () => {
        setImgFile({ obe7_img_analysis: null });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile({ obe7_img_analysis: file });
        }
    };

    const handleSaveImgOBE7 = async (obe7_Id) => {
        const formDatas = new FormData();

        formDatas.append('obe7_img_analysis', imgFile.obe7_img_analysis);
        formDatas.append('obe_Dscript_7301', formData.obe_Dscript_7301);
        formDatas.append('obe7_Id', obe7_Id.obe7_Id);

        try {
            const response = await fetch('http://localhost:8081/api/img7', {
                method: 'POST',
                body: formDatas,
            });

            const result = await response.json();
            console.log('File URL:', result.fileUrl);

        } catch (error) {
            console.error('Error Uploading File:', error);
        }
    }

    /* Function การวิเคราะห์รายวิชาที่มีผลการเรียนไม่ปกติ */
    const [analysisCourse, setAnalysisCourse] = useState(Array.from({ length: 3 }, () => ({
        course_Id: '',
        course_Code: '',
        course_Name: '',
        abnormalities: '',
        conducting: '',
        factoranalysis: '',
        guideimprovement: '',
    })));

    const handleAddAnalysisCourse = () => {
        setAnalysisCourse([...analysisCourse, {
            course_Id: '',
            course_Code: '',
            course_Name: '',
            abnormalities: '',
            conducting: '',
            factoranalysis: '',
            guideimprovement: '',
        }]);
    };

    const handleDeleteAnalysisCourse = index => {
        const updatedData = analysisCourse.filter((_, i) => i !== index);
        setAnalysisCourse(updatedData);
    };

    const handleAnalysisCourseChange = (index, event) => {
        const { name, value } = event.target;
        const selectedCourse = JSON.parse(value);

        setAnalysisCourse(prevAnalysisCourse => {
            const updatedAnalysisCourse = [...prevAnalysisCourse];
            updatedAnalysisCourse[index] = {
                ...updatedAnalysisCourse[index],
                course_Id: selectedCourse.course_Id,
                course_Code: selectedCourse.course_Code,
                course_Name: selectedCourse.course_Name,
            };
            return updatedAnalysisCourse;
        });

        console.log('Selected Course:', selectedCourse);
    };


    const [chooseCourse, setChooseCourse] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:8081/api/chooseCourse')
            .then(response => {
                console.log('Response DataBase:', response.data);
                const courseDetails = response.data.map(course => ({
                    course_Id: course.course_Id,
                    course_Code: course.course_Code,
                    course_Name: course.course_Name
                }));

                setChooseCourse(courseDetails);
            })
            .catch(error => {
                console.error('Error Fetching Course Data:', error);
            });
    }, []);

    const CheckValue = (e) => {
        e.preventDefault();

        console.log('Course Data:', analysisCourse.map(an => ({
            course_Id: an.course_Id,
            course_Name: an.course_Name,
            course_Code: an.course_Code,
        })));
        // console.log('Course Not Data:', analysisdidnot.map(as => ({ course_Id: as.course_Id, })));
    };

    const handleSaveAnalysisCourse = async (obe7_Id) => {
        try {
            const analysisC = analysisCourse.map((ans, index) => {
                const anc = {
                    course_Id: ans.course_Id,
                    abnormalities: ans.abnormalities,
                    conducting: ans.conducting,
                    factoranalysis: ans.factoranalysis,
                    guideimprovement: ans.guideimprovement,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Analysis Course Index ${index}:`, anc);
                return axios.post('http://localhost:8081/api/ansCourse', anc);
            })

            const responses = await Promise.all(analysisC);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Analysis Course ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Analysis Course ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function การวิเคราะห์รายวิชาที่ไม่บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) */
    const [analysisdidnot, setAnalysisdidnot] = useState(Array.from({ length: 3 }, () => ({
        course_Id: '',
        course_Name: '',
        course_Code: '',
        unfulfilled_Clo: '',
        clo_Name: '',
        clo_code: '',
        elo_Corresponding_Unclo: '',
        elo_Name: '',
        elo_code: '',
        reasonclo_NotArchive: '',
        development_GuideStu: '',
    })));

    const handleAddAnalysisNotCourse = () => {
        setAnalysisdidnot([...analysisdidnot, {
            course_Id: '',
            course_Name: '',
            course_Code: '',
            unfulfilled_Clo: '',
            clo_Name: '',
            clo_code: '',
            elo_Corresponding_Unclo: '',
            elo_Name: '',
            elo_code: '',
            reasonclo_NotArchive: '',
            development_GuideStu: '',
        }]);
    };

    const handleDeleteAnalysisNotCourse = index => {
        const updatedData = analysisdidnot.filter((_, i) => i !== index);
        setAnalysisdidnot(updatedData);
    };

    const handleAnalysisNotCourseChange = (index, event) => {
        const { name, value } = event.target;
        const updatedData = [...analysisdidnot];

        if (name === 'course_Id') {
            const selectedCourse = JSON.parse(value);
            updatedData[index] = {
                ...updatedData[index],
                course_Id: selectedCourse.course_Id,
                course_Code: selectedCourse.course_Code,
                course_Name: selectedCourse.course_Name,
            };

            fetchCLOs(selectedCourse.course_Id);
        } else if (name === 'unfulfilled_Clo') {
            const selectedClo = JSON.parse(value);
            updatedData[index] = {
                ...updatedData[index],
                unfulfilled_Clo: selectedClo.clo_Id,
                clo_Name: selectedClo.clo_Name,
                clo_code: selectedClo.clo_code,
            };

            fetchELOs(selectedClo.clo_Id);
        } else if (name === 'elo_Corresponding_Unclo') {
            const selectedElo = JSON.parse(value);
            updatedData[index] = {
                ...updatedData[index],
                elo_Corresponding_Unclo: selectedElo.elo_Id,
                elo_Name: selectedElo.elo_Name,
                elo_code: selectedElo.elo_code,
            };
        } else {
            updatedData[index][name] = value;
        }

        setAnalysisdidnot(updatedData);
    };


    const [cloMap, setCloMap] = useState({});

    const fetchCLOs = async (course_Id) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/chooseCms?course_Id=${course_Id}`);
            console.log('Fetched CLOs for course_Id:', course_Id, response.data);
            setCloMap(prevState => ({ ...prevState, [course_Id]: response.data }));
        } catch (error) {
            console.error('Error Fetching CLOs:', error);
        }
    };

    useEffect(() => {
        analysisdidnot.forEach((item, index) => {
            if (item.course_Id && !cloMap[item.course_Id]) {
                fetchCLOs(item.course_Id);
            }
        });
    }, [analysisdidnot]);

    const [eloMap, setEloMap] = useState({});

    const fetchELOs = async (clo_Id) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/chooseels?clo_Id=${clo_Id}`);
            console.log('Fetched CLOs for course_Id:', clo_Id, response.data);
            setEloMap(prevState => ({ ...prevState, [clo_Id]: response.data }));
        } catch (error) {
            console.error('Error Fetching ELOs:', error);
        }
    };

    useEffect(() => {
        analysisdidnot.forEach((item, index) => {
            if (item.unfulfilled_Clo && !cloMap[item.unfulfilled_Clo]) {
                fetchELOs(item.unfulfilled_Clo);
            }
        });
    }, [analysisdidnot]);

    // const handleCheck = (e) => {
    //     e.preventDefault();

    //     console.log('Check:', analysisdidnot.map(anl => ({
    //         unfulfilled_Clo:anl.unfulfilled_Clo,
    //     })))
    // }

    const handleSaveAnalysisNotCourse = async (obe7_Id) => {
        try {
            const analydid = analysisdidnot.map((dt, index) => {
                const didnot = {
                    course_Id: dt.course_Id,
                    clo_Id: dt.unfulfilled_Clo,
                    elo_Id: dt.elo_Corresponding_Unclo,
                    reasonclo_NotArchive: dt.reasonclo_NotArchive,
                    development_GuideStu: dt.development_GuideStu,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Analysis Course Index ${index}:`, didnot);
                return axios.post('http://localhost:8081/api/ansDidnot', didnot);
            })

            const responses = await Promise.all(analydid);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Analysis Did not Course ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Analysis Did not Course ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function รายวิชาที่ไม่ได้เปิดสอนตามแผนการศึกษา และเหตุผลที่ไม่ได้เปิดสอน */
    const [courseNtoffered, setcourseNtoffered] = useState(Array.from({ length: 3 }, () => ({
        course_Id: '',
        course_Name: '',
        course_Code: '',
        reason_notTeaching: '',
        alternative: '',
    })));

    const handleAddCourseNotOffer = () => {
        setcourseNtoffered([...courseNtoffered, {
            course_Id: '',
            course_Name: '',
            course_Code: '',
            reason_notTeaching: '',
            alternative: '',
        }]);
    };

    const handleDeleteCourseNotOffer = index => {
        const updatedData = courseNtoffered.filter((_, i) => i !== index);
        setAnalysisdidnot(updatedData);
    };

    const handleCourseNotOfferChange = (index, event) => {
        const { name, value } = event.target;
        const selectedCourse = JSON.parse(value);

        setcourseNtoffered(prevCourseNtoffered => {
            const updatedCourseNtoffered = [...prevCourseNtoffered];
            updatedCourseNtoffered[index] = {
                ...updatedCourseNtoffered[index],
                course_Id: selectedCourse.course_Id,
                course_Code: selectedCourse.course_Code,
                course_Name: selectedCourse.course_Name,
            };
            return updatedCourseNtoffered;
        });
    };


    const handleSaveCourseNotOffer = async (obe7_Id) => {
        try {
            const offered = courseNtoffered.map((of, index) => {
                const offer = {
                    course_Id: of.course_Id,
                    reason_notTeaching: of.reason_notTeaching,
                    alternative: of.alternative,
                    obe7_Id: obe7_Id,
                }
                console.log(`Sending Data for Document Course Not Offered Index ${index}:`, offer);
                return axios.post('http://localhost:8081/api/offered', offer);
            })

            const responses = await Promise.all(offered);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Course Not Offered ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Course Not offered ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function วิธีแก้ไขกรณีที่มีการสอนเนื้อหาในรายวิชาไม่ครบถ้วน */
    const [editTeaching, setEditTeaching] = useState(Array.from({ length: 2 }, () => ({
        course_Id: '',
        course_Name: '',
        course_Code: '',
        topic_Notteach: '',
        reason_Notteach: '',
        edit_Teaching: '',
    })));

    const handleAddEditTeaching = () => {
        setEditTeaching([...editTeaching, {
            course_Id: '',
            course_Name: '',
            course_Code: '',
            topic_Notteach: '',
            reason_Notteach: '',
            edit_Teaching: '',
        }]);
    };

    const handleDeleteEditTeaching = index => {
        const updatedData = editTeaching.filter((_, i) => i !== index);
        setEditTeaching(updatedData);
    };

    const handleEditTeachingChange = (index, event) => {
        const { name, value } = event.target;
        const selectedCourse = JSON.parse(value);

        setEditTeaching(preveditTeaching => {
            const updateCourseOpen7352 = [...preveditTeaching];
            updateCourseOpen7352[index] = {
                ...preveditTeaching[index],
                course_Id: selectedCourse.course_Id,
                course_Code: selectedCourse.course_Code,
                course_Name: selectedCourse.course_Name,
            }
            return updateCourseOpen7352;
        });
    };

    const handleSaveEditTeaching = async (obe7_Id) => {
        try {
            const edit = editTeaching.map((ed, index) => {
                const edtTeaching = {
                    course_Id: ed.course_Id,
                    topic_Notteach: ed.topic_Notteach,
                    reason_Notteach: ed.reason_Notteach,
                    edit_Teaching: ed.edit_Teaching,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Edit Teaching Course Index ${index}:`, edtTeaching);
                return axios.post('http://localhost:8081/api/edTeaching', edtTeaching);
            })

            const responses = await Promise.all(edit);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Edit Teaching Course ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Edit Teaching Course ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }
    /* change */
    /* Function การวิเคราะห์รายวิชาที่เปิดสอน แต่ไม่มี นศ.ลงทะเบียนเรียน */
    const [notregiscourse, setNotregiscourse] = useState(Array.from({ length: 2 }, () => ({
        course_Id: '',
        course_Code: '',
        course_Name: '',
        analyze_Factors_Affect: '',
        guideline_Improvement: '',
    })));

    const handleAddRegisterNotCourse = () => {
        setNotregiscourse([...notregiscourse, {
            course_Id: '',
            course_Code: '',
            course_Name: '',
            analyze_Factors_Affect: '',
            guideline_Improvement: '',
        }]);
    };

    const handleDeleteRegisterNotCourse = index => {
        const updatedData = notregiscourse.filter((_, i) => i !== index);
        setNotregiscourse(updatedData);
    };

    const handleRegisterNotCourseChange = (index, event) => {
        const { name, value } = event.target;
        const selectedCourse = JSON.parse(value);

        setNotregiscourse(prevRegisnot => {
            const updateCourseOpen7353 = [...prevRegisnot];
            updateCourseOpen7353[index] = {
                ...updateCourseOpen7353[index],
                course_Id: selectedCourse.course_Id,
                course_Code: selectedCourse.course_Code,
                course_Name: selectedCourse.course_Name,
            };
            return updateCourseOpen7353;
        });
    };

    const handleSaveRegisterNotCourse = async (obe7_Id) => {
        try {
            const nt = notregiscourse.map((ntg, index) => {
                const notregis = {
                    course_Id: ntg.course_Id,
                    analyze_Factors_Affect: ntg.analyze_Factors_Affect,
                    guideline_Improvement: ntg.guideline_Improvement,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Not Register Course Index ${index}:`, notregis);
                return axios.post('http://localhost:8081/api/notregister', notregis);
            })

            const responses = await Promise.all(nt);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Not Register Course ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Not Register Course ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function การบริหารหลักสูตร */
    const [manageCurriculum, setManageCurriculum] = useState(Array.from({ length: 2 }, () => ({
        problem_Name: '',
        effect_Name: '',
        protect_Name: '',
    })));

    const handleAddManageCurriculum = () => {
        setManageCurriculum([...manageCurriculum, {
            problem_Name: '',
            effect_Name: '',
            protect_Name: '',
        }]);
    };

    const handleDeleteManageCurriculum = index => {
        const updatedData = manageCurriculum.filter((_, i) => i !== index);
        setManageCurriculum(updatedData);
    };

    const handleManageCurriculumChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript74101 = [...manageCurriculum];

        updateOBEDscript74101[index][name] = value;
        setManageCurriculum(updateOBEDscript74101);
    };

    const handleSaveManageCurriculum = async (obe7_Id) => {
        try {
            const manage = manageCurriculum.map((mg, index) => {
                const mgcurri = {
                    problem_Name: mg.problem_Name,
                    effect_Name: mg.effect_Name,
                    protect_Name: mg.protect_Name,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Management Curriculum Index ${index}:`, mgcurri);
                return axios.post('http://localhost:8081/api/manageCurri', mgcurri);
            })

            const responses = await Promise.all(manage);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Management Curriculum ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Management Curriculum ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function การประเมินหลักสูตรจากผู้ที่กำลังจะสำเร็จการศึกษา */
    const [courseEvalution, setCourseEvalution] = useState(Array.from({ length: 2 }, () => ({
        improtant_Cri: '',
        Propose_Chg: '',
    })));

    const handleAddCourseEvaluation = () => {
        setCourseEvalution([...courseEvalution, {
            improtant_Cri: '',
            Propose_Chg: '',
        }]);
    };

    const handleDeleteCourseEvaluation = index => {
        const updatedData = courseEvalution.filter((_, i) => i !== index);
        setCourseEvalution(updatedData);
    };

    const handleCourseEvaluationChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript75100 = [...courseEvalution];

        updateOBEDscript75100[index][name] = value;
        setCourseEvalution(updateOBEDscript75100);
    };

    const handleSaveCourseEvaluation = async (obe7_Id) => {
        try {
            const courseevl = courseEvalution.map((ce, index) => {
                const evl = {
                    improtant_Cri: ce.improtant_Cri,
                    Propose_Chg: ce.Propose_Chg,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Course Evalution Index ${index}:`, evl);
                return axios.post('http://localhost:8081/api/evlc', evl);
            })

            const responses = await Promise.all(courseevl);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Course Evalution ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Course Evalution ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function การประเมินหลักสูตรจากผู้มีส่วนได้ส่วนเสียต่อหลักสูตร */
    const [stakeholdersEvl, setStakeholdersEvl] = useState(Array.from({ length: 2 }, () => ({
        criticism: '',
        Propose_Chg: '',
    })));

    const handleAddStakeHolder = () => {
        setStakeholdersEvl([...stakeholdersEvl, {
            criticism: '',
            Propose_Chg: '',
        }]);
    };

    const handleDeleteStakeHolder = index => {
        const updatedData = stakeholdersEvl.filter((_, i) => i !== index);
        setStakeholdersEvl(updatedData);
    };

    const handleStakeHolderChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript75200 = [...stakeholdersEvl];

        updateOBEDscript75200[index][name] = value;
        setStakeholdersEvl(updateOBEDscript75200);
    };

    const handleSaveStakeHolder = async (obe7_Id) => {
        try {
            const stkH = stakeholdersEvl.map((sth, index) => {
                const stake = {
                    people: sth.people,
                    criticism: sth.criticism,
                    Propose_Chg: sth.Propose_Chg,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document StakeHolder Evaluation Index ${index}:`, stake);
                return axios.post('http://localhost:8081/api/stakeHolder', stake);
            })

            const responses = await Promise.all(stkH);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document StakeHolder Evaluation ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document StakeHolder Evaluation ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    const handleCheckboxHolderChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox" && name === "people" && name === "people_other") {
            if (value === "อื่นๆ") {
                setFormData(prevState => ({
                    ...prevState,
                    people: checked ? value + " " + prevState.obe_75201Other_Dscript : " ",
                    people_other: checked ? value + " " + prevState.obe_75301Other_Dscript : " "
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    people: checked ? value : " ",
                    people_other: checked ? value : " ",
                }));
            }
        } else if (name === "obe_75201Other_Dscript") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                people: prevState.people.includes("อื่นๆ") ? "อื่นๆ" + value : prevState.people
            }));
        } else if (name === "obe_75301Other_Dscript") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                people_other: prevState.people_other.includes("อื่นๆ") ? "อื่นๆ" + value : prevState.people_other
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    /* Function สรุปข้อคิดเห็นจากผู้มีส่วนได้ส่วนเสียต่อผลการเรียนรู้ที่คาดหวังของหลักสูตร (ELOs) */
    const [elo_comment, setElo_comment] = useState(Array.from({ length: 2 }, () => ({
        elo_Id: '',
        comment_Student_elo: '',
        improvement_elo: '',
    })));

    const handleAddELOsComment = () => {
        setElo_comment([...elo_comment, {
            elo_Id: '',
            comment_Student_elo: '',
            improvement_elo: '',
        }]);
    };

    const handleDeleteELOsComment = index => {
        const updatedData = elo_comment.filter((_, i) => i !== index);
        setElo_comment(updatedData);
    };

    const handleELOsCommentChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript75300 = [...elo_comment];

        updateOBEDscript75300[index][name] = value;
        setElo_comment(updateOBEDscript75300);
    };

    const handleSaveELOsComment = async (obe7_Id) => {
        try {
            const elcomment = elo_comment.map((elc, index) => {
                const cm = {
                    elo_Id: elc.elo_Id,
                    people_other: elc.people_other,
                    comment_Student_elo: elc.comment_Student_elo,
                    improvement_elo: elc.improvement_elo,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document ELOs Comment Index ${index}:`, cm);
                return axios.post('http://localhost:8081/api/eloComm', cm);
            })

            const responses = await Promise.all(elcomment);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document ELOs Comment ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document ELOs Comment ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function ข้อคิดเห็นหรือสาระที่ได้รับการเสนอแนะจากผู้ประเมิน */
    const [suggestevalutor, setSuggestevalutor] = useState(Array.from({ length: 2 }, () => ({
        Assessor: '',
        idea: '',
        content: '',
    })));

    const handleAddSuggestEvaluator = () => {
        setSuggestevalutor([...suggestevalutor, {
            Assessor: '',
            idea: '',
            content: '',
        }]);
    };

    const handleDeleteSuggestEvaluator = index => {
        const updatedData = suggestevalutor.filter((_, i) => i !== index);
        setSuggestevalutor(updatedData);
    };

    const handleSuggestEvaluatorChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript76100 = [...suggestevalutor];

        updateOBEDscript76100[index][name] = value;
        setSuggestevalutor(updateOBEDscript76100);
    };

    const handleSaveSuggestEvaluator = async (obe7_Id) => {
        try {
            const suggest = suggestevalutor.map((sgg, index) => {
                const sg = {
                    Assessor: sgg.Assessor,
                    idea: sgg.idea,
                    content: sgg.content,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Suggest Evaluator Index ${index}:`, sg);
                return axios.post('http://localhost:8081/api/sgevalutor', sg);
            })

            const responses = await Promise.all(suggest);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Suggest Evaluator ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Suggest Evaluator ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function ข้อมูลความก้าวหน้าของการดำเนินงานตามแผนที่เสนอในรายงานของปีที่ผ่านมา */
    const [progress, setProgress] = useState(Array.from({ length: 3 }, () => ({
        action_plan: '',
        deadline: '',
        responsible: '',
        operationResult: '',
        unsuccess: '',
    })));

    const handleAddProgress = () => {
        setProgress([...progress, {
            action_plan: '',
            deadline: '',
            responsible: '',
            operationResult: '',
            unsuccess: '',
        }]);
    };

    const handleDeleteProgress = index => {
        const updatedData = progress.filter((_, i) => i !== index);
        setProgress(updatedData);
    };

    const handleProgressChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript77100 = [...progress];

        updateOBEDscript77100[index][name] = value;
        setProgress(updateOBEDscript77100);
    };

    const handleSaveProgress = async (obe7_Id) => {
        try {
            const Progresse = progress.map((pg, index) => {
                const pgs = {
                    action_plan: pg.action_plan,
                    deadline: pg.deadline,
                    responsible: pg.responsible,
                    operationResult: pg.operationResult,
                    unsuccess: pg.unsuccess,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document Progress of Implementation Report Index ${index}:`, pgs);
                return axios.post('http://localhost:8081/api/progress', pgs);
            })

            const responses = await Promise.all(Progresse);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Progress of Implementation Report ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Progress of Implementation Report ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function ข้อมูลแผนปฏิบัติการใหม่ */
    const [newEducations, seNewEducations] = useState(Array.from({ length: 3 }, () => ({
        actionPlanName: '',
        deadlinePlan: '',
        Responsible: '',
    })));

    const handleAddNewEducation = () => {
        seNewEducations([...newEducations, {
            actionPlanName: '',
            deadlinePlan: '',
            Responsible: '',
        }]);
    };

    const handleDeleteNewEducation = index => {
        const updatedData = newEducations.filter((_, i) => i !== index);
        seNewEducations(updatedData);
    };

    const handleNewEducationChange = (index, event) => {
        const { name, value } = event.target;
        const updateOBEDscript77300 = [...newEducations];

        updateOBEDscript77300[index][name] = value;
        seNewEducations(updateOBEDscript77300);
    };

    const handleSaveNewEducation = async (obe7_Id) => {
        try {
            const newEducation = newEducations.map((es, index) => {
                const newEdu = {
                    plan_next_year: formData.plan_next_year,
                    actionPlanName: es.actionPlanName,
                    deadlinePlan: es.deadlinePlan,
                    Responsible: es.Responsible,
                    obe7_Id: obe7_Id,
                }

                console.log(`Sending Data for Document New Action Plan for Next Year Index ${index}:`, newEdu);
                return axios.post('http://localhost:8081/api/newEducations', newEdu);
            })

            const responses = await Promise.all(newEducation);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document New Action Plan for Next Year ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document New Action Plan for Next Year ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function Resize Input */
    const [description1, setDescription1] = useState('');
    const [description2, setDescription2] = useState('');
    const [description3, setDescription3] = useState('');

    const handleResize = (event, setDescription) => {
        setDescription(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    /* Function Save Data OBE 7 */
    const handleSaveOBE7 = async () => {
        try {
            const dataObe7 = {
                user_Id: user.user_Id,
                obe7_college: curriculum.college,
                obe7_campus: curriculum.campus,
                obe7_faculty: curriculum.faculty,
                obe7_department: curriculum.department_Name,
                obe7_curriculum: curriculum.curriculum,
                obe7_branch: curriculum.branch,
                obe7_years: formData.years,
                qualification_Level: formData.qualification_Level,
                obe_reportDate: formData.obe_Report_Date,
                report_Academic_Year: formData.report_Academic_Year,
                analysisDataStudent: formData.analysis_DataStudent,
                ELo_Archive_bl: formData.elos_Achieved,
                obe_description74201: formData.obe_Dscript_74201,
                obe_description74301: formData.obe_Dscript_74301,
                obe_76201_description: formData.obe_76201_Dscript,
                obe_77201_description: formData.obe_77201_Dscript,
                obe_77202_description: formData.obe_77202_Dscript,
                obe_77203_description: formData.obe_77203_Dscript,
            }

            const response = await fetch('http://localhost:8081/api/obe7', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(dataObe7),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                console.log('Data Outcome-Based Education 7 Saved Successful', responseData);
                return responseData.obe7_Id;
            } else {
                console.error('Failed to Save Data Outcome-Based Education 7');
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    const handleSaveData = async (e) => {
        e.preventDefault();

        const obe7_Id = await handleSaveOBE7()

        if (obe7_Id) {
            console.log('Successfull Saved OBE 7 obe7_Id:', obe7_Id);

            await handleSaveCurriculumTeacher(obe7_Id);
            await handleSaveImgOBE7(obe7_Id);
            await handleSaveAnalysisCourse(obe7_Id);
            await handleSaveAnalysisNotCourse(obe7_Id);
            await handleSaveCourseNotOffer(obe7_Id);
            await handleSaveEditTeaching(obe7_Id);
            await handleSaveRegisterNotCourse(obe7_Id);
            await handleSaveManageCurriculum(obe7_Id);
            await handleSaveCourseEvaluation(obe7_Id);
            await handleSaveStakeHolder(obe7_Id);
            await handleSaveELOsComment(obe7_Id);
            await handleSaveSuggestEvaluator(obe7_Id);
            await handleSaveProgress(obe7_Id);
            await handleSaveNewEducation(obe7_Id);
        } else {
            console.error('Error Saving Data Document All');
        }
    };

    /* Function Download PDF */
    const [showPdf, setShowPdf] = useState(false);

    const RenderPDF = () => (
        <PDFDownloadLink document={
            <MyDocument7
                curriculum={curriculum}
                formData={formData}
                curriculum_Teacher={curriculum_Teacher}
                imgFile={imgFile}
                analysisCourse={analysisCourse}
                chooseCourse={chooseCourse}
                analysisdidnot={analysisdidnot}
                courseNtoffered={courseNtoffered}
                editTeaching={editTeaching}
                notregiscourse={notregiscourse}
                manageCurriculum={manageCurriculum}
                courseEvalution={courseEvalution}
                stakeholdersEvl={stakeholdersEvl}
                elo_comment={elo_comment}
                qualifications={qualifications}
                suggestevalutor={suggestevalutor}
                progress={progress}
                newEducations={newEducations}
            />
        } fileName="Document OBE 7.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading Document...' : <button className="button-download" type="button"> Download </button>)}
        </PDFDownloadLink>
    );

    const handleDownloadPDF = async (e) => {
        e.preventDefault();

        setShowPdf(true);
        RenderPDF();
    }

    return (
        <>
            <div className={Fill7}>

                <div className="fill7-container">
                    <div className="fill7-bar">

                        <div className="fill7-obe">
                            <button className="name-obe7" type="button"> OBE 7 </button>
                        </div>

                        <div className="name-head">
                            <b> <p> รายงานผลการดำเนินการของหลักสูตร </p> </b>
                        </div>

                        <form>
                            <div className="input-container-obe7">

                                <label className="from-titles-obe7"> <b> ชื่อสถาบันอุดมศึกษา </b>
                                    <input
                                        className="from-college-obe7"
                                        name="college"
                                        value={curriculum.college || ''}
                                        onChange={((e) => handleCurriculumChange('college', e.target.value))}
                                        onInput={AdjustInputSize}
                                        required
                                    />
                                </label>

                                <label className="from-titles-obe7">
                                    <label> <b> วิทยาเขต </b> </label>
                                    <input
                                        className="from-input-obe7"
                                        name="campus"
                                        type="text"
                                        value={curriculum.campus}
                                        onChange={((e) => handleCurriculumChange('campus', e.target.value))}
                                        required
                                    />
                                    <label> <b> คณะ </b> </label>
                                    <input
                                        className="from-input-obe7"
                                        name="faculty"
                                        type="text"
                                        value={curriculum.faculty}
                                        onChange={((e) => handleCurriculumChange('faculty', e.target.value))}
                                        required
                                    />
                                    <label> <b> ภาควิชา </b> </label>
                                    <input
                                        className="from-inputs-obe7"
                                        name="department_Name"
                                        type="text"
                                        value={curriculum.department_Name}
                                        onChange={((e) => handleCurriculumChange('department_Name', e.target.value))}
                                        required
                                    />
                                </label>

                                {/* หมวดที่ 1 ข้อมูลทั่วไป */}
                                <div className="mode1">
                                    <b> <p> หมวดที่ 1 ข้อมูลทั่วไป </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7">
                                            <label> <b> 1.1 หลักสูตร </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="curriculum"
                                                type="text"
                                                value={curriculum.curriculum}
                                                onChange={((e) => handleCurriculumChange('curriculum', e.target.value))}
                                                required
                                            />
                                            <label> <b> สาขาวิชา </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="branch"
                                                type="text"
                                                value={curriculum.branch}
                                                onChange={((e) => handleCurriculumChange('branch', e.target.value))}
                                                required
                                            />
                                            <label> <b> พ.ศ. </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="years"
                                                type="text"
                                                value={formData.years}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-titles-obe7">
                                            <label> <b> 1.2 ระดับคุณวุฒิ </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="qualification_Level"
                                                type="text"
                                                value={formData.qualification_Level}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-titles-obe7"> <b> 1.3 อาจารย์ผู้รับผิดชอบหลักสูตร </b> </label>
                                        <button className="tcurriculum-add" type="button" onClick={handleAddCurriculumTeacher}> + </button>
                                        <table className="table-tcurriculum">
                                            <thead>
                                                <tr>
                                                    <th> ชื่อ-สกุล </th>
                                                    <th> คุณวุฒิ </th>
                                                    <th> ตำแหน่งวิชาการ </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {curriculum_Teacher.map((teacher, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="from-select-teacher"
                                                                name="instructor"
                                                                value={teacher.instructor}
                                                                onChange={(event) => handleCurriculumTeacherChange(index, event)}
                                                            >
                                                                <option> Select Instructor </option>
                                                                {instructor.map((instructors, i) => (
                                                                    <option key={i} value={instructors}> {instructors} </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="from-select-qualification"
                                                                name="qualification"
                                                                value={teacher.qualification}
                                                                onChange={(event) => handleCurriculumTeacherChange(index, event)}
                                                            >
                                                                <option className="from-option-qualification"> Select Qualification </option>
                                                                {qualification.map((qua, idx) => (
                                                                    <option className="from-option-qualification" key={idx} value={qua}> {qua} </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="from-select-position"
                                                                name="positions"
                                                                value={teacher.positions}
                                                                onChange={(event) => handleCurriculumTeacherChange(index, event)}
                                                            >
                                                                <option className="from-option-position"> Select Position </option>
                                                                {positions.map((ps, idxs) => (
                                                                    <option className="from-option-position" key={idxs} value={ps}> {ps} </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <button className="tcurriculum-delete" type="button" onClick={() => handleDeleteCurriculumTeacher(index)}> - </button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-titles-obe7">
                                            <label> <b> 1.4 วันที่รายงาน </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="obe_Report_Date"
                                                type="text"
                                                value={formData.obe_Report_Date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-titles-obe7">
                                            <label> <b> 1.5 ปีการศึกษาที่รายงาน </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="report_Academic_Year"
                                                type="text"
                                                value={formData.report_Academic_Year}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* หมวดที่ 2 ข้อมูลด้านนักศีกษา */}
                                <div className="mode2">
                                    <b> <p> หมวดที่ 2 ข้อมูลด้านนักศีกษา </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7">
                                            <label> <b> วิเคราะห์ผลข้อมูลด้านนักศึกษา </b> </label>
                                            <label> จากข้อมูลเชิงสถิติด้านนักศึกษาในรายงานการประเมินตนเองระดับหลักสูตร ตัวบ่งชี้ AUN.8 คุณภาพผู้เรียนและการสนับสนุน และตัวบ่งชี้ AUN.11 ผลผลิตให้วิเคราะห์ผลข้อมูลด้านนักศึกษาที่สำคัญที่เกิดขึ้นในรอบปีการศึกษานี้ </label>
                                            <textarea
                                                className="from-01"
                                                name="analysis_DataStudent"
                                                type="text"
                                                value={formData.analysis_DataStudent}
                                                onChange={handleInputChange}
                                                onInput={(event) => handleResize(event, setDescription1)}
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* หมวดที่ 3 ข้อมูลสรุปรายวิชาของหลักสูตร */}
                                <div className="mode3">
                                    <b> <p> หมวดที่ 3 ข้อมูลสรุปรายวิชาของหลักสูตร </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7">
                                            <label> <b> 3.1 สรุปผลรายวิชาที่เปิดสอนในภาคการศึกษา/ปีการศึกษา </b> </label>
                                            <label> ระบุรายวิชาที่เปิดสอนทั้งหมดพร้อมจำนวนนักศึกษาที่ลงทะเบียนเรียน จำนวนนักศึกษาที่สอบผ่านแต่ละรายวิชาและการกระจายของระดับคะแนน </label> <br />
                                            <label className="button-choose-obe-7" htmlFor="file-upload"> <span> Choose File </span> </label>
                                        </label>
                                        <input
                                            className="from-file"
                                            name="obe7_img_analysis"
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {imgFile.obe7_img_analysis && (
                                            <div>
                                                <img className="show-file" src={URL.createObjectURL(imgFile.obe7_img_analysis)} />
                                                <button className="file-delete" onClick={handleDeleteFile}> Remove File </button>
                                            </div>
                                        )}

                                        <div className="description">
                                            <label className="name-detail-other"> <b> รายละเอียดเพิ่มเติม </b> </label> <br />
                                            <textarea
                                                className="from-detail-other"
                                                name="obe_Dscript_7301"
                                                type="text"
                                                value={formData.obe_Dscript_7301}
                                                onChange={handleInputChange}
                                                onInput={(event) => handleResize(event, setDescription2)}
                                            />
                                        </div>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7">
                                            <label> <b> 3.2 การวิเคราะห์รายวิชาที่มีผลการเรียนไม่ปกติ </b> </label>
                                            <button className="analysis-subject-add" type="button" onClick={handleAddAnalysisCourse}> + </button>
                                        </label>
                                        <label className="from-title1-obe7"> ระบุรหัสและชื่อรายวิชาที่มีการแจกแจงระดับคะแนนไม่ปกติ เช่น ได้ระดับคะแนนสูงมากหรือต่ำเกินไป ต่างจากเกณฑ์มาตรฐานการให้ระดับคะแนนในแต่ละรายวิชา หรือนักศึกษาสอบตกมากเกินไป การสอนไม่ตรงกับเนื้อหาที่กำหนดของรายวิชา เป็นต้นนอกจากนี้ให้ระบุวิธีการตรวจสอบสาเหตุความผิดปกติ ที่ทำให้เกิดความไม่ปกติจากข้อกำหนดหรือเกณฑ์ที่ตั้งไว้ และมาตรการแก้ไขที่ดำเนินการไปแล้ว </label> <br />
                                        <table className="table-analysis-subject">
                                            <thead>
                                                <tr>
                                                    <th> รหัสและชื่อรายวิชา </th>
                                                    <th> ความไม่ปกติที่พบ </th>
                                                    <th> การดำเนินการตรวจสอบ </th>
                                                    <th> เหตุผลที่ทำให้เกิดความไม่ปกติจากข้อกำหนดหรือเกณฑ์ที่ตั้งไว้ </th>
                                                    <th> มาตรการแก้ไขที่ได้ดำเนินการแล้ว (หากจำเป็น) </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisCourse.map((alsc, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="from-table01"
                                                                name="course_Id"
                                                                type="text"
                                                                value={JSON.stringify({ course_Id: alsc.course_Id, course_Code: alsc.course_Code, course_Name: alsc.course_Name })}
                                                                onChange={(event) => handleAnalysisCourseChange(index, event)}
                                                            >
                                                                <option> Select Course </option>
                                                                {chooseCourse.map(cs => (
                                                                    <option key={cs.course_Id} value={JSON.stringify(cs)}>
                                                                        {cs.course_Code} {cs.course_Name}
                                                                    </option>
                                                                ))}้
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table02"
                                                                name="abnormalities"
                                                                type="text"
                                                                rows={3}
                                                                value={alsc.abnormalities}
                                                                onChange={(event) => handleAnalysisCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table02"
                                                                name="conducting"
                                                                type="text"
                                                                value={alsc.conducting}
                                                                onChange={(event) => handleAnalysisCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table02"
                                                                name="factoranalysis"
                                                                type="text"
                                                                value={alsc.factoranalysis}
                                                                onChange={(event) => handleAnalysisCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table02"
                                                                name="guideimprovement"
                                                                type="text"
                                                                value={alsc.guideimprovement}
                                                                onChange={(event) => handleAnalysisCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="analysis-subject-delete" type="button" onClick={() => handleDeleteAnalysisCourse(index)}> - </button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {/* <button onClick={CheckValue}>S</button> */}
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="name-detail-other"> <b> รายละเอียดเพิ่มเติม </b> </label> <br />
                                        <textarea
                                            className="from-detail-other"
                                            name="obe_Dscript_7302"
                                            type="text"
                                            value={formData.obe_Dscript_7302}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription3)}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7">
                                            <label> <b> 3.3 การวิเคราะห์รายวิชาที่ไม่บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) </b> </label>
                                            <button className="analysis-course-clo-add" type="button" onClick={handleAddAnalysisNotCourse}> + </button>
                                        </label>
                                        <label className="from-title1-obe7"> ระบุรหัสและชื่อรายวิชาที่ดำเนินการแล้วไม่สามารถทำให้บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) ได้ นอกจากนี้ให้ระบุ CLOs ที่ไม่บรรลุ ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (ELOs) ที่สอดคล้องกับ CLOs ที่ไม่บรรลุ เหตุผลที่ทำให้ไม่สามารถทำให้บรรลุได้ และแนวทางการพัฒนาปรับปรุงเพื่อให้นักศึกษาบรรลุตามแต่ละ CLOs นั้นๆ </label> <br />
                                        <table className="table-analysis-course-clo">
                                            <thead>
                                                <tr>
                                                    <th> รหัสและชื่อรายวิชา </th>
                                                    <th> CLOs ที่ไม่บรรลุ </th>
                                                    <th> ELOs ที่สอดคล้องกับ CLOs ที่ไม่บรรลุ </th>
                                                    <th> เหตุผลที่ทำให้ CLOs ไม่บรรลุ </th>
                                                    <th> แนวทางการพัฒนาปรับปรุงเพื่อให้นักศึกษาบรรลุตามแต่ละ CLOs </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisdidnot.map((didnot, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="from-table01"
                                                                name="course_Id"
                                                                type="text"
                                                                value={JSON.stringify({
                                                                    course_Id: didnot.course_Id,
                                                                    course_Code: didnot.course_Code,
                                                                    course_Name: didnot.course_Name
                                                                })}
                                                                onChange={(event) => handleAnalysisNotCourseChange(index, event)}
                                                            >
                                                                <option value={JSON.stringify("-")}> Select Course </option>
                                                                {chooseCourse.map(cs => (
                                                                    <option key={cs.course_Id} value={JSON.stringify({
                                                                        course_Id: cs.course_Id,
                                                                        course_Code: cs.course_Code,
                                                                        course_Name: cs.course_Name
                                                                    })}>
                                                                        {cs.course_Code} {cs.course_Name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            {didnot.course_Id && (
                                                                <select
                                                                    className="from-table01"
                                                                    name="unfulfilled_Clo"
                                                                    type="text"
                                                                    value={JSON.stringify({
                                                                        clo_Id: didnot.unfulfilled_Clo,
                                                                        clo_Name: didnot.clo_Name,
                                                                        clo_code: didnot.clo_code
                                                                    })}
                                                                    onChange={(event) => handleAnalysisNotCourseChange(index, event)}
                                                                >
                                                                    <option value={JSON.stringify({ clo_Id: '-', clo_Name: '', clo_code: '' })}> Select CLOs </option>
                                                                    {cloMap[didnot.course_Id] && cloMap[didnot.course_Id].map(clo => (
                                                                        <option key={clo.clo_Id} value={JSON.stringify({
                                                                            clo_Id: clo.clo_Id,
                                                                            clo_Name: clo.clo_Name,
                                                                            clo_code: clo.clo_code
                                                                        })}>
                                                                            {clo.clo_code} {clo.clo_Name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {didnot.unfulfilled_Clo && (
                                                                <select
                                                                    className="from-table01"
                                                                    name="elo_Corresponding_Unclo"
                                                                    type="text"
                                                                    value={JSON.stringify({
                                                                        elo_Id: didnot.elo_Corresponding_Unclo,
                                                                        elo_Name: didnot.elo_Name,
                                                                        elo_code: didnot.elo_code
                                                                    })}
                                                                    onChange={(event) => handleAnalysisNotCourseChange(index, event)}
                                                                >
                                                                    <option value={JSON.stringify({ elo_Id: '-', elo_Name: '', elo_code: '' })}> Select ELOs </option>
                                                                    {eloMap[didnot.unfulfilled_Clo] && eloMap[didnot.unfulfilled_Clo].map(elo => (
                                                                        <option key={elo.elo_Id} value={JSON.stringify({
                                                                            elo_Id: elo.elo_Id,
                                                                            elo_Name: elo.elo_Name,
                                                                            elo_code: elo.elo_code
                                                                        })}>
                                                                            {elo.elo_code} {elo.elo_Name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="reasonclo_NotArchive"
                                                                type="text"
                                                                value={didnot.reasonclo_NotArchive}
                                                                onChange={(event) => handleAnalysisNotCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="development_GuideStu"
                                                                type="text"
                                                                value={didnot.development_GuideStu}
                                                                onChange={(event) => handleAnalysisNotCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="analysis-course-clo-delete" type="button" onClick={() => handleDeleteAnalysisNotCourse(index)}> - </button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7">
                                            <label> <b> 3.4 การวิเคราะห์ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (Expected Learning Outcomes: ELOs) </b> </label>
                                            <label> หากมีข้อมูลรายวิชาที่ดำเนินการแล้วไม่สามารถทำให้บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) ในหัวข้อที่ 3.3 ให้วิเคราะห์ว่า CLOs ที่ไม่บรรลุมีผลทำให้ ELOs ยังคงบรรลุอยู่ครบทุกตัวหรือไม่ </label>
                                        </label>
                                        <input
                                            className="from-check-achieve"
                                            name="elos_Achieved"
                                            type="checkbox"
                                            value="ELOs ยังคงบรรลุครบทุกตัว"
                                            checked={formData.elos_Achieved.includes("ELOs ยังคงบรรลุครบทุกตัว")}
                                            onChange={ELOsToggleText}
                                        />
                                        ELOs ยังคงบรรลุครบทุกตัว <br />
                                        <input
                                            className="from-check-achieve"
                                            name="elos_Achieved"
                                            type="checkbox"
                                            value="ELOs ไม่บรรลุครบทุกตัว"
                                            checked={formData.elos_Achieved.includes("ELOs ไม่บรรลุครบทุกตัว")}
                                            onChange={ELOsToggleText}
                                        />
                                        ELOs ไม่บรรลุครบทุกตัว แต่มีมาตรการแก้ไขที่ดำเนินการเพื่อให้ ELOs บรรลุ คือ
                                        {formData.elos_Achieved.includes("ELOs ไม่บรรลุครบทุกตัว") && (
                                            <input
                                                className="from-02"
                                                name="elo_NtArchive_Dscript"
                                                value={formData.elo_NtArchive_Dscript}
                                                onChange={ELOsToggleText}
                                            />
                                        )}
                                    </div>

                                    <div className="description">
                                        <label className="from-title3-obe7">
                                            <label> <b> 3.5 การเปิดรายวิชาในภาคหรือปีการศึกษา </b> </label>
                                        </label>
                                        <label className="from-title4-obe7"> <b> 3.5.1 รายวิชาที่ไม่ได้เปิดสอนตามแผนการศึกษา และเหตุผลที่ไม่ได้เปิดสอน </b> </label>
                                        <button className="open-course-add" type="button" onClick={handleAddCourseNotOffer}> + </button>
                                        <table className="table-open-course">
                                            <thead>
                                                <tr>
                                                    <th> รหัสและชื่อรายวิชา </th>
                                                    <th> เหตุผลที่ไม่ได้เปิดสอน </th>
                                                    <th> มาตรการทดแทนที่ได้ดำเนินการ(ถ้ามี) </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courseNtoffered.map((ofred, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="from-table01"
                                                                name="course_Id"
                                                                type="text"
                                                                value={JSON.stringify({
                                                                    course_Id: ofred.course_Id,
                                                                    course_Code: ofred.course_Code,
                                                                    course_Name: ofred.course_Name
                                                                })}
                                                                onChange={(event) => handleCourseNotOfferChange(index, event)}
                                                            >
                                                                <option> Select Course </option>
                                                                {chooseCourse.map(cs => (
                                                                    <option key={cs.course_Id} value={JSON.stringify({
                                                                        course_Id: cs.course_Id,
                                                                        course_Code: cs.course_Code,
                                                                        course_Name: cs.course_Name
                                                                    })}>
                                                                        {cs.course_Code} {cs.course_Name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="reason_notTeaching"
                                                                type="text"
                                                                value={ofred.reason_notTeaching}
                                                                onChange={(event) => handleCourseNotOfferChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="alternative"
                                                                type="text"
                                                                value={ofred.alternative}
                                                                onChange={(event) => handleCourseNotOfferChange(index, event)}
                                                            />
                                                        </td>
                                                        <td className="none">
                                                            <button className="open-course-delete" type="button" onClick={() => handleDeleteCourseNotOffer(index)}> - </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <label className="from-title4-obe7"> <b> 3.5.2 วิธีแก้ไขกรณีที่มีการสอนเนื้อหาในรายวิชาไม่ครบถ้วน </b> </label>
                                        <button className="open-course-add" type="button" onClick={handleAddEditTeaching}> + </button>
                                        <table className="table-open-course">
                                            <thead>
                                                <tr>
                                                    <th> รายวิชา </th>
                                                    <th> สาระหรือหัวข้อที่ขาด </th>
                                                    <th> สาเหตุที่ไม่ได้สอน </th>
                                                    <th> การแก้ไขที่ได้ดำเนินการแล้ว </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editTeaching.map((edth, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="from-table01"
                                                                name="course_Id"
                                                                type="text"
                                                                value={JSON.stringify({
                                                                    course_Id: edth.course_Id,
                                                                    course_Code: edth.course_Code,
                                                                    course_Name: edth.course_Name
                                                                })}
                                                                onChange={(event) => handleEditTeachingChange(index, event)}
                                                            >
                                                                <option> Select Course </option>
                                                                {chooseCourse.map(cs => (
                                                                    <option key={cs.course_Id} value={JSON.stringify({
                                                                        course_Id: cs.course_Id,
                                                                        course_Code: cs.course_Code,
                                                                        course_Name: cs.course_Name
                                                                    })}>
                                                                        {cs.course_Code} {cs.course_Name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="topic_Notteach"
                                                                type="text"
                                                                value={edth.topic_Notteach}
                                                                onChange={(event) => handleEditTeachingChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="reason_Notteach"
                                                                type="text"
                                                                value={edth.reason_Notteach}
                                                                onChange={(event) => handleEditTeachingChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="edit_Teaching"
                                                                type="text"
                                                                value={edth.edit_Teaching}
                                                                onChange={(event) => handleEditTeachingChange(index, event)}
                                                            />
                                                        </td>
                                                        <td className="none">
                                                            <button className="open-course-delete" type="button" onClick={() => handleDeleteEditTeaching(index)}> - </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <label className="from-title4-obe7"> <b> 3.5.3 การวิเคราะห์รายวิชาที่เปิดสอน แต่ไม่มี นศ.ลงทะเบียนเรียน </b> </label>
                                        <button className="open-course-add" type="button" onClick={handleAddRegisterNotCourse}> + </button>
                                        <table className="table-open-course">
                                            <thead>
                                                <tr>
                                                    <th> รายวิชา </th>
                                                    <th> วิเคราะห์ปัจจัยที่มีผลต่อการดำเนินการของรายวิชา </th>
                                                    <th> แนวทางการปรับปรุง/แก้ไข </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notregiscourse.map((ntc, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="from-table01"
                                                                name="course_Id"
                                                                type="text"
                                                                value={JSON.stringify({
                                                                    course_Id: ntc.course_Id,
                                                                    course_Code: ntc.course_Code,
                                                                    course_Name: ntc.course_Name
                                                                })}
                                                                onChange={(event) => handleRegisterNotCourseChange(index, event)}
                                                            >
                                                                <option> Select Course </option>
                                                                {chooseCourse.map(cs => (
                                                                    <option key={cs.course_Id} value={JSON.stringify({
                                                                        course_Id: cs.course_Id,
                                                                        course_Code: cs.course_Code,
                                                                        course_Name: cs.course_Name
                                                                    })}>
                                                                        {cs.course_Code} {cs.course_Name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="analyze_Factors_Affect"
                                                                type="text"
                                                                value={ntc.analyze_Factors_Affect}
                                                                onChange={(event) => handleRegisterNotCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="guideline_Improvement"
                                                                type="text"
                                                                value={ntc.guideline_Improvement}
                                                                onChange={(event) => handleRegisterNotCourseChange(index, event)}
                                                            />
                                                        </td>
                                                        <td className="none">
                                                            <button className="open-course-delete" type="button" onClick={() => handleDeleteRegisterNotCourse(index)}> - </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* หมวดที่ 4 การบริหารหลักสูตร */}
                                <div className="mode4">
                                    <b> <p> หมวดที่ 4 การบริหารหลักสูตร </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 4.1 การบริหารหลักสูตร </b> </label>
                                        <button className="administrative-add" type="button" onClick={handleAddManageCurriculum}> + </button>
                                        <table className="table-administrative">
                                            <thead>
                                                <tr>
                                                    <th> ปัญหาอุปสรรคในการบริหารและจัดการหลักสูตร </th>
                                                    <th> ผลกระทบของปัญหาต่อผลสัมฤทธิ์ตามวัตถุประสงค์ของหลักสูตร </th>
                                                    <th> แนวทางการป้องกันและแก้ไขปัญหาในอนาคต </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {manageCurriculum.map((mc, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <textarea
                                                                className="from-table01"
                                                                name="problem_Name"
                                                                type="text"
                                                                value={mc.problem_Name}
                                                                onChange={(event) => handleManageCurriculumChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table01"
                                                                name="effect_Name"
                                                                type="text"
                                                                value={mc.effect_Name}
                                                                onChange={(event) => handleManageCurriculumChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table01"
                                                                name="protect_Name"
                                                                type="text"
                                                                value={mc.protect_Name}
                                                                onChange={(event) => handleManageCurriculumChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="administrative-delete" type="button" onClick={() => handleDeleteManageCurriculum(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 4.2 การเปลี่ยนแปลงภายในสถาบัน (ถ้ามี) ที่มีผลกระทบต่อหลักสูตรในช่วง 1 ปีที่ผ่านมา </b> </label>
                                        <input
                                            className="from-03"
                                            name="obe_Dscript_74201"
                                            type="text"
                                            value={formData.obe_Dscript_74201}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 4.3 การเปลี่ยนแปลงภายนอกสถาบัน (ถ้ามี) ที่มีผลกระทบต่อหลักสูตรในช่วง 1 ปีที่ผ่านมา </b> </label>
                                        <input
                                            className="from-03"
                                            name="obe_Dscript_74301"
                                            type="text"
                                            value={formData.obe_Dscript_74301}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* หมวดที่ 5 สรุปการประเมินหลักสูตรและคุณภาพการสอน */}
                                <div className="mode5">
                                    <b> <p> หมวดที่ 5 สรุปการประเมินหลักสูตรและคุณภาพการสอน </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 5.1 การประเมินหลักสูตรจากผู้ที่กำลังจะสำเร็จการศึกษา (รายงานตามปีที่สำรวจ) </b> </label>
                                        <button className="evaluate-add" type="button" onClick={handleAddCourseEvaluation}> + </button>
                                        <table className="table-evaluate">
                                            <thead>
                                                <tr>
                                                    <th> ข้อวิพากษ์ที่สำคัญจากผลการประเมิน </th>
                                                    <th> ข้อเสนอการเปลี่ยนแปลงในหลักสูตรจากผลการประเมิน </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courseEvalution.map((Cevl, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <textarea
                                                                className="from-table03"
                                                                name="improtant_Cri"
                                                                type="text"
                                                                value={Cevl.improtant_Cri}
                                                                onChange={(event) => handleCourseEvaluationChange(index, event)}
                                                            />

                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table03"
                                                                name="Propose_Chg"
                                                                type="text"
                                                                value={Cevl.Propose_Chg}
                                                                onChange={(event) => handleCourseEvaluationChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="evaluate-delete" type="button" onClick={() => handleDeleteCourseEvaluation(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 5.2 การประเมินหลักสูตรจากผู้มีส่วนได้ส่วนเสียต่อหลักสูตร </b> </label>
                                        <button className="evaluate-add" type="button" onClick={handleAddStakeHolder}> + </button> <br />
                                        <label className="from-mode-obe7"> โดยประเมินจาก </label>
                                        <input
                                            className="from-check1-obe7"
                                            name="people"
                                            type="checkbox"
                                            value="นักศึกษา"
                                            checked={formData.people.includes("นักศึกษา")}
                                            onChange={handleCheckboxHolderChange}
                                        />นักศึกษา
                                        <input
                                            className="from-check1-obe7"
                                            name="people"
                                            type="checkbox"
                                            value="ศิษย์เก่า"
                                            checked={formData.people.includes("ศิษย์เก่า")}
                                            onChange={handleCheckboxHolderChange}
                                        />ศิษย์เก่า
                                        <input
                                            className="from-check1-obe7"
                                            name="people"
                                            type="checkbox"
                                            value="ผู้ใช้บัณฑิต"
                                            checked={formData.people.includes("ผู้ใช้บัณฑิต")}
                                            onChange={handleCheckboxHolderChange}
                                        />ผู้ใช้บัณฑิต <br />
                                        <input
                                            className="from-check2-obe7"
                                            name="people"
                                            type="checkbox"
                                            value="อาจารย์และบุคลากรสายสนับสนุน"
                                            checked={formData.people.includes("อาจารย์และบุคลากรสายสนับสนุน")}
                                            onChange={handleCheckboxHolderChange}
                                        />อาจารย์และบุคลากรสายสนับสนุน
                                        <input
                                            className="from-check3-obe7"
                                            name="people"
                                            type="checkbox"
                                            value="อื่นๆ"
                                            checked={formData.people.includes("อื่นๆ")}
                                            onChange={handleCheckboxHolderChange}
                                        /> อื่นๆ
                                        {formData.people.includes("อื่นๆ") && (
                                            <input
                                                className="input-check4-obe7"
                                                name="obe_75201Other_Dscript"
                                                value={formData.obe_75201Other_Dscript}
                                                onChange={handleCheckboxHolderChange}
                                            />
                                        )}

                                        <table className="table-evaluate2">
                                            <thead>
                                                <tr>
                                                    <th> ข้อวิพากษ์ที่สำคัญจากผลการประเมิน </th>
                                                    <th> ข้อเสนอการเปลี่ยนแปลงในหลักสูตรจากผลการประเมิน </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stakeholdersEvl.map((stk, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <textarea
                                                                className="from-table03"
                                                                name="criticism"
                                                                type="text"
                                                                value={stk.criticism}
                                                                onChange={(event) => handleStakeHolderChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table03"
                                                                name="Propose_Chg"
                                                                type="text"
                                                                value={stk.Propose_Chg}
                                                                onChange={(event) => handleStakeHolderChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="evaluate-delete" type="button" onClick={() => handleDeleteStakeHolder(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 5.3 สรุปข้อคิดเห็นจากผู้มีส่วนได้ส่วนเสียต่อผลการเรียนรู้ที่คาดหวังของหลักสูตร (ELOs) </b> </label>
                                        <button className="evaluate-add" type="button" onClick={handleAddELOsComment}> + </button> <br />
                                        <label className="from-mode-obe7"> โดยประเมินจาก </label>
                                        <input
                                            className="from-check1-obe7"
                                            name="people_other"
                                            type="checkbox"
                                            value="นักศึกษา"
                                            checked={formData.people_other.includes("นักศึกษา")}
                                            onChange={handleCheckboxHolderChange}
                                        />นักศึกษา
                                        <input
                                            className="from-check1-obe7"
                                            name="people_other"
                                            type="checkbox"
                                            value="ศิษย์เก่า"
                                            checked={formData.people_other.includes("ศิษย์เก่า")}
                                            onChange={handleCheckboxHolderChange}
                                        />ศิษย์เก่า
                                        <input
                                            className="from-check1-obe7"
                                            name="people_other"
                                            type="checkbox"
                                            value="ผู้ใช้บัณฑิต"
                                            checked={formData.people_other.includes("ผู้ใช้บัณฑิต")}
                                            onChange={handleCheckboxHolderChange}
                                        />ผู้ใช้บัณฑิต <br />
                                        <input
                                            className="from-check2-obe7"
                                            name="people_other"
                                            type="checkbox"
                                            value="อาจารย์และบุคลากรสายสนับสนุน"
                                            checked={formData.people_other.includes("อาจารย์และบุคลากรสายสนับสนุน")}
                                            onChange={handleCheckboxHolderChange}
                                        />อาจารย์และบุคลากรสายสนับสนุน
                                        <input
                                            className="from-check3-obe7"
                                            name="people_other"
                                            type="checkbox"
                                            value="อื่นๆ"
                                            checked={formData.people_other.includes("อื่นๆ")}
                                            onChange={handleCheckboxHolderChange}
                                        /> อื่นๆ
                                        {formData.people_other.includes("อื่นๆ") && (
                                            <input
                                                className="input-check4-obe7"
                                                name="obe_75301Other_Dscript"
                                                value={formData.obe_75301Other_Dscript}
                                                onChange={handleCheckboxHolderChange}
                                            />
                                        )}

                                        <table className="table-evaluate3">
                                            <thead>
                                                <tr>
                                                    <th> ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (Expected Learning Outcomes: ELO) </th>
                                                    <th> ความเห็นของผู้มีส่วนได้ส่วนเสียต่อนักศึกษาของหลักสูตร </th>
                                                    <th> แผน/แนวทางการปรับปรุงเพื่อให้นักศึกษาบรรลุ ELOs </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {elo_comment.map((cm, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="elo_Id"
                                                                type="text"
                                                                value={cm.elo_Id}
                                                                onChange={(event) => handleELOsCommentChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="comment_Student_elo"
                                                                type="text"
                                                                value={cm.comment_Student_elo}
                                                                onChange={(event) => handleELOsCommentChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="improvement_elo"
                                                                type="text"
                                                                value={cm.improvement_elo}
                                                                onChange={(event) => handleELOsCommentChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="evaluate1-delete" type="button" onClick={() => handleDeleteELOsComment(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 5.4 การประเมินคุณภาพหลักสูตรตามกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ </b> </label>
                                        <table className="table-Dscript75400">
                                            <thead>
                                                <tr>
                                                    <th colSpan="3"> ผลการดำเนินงานตามกรอบมาตรฐานคุณวุฒิ </th>
                                                </tr>
                                                <tr>
                                                    <th> ดัชนีบ่งชี้ผลการดำเนินงาน </th>
                                                    <th> ผลการดำเนินงาน </th>
                                                    <th> คำอธิบายหรือหลักฐานอ้างอิง </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {qualifications.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <textarea
                                                                className="from-table04"
                                                                name="indicators"
                                                                type="text"
                                                                value={item.indicators || ''}
                                                                onChange={(e) => handleQualificationChange(index, 'indicators', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table04"
                                                                name="performance"
                                                                type="text"
                                                                value={item.performance || ''}
                                                                onChange={(e) => handleQualificationChange(index, 'performance', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table04"
                                                                name="explanation"
                                                                type="text"
                                                                value={item.explanation || ''}
                                                                onChange={(e) => handleQualificationChange(index, 'explanation', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* หมวดที่ 6 ข้อคิดเห็น และข้อเสนอแนะเกี่ยวกับคุณภาพหลักสูตรจากผู้ประเมินอิสระ */}
                                <div className="mode6">
                                    <b> <p> หมวดที่ 6 ข้อคิดเห็น และข้อเสนอแนะเกี่ยวกับคุณภาพหลักสูตรจากผู้ประเมินอิสระ </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 6.1 ข้อคิดเห็นหรือสาระที่ได้รับการเสนอแนะจากผู้ประเมิน และความเห็นของหลักสูตร/ผู้รับผิดชอบหลักสูตรต่อข้อคิดเห็น </b> </label>
                                        <button className="comment-add" type="button" onClick={handleAddSuggestEvaluator}> + </button>
                                        <table className="table-comment">
                                            <thead>
                                                <tr>
                                                    <th colSpan="2"> ข้อคิดเห็นที่ได้รับการเสนอแนะจากผู้ประเมินอิสระ </th>
                                                    <th rowSpan="2"> ความเห็น/ผู้รับผิดชอบหลักสูตรต่อข้อคิดเห็นที่ได้รับการเสนอแนะ </th>
                                                </tr>
                                                <tr>
                                                    <th> ผู้ประเมิน คือ </th>
                                                    <th> ความคิดเห็น </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {suggestevalutor.map((sg, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="Assessor"
                                                                type="text"
                                                                value={sg.Assessor}
                                                                onChange={(event) => handleSuggestEvaluatorChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="idea"
                                                                type="text"
                                                                value={sg.idea}
                                                                onChange={(event) => handleSuggestEvaluatorChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="content"
                                                                type="text"
                                                                value={sg.content}
                                                                onChange={(event) => handleSuggestEvaluatorChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="comment-delete" type="button" onClick={() => handleDeleteSuggestEvaluator(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 6.2 การนำไปดำเนินการเพื่อการวางแผนหรือปรับปรุงหลักสูตร </b> </label>
                                        <input
                                            className="from-03"
                                            name="obe_76201_Dscript"
                                            type="text"
                                            value={formData.obe_76201_Dscript}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* หมวดที่ 7 ข้อคิดเห็น และข้อเสนอแนะเกี่ยวกับคุณภาพหลักสูตรจากผู้ประเมินอิสระ */}
                                <div className="mode7">
                                    <b> <p> หมวดที่ 7 ข้อคิดเห็น และข้อเสนอแนะเกี่ยวกับคุณภาพหลักสูตรจากผู้ประเมินอิสระ </p> </b> <br />

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 7.1 ความก้าวหน้าของการดำเนินงานตามแผนที่เสนอในรายงานของปีที่ผ่านมา </b> </label>
                                        <button className="comment-add" type="button" onClick={handleAddProgress}> + </button>
                                        <table className="table-comment1">
                                            <thead>
                                                <tr>
                                                    <th> แผนดำเนินการ </th>
                                                    <th> วันสิ้นสุดการดำเนินการตามแผน </th>
                                                    <th> ผู้รับผิดชอบ </th>
                                                    <th> ผลการดำเนินการสำเร็จหรือไม่สำเร็จ </th>
                                                    <th> เหตุผลที่ไม่สามารถดำเนินการให้สำเร็จ </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {progress.map((ps, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="action_plan"
                                                                type="text"
                                                                value={ps.action_plan}
                                                                onChange={(event) => handleProgressChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="deadline"
                                                                type="text"
                                                                value={ps.deadline}
                                                                onChange={(event) => handleProgressChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="responsible"
                                                                type="text"
                                                                value={ps.responsible}
                                                                onChange={(event) => handleProgressChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="operationResult"
                                                                type="text"
                                                                value={ps.operationResult}
                                                                onChange={(event) => handleProgressChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table01"
                                                                name="unsuccess"
                                                                type="text"
                                                                value={ps.unsuccess}
                                                                onChange={(event) => handleProgressChange(index, event)}
                                                            />
                                                        </td>
                                                        <button className="comment-delete" type="button" onClick={() => handleDeleteProgress(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-title-obe7"> <b> 7.2 ข้อเสนอในการพัฒนาหลักสูตร </b> </label>
                                        <label className="from-mode-small"> 7.2.1 ข้อเสนอในการปรับโครงสร้างหลักสูตร (จำนวนหน่วยกิต รายวิชาแกน รายวิชาเลือกฯ) </label>
                                        <input
                                            className="from-obe7-small"
                                            name="obe_77201_Dscript"
                                            type="text"
                                            value={formData.obe_77201_Dscript}
                                            onChange={handleInputChange}
                                        />
                                        <label className="from-mode-small"> 7.2.2 ข้อเสนอในการเปลี่ยนแปลงรายวิชา (การเปลี่ยนแปลง เพิ่มหรือลดเนื้อหาในรายวิชา การเปลี่ยนแปลงวิธีการสอนและการประเมินผลสัมฤทธิ์รายวิชาฯ) </label>
                                        <input
                                            className="from-obe7-small"
                                            name="obe_77202_Dscript"
                                            type="text"
                                            value={formData.obe_77202_Dscript}
                                            onChange={handleInputChange}
                                        />
                                        <label className="from-mode-small"> 7.2.3 กิจกรรมการพัฒนาคณาจารย์และบุคลากรสายสนับสนุน </label>
                                        <input
                                            className="from-obe7-small"
                                            name="obe_77203_Dscript"
                                            type="text"
                                            value={formData.obe_77203_Dscript}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-title5-obe7">
                                            <label> <b> 7.3 แผนปฏิบัติการใหม่สำหรับปี </b> </label>
                                            <input
                                                className="from-input-obe7"
                                                name="plan_next_year"
                                                type="text"
                                                value={formData.plan_next_year}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                        <label> (ระบุแผนสำหรับปีการศึกษาถัดไป) </label>
                                        <button className="comment1-add" type="button" onClick={handleAddNewEducation}> + </button>
                                        <table className="table-comment2">
                                            <thead>
                                                <tr>
                                                    <th> แผนปฏิบัติการ </th>
                                                    <th> วันที่คาดว่าจะสิ้นสุดแผน </th>
                                                    <th> ผู้รับผิดชอบ </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newEducations.map((edu, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <textarea
                                                                className="from-comment"
                                                                name="actionPlanName"
                                                                type="text"
                                                                value={edu.actionPlanName}
                                                                onChange={(event) => handleNewEducationChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-comment"
                                                                name="deadlinePlan"
                                                                type="text"
                                                                value={edu.deadlinePlan}
                                                                onChange={(event) => handleNewEducationChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="from-comment"
                                                                name="Responsible"
                                                                type="text"
                                                                value={edu.Responsible}
                                                                onChange={(event) => handleNewEducationChange(index, event)}
                                                            >
                                                                <option> Select Instructor </option>
                                                                {instructor.map((instructors, i) => (
                                                                    <option key={i} value={instructors}>
                                                                        {instructors}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <button className="comment1-delete" type="button" onClick={() => handleDeleteNewEducation(index)}>-</button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </form>

                        {/* Function Button Fill Out Document OBE 7 */}
                        <div className="button-container">
                            {/* Save Data OBE 7 */}
                            <button className="button-save-obe7" type="button" onClick={handleSaveData}> Save </button>

                            {/* Download OBE 7 */}
                            <button className="button-download-obe7" type="button" onClick={handleDownloadPDF}> PDF </button>
                            {showPdf && (<RenderPDF />)}
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}

export default Fill_obe7;