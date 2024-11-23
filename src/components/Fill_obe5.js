import React, { useState, useEffect, useContext } from "react";
import { pdf } from "@react-pdf/renderer";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

/* CSS */
import Fill5 from '../style/Fill5.css';

/* Component AuthContext */
import AuthContext from './AuthContext';

/* Component MyDocument5 (PDF) */
import MyDocument5 from './MyDocument5';

import axios from "axios";

function Fill_obe5() {

    /* Function Authentication User OBE 5 */
    const { user } = useContext(AuthContext);

    /* Function ข้อมูล FromData */
    const [formData, setFormData] = useState({
        college: '',
        campus: '',
        faculty: '',
        department_Name: '',
        study_Area: '',

        /* Mode 1 */
        course_Id: '',
        courseNamecode: '',
        course_Credit: '',
        curriculum_Name: '',
        branch: '',
        course_Category: '',
        responsible_Teacher: '',
        semster_term: '',
        year_of_study: '',
        prerequisites: '',
        corequisites: '',
        obe_latestC: '',

        /* Mode 2 */
        report_Overtime: '',
        topic_Overtime: '',

        /* Mode 4 */
        abnormal_Score: '',
        other4_4_4_Description: '',

        /* Mode 5 */
        resourceIssue: '',
        administrativeIssues: '',

        /* Mode 6 */
        evaluation_Students: '',
        evaluation_Teacher: '',
        evaluation_Other: '',
        comment_Teacher_6222: '',

        /* Mode 7 */
        improveTeaching7_1: '',
        recomment7_2: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const [userIds, setUserIds] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [availableUserIds, setAvailableUserIds] = useState([]);

    const [courseId, setCourseId] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/selectcourse');
                if (response.data && Array.isArray(response.data.course)) {
                    setCourseId(response.data.course);
                }
            } catch (error) {
                console.error('Error Fetching Courses:', error);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchUserIds = async () => {
            if (!selectedCourseId) return;
            try {
                const response = await axios.get(`http://localhost:8081/api/getCourseUserIds/${selectedCourseId}`);
                const users = response.data.users;
                setAvailableUserIds(users);
            } catch (error) {
                console.error('Error fetching user IDs:', error);
            }
        };
        fetchUserIds();
    }, [selectedCourseId]);

    const fetchOBEData = async () => {
        if (!selectedCourseId || !selectedUserId) {
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/api/obe3/${selectedCourseId}/${selectedUserId}`);
            const obe3Data = response.data.obe3Data;

            if (!obe3Data) {
                console.error('No OBE 3 Data Found for the Selected Course and User.');
                return;
            }

            setFormData({
                college: obe3Data.university_Name || '',
                campus: obe3Data.campusObe3 || '',
                faculty: obe3Data.facultyObe3 || '',
                department_Name: obe3Data.departmentObe3 || '',
                study_Area: obe3Data.obe3_studyArea || '',
                course_Id: obe3Data.course_Id || '',
                courseNamecode: obe3Data.courseNameCode || '',
                course_Credit: obe3Data.obe3_Credit || '',
                curriculum_Name: obe3Data.obe3_Curriculum || '',
                branch: obe3Data.obe3_branch || '',
                course_Category: obe3Data.obe3_courseCategory || '',
                responsible_Teacher: obe3Data.responsible_Teacher || '',
                semster_term: obe3Data.obe3_semster || '',
                year_of_study: obe3Data.obe3_yearstudy || '',
                prerequisites: obe3Data.obe3_prereq || '',
                corequisites: obe3Data.obe3_coreq || '',
                obe_latestC: obe3Data.obe3_latestC || '',
            });

            setDataBoxValue({
                compare_teach_bl: obe3Data.compare_teach_bl,
                outsider_teach_bl: obe3Data.outsider_teach_bl,
                reseach_bl: obe3Data.reseach_bl,
                society_bl: obe3Data.society_bl,
                culture_bl: obe3Data.culture_bl,
            })

            setInstructors(response.data.instructors);
        } catch (error) {
            console.error('Error fetching OBE Data:', error);
        }
    };

    const fetchCLOs = async () => {
        if (!selectedCourseId || !selectedUserId) {
            console.error('Course ID or User ID is missing');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8081/api/clos/${selectedCourseId}/${selectedUserId}`);
            const dataCLOs = response.data.results;

            if (!dataCLOs || dataCLOs.length === 0) {
                console.error('No Course Learning Outcome Data Found for the Selected Course and User.');
                return;
            }

            setCLOs(dataCLOs.map(clo => ({
                clo_Id: clo.clo_Id,
                clo_code: clo.clo_code,
                clo_Name: clo.clo_Name,
                cloCodeName: `${clo.clo_code} ${clo.clo_Name}`,
            })));
        } catch (error) {
            console.error('Error fetching Course Learning Outcome Data:', error);
        }
    };

    useEffect(() => {
        if (selectedCourseId && selectedUserId) {
            fetchOBEData();
            fetchCLOs();
        }
    }, [selectedCourseId, selectedUserId]);

    const [yearobe5, setYearobe5] = useState([]);
    const [selectyearobe5, setselectyearobe5] = useState([]);

    useEffect(() => {
        const fetchyearobe5 = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/yearobe5');
                setYearobe5(response.data.results);
            } catch (error) {
                console.error('Error Fetching Years:', error);
            }
        };
        fetchyearobe5();
    }, [])

    const [obeData, setObeData] = useState(null);
    const [obe5Ids, setObe5Ids] = useState('');

    const fetchobe5 = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/dataobe5', {
                params: {
                    user_Id: user.user_Id,
                    course_Id: selectedCourseId,
                    year: selectyearobe5
                },
            });

            const data = response.data.results && response.data.results[0];
            console.log('Results:', response.data.result);
            if (data) {
                setObeData(data);
                setObe5Ids(data.obe5_Id);
                alert('ดึงข้อมูลมาเรียบร้อย');
            } else {
                alert("No Data Found.");
            }
        } catch (error) {
            console.error('Error Fetching OBE 5 data:', error);
        }
    }

    const handleSearch = () => {
        if (selectedCourseId && selectyearobe5) {
            fetchobe5();
        } else {
            alert('Please Select Year and Course');
        }
    }

    useEffect(() => {
        if (obeData) {
            const obeinfo = obeData;

            setFormData(prevFormData => ({
                ...prevFormData,
                report_Overtime: obeinfo.report_Overtime,
                topic_Overtime: obeinfo.topic_Overtime,
                abnormal_Score: obeinfo.abnormal_Score,
                other4_4_4_Description: obeinfo.other4_4_4_description || '',
                resourceIssue: obeinfo.resourceIssue,
                administrativeIssues: obeinfo.administrativeIssues,
                evaluation_Students: obeinfo.evaluation_Student,
                evaluation_Teacher: obeinfo.evaluation_Teacher,
                evaluation_Other: obeinfo.evaluation_Other,
                comment_Teacher_6222: obeinfo.comment_Teacher_6222,
                improveTeaching7_1: obeinfo.improveTeaching7_1,
                recomment7_2: obeinfo.recomment7_2,
            }));

            setDataBoxValue(prevDataBoxValue => ({
                ...prevDataBoxValue,
                comit_course_bl: obeinfo.comit_course_bl,
                check_Depart_bl: obeinfo.check_Depart_bl,
                check_Teacher_bl: obeinfo.check_Teacher_bl,
                other4_4_4_bl: obeinfo.other4_4_4_bl === 1,
            }));
        }
    }, [obeData])

    const fetchfmtive = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/datafmtive', {
                params: { obe5_Id: obe5Ids }
            });

            if (response.data.results && response.data.results.length > 0) {
                setFormative(response.data.results);
                setAssignfmtive(response.data.results[0]);
            }
            console.log('Fetch Data Formative Successful');
        } catch (error) {
            console.error('Error Fetching Latest Formative Data:', error);
        }
    }

    const fetchsummative = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/datasummative', {
                params: { obe5_Id: obe5Ids }
            });

            if (response.data.results && response.data.results.length > 0) {
                setSummatives(response.data.results);
            }
            console.log('Fetch Data Summative Successful');
        } catch (error) {
            console.error('Error Fetching Latest Summative Data:', error);
        }
    }

    const fetchplanover = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/dataevlplan', {
                params: { obe5_Id: obe5Ids }
            });

            if (response.data.results && response.data.results.length > 0) {
                setDiscrepancy(response.data.results);
            }
            console.log('Fetch Data Plan Over Successful');
        } catch (error) {
            console.error('Error Fetching Latest Plan Over Data:', error);
        }
    }

    const fetchsupport = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/datasupport', {
                params: { obe5_Id: obe5Ids }
            });

            if (response.data.results && response.data.results.length > 0) {
                setSupport(response.data.results);
            }
            console.log('Fetch Data Support Successful');
        } catch (error) {
            console.error('Error Fetching Latest Support Data:', error);
        }
    }

    const handleSearchLatest = (e) => {
        e.preventDefault();
        fetchsupport();
        fetchfmtive();
        fetchsummative();
        fetchplanover();
    }

    /* Function ข้อมูลอาจารย์ผู้สอน */
    const [instructors, setInstructors] = useState([
        { course_instructor: '' }
    ]);

    const handleAddInstructor = () => {
        setInstructors([...instructors, { course_instructor: '' }]);
    };

    const handleDeleteInstructor = (index) => {
        const newInstructors = [...instructors];
        newInstructors.splice(index, 1);
        setInstructors(newInstructors);
    };

    const handleInstructorChange = (index, value) => {
        const updatedInstructors = instructors.map((inst, i) =>
            i === index ? { ...inst, course_instructor: value } : inst
        );
        setInstructors(updatedInstructors);
    };

    /* Function ข้อมูลสิ่งสนับสนุน */
    const SupportOBE5 = [
        { support_Name: '1. เอกสารประกอบการสอนที่เป็นปัจจุบัน', support_Operation: '', support_NotOperation: '', support_Improvement: '' },
        { support_Name: '2. การใช้เทคโนโลยีสารสนเทศ', support_Operation: '', support_NotOperation: '', support_Improvement: '' },
        { support_Name: '3. ระบบในการทราบปัญหา', support_Operation: '', support_NotOperation: '', support_Improvement: '' },
        { support_Name: '4. ระบบช่วยเหลือนักศึกษาที่มีปัญหา', support_Operation: '', support_NotOperation: '', support_Improvement: '' },
    ];

    const [Support, setSupport] = useState(SupportOBE5);

    const handleAddSupport = (e) => {
        e.preventDefault();
        setSupport([...Support, { support_Name: '', support_Operation: '', support_NotOperation: '', support_Improvement: '' }]);
    };

    const handleDeleteSupport = (index) => {
        const newSupport = Support.filter((_, i) => i !== index);
        setSupport(newSupport);
    };

    const handleSupportChange = (index, field, value) => {
        const newSupport = [...Support];
        newSupport[index][field] = value;
        setSupport(newSupport);
    }

    const handleSaveSupport = async (obe5_Id) => {
        try {
            const supportRq = Support.map((sp, index) => {

                const sup = {
                    support_Name: sp.support_Name,
                    support_Operation: sp.support_Operation,
                    support_NotOperation: sp.support_NotOperation,
                    support_Improvement: sp.support_Improvement,
                    course_Id: selectedCourseId,
                    obe5_Id: obe5_Id,
                }

                console.log(`Sending Data from Support Learning Index ${index}:`, sup);
                return axios.post('http://localhost:8081/api/Support', sup);
            });

            const responses = await Promise.all(supportRq);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Support Learning ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for Support Learning ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function Checkbox Data Value */
    const [DataBoxValue, setDataBoxValue] = useState({
        compare_teach_bl: false,
        outsider_teach_bl: false,
        reseach_bl: false,
        society_bl: false,
        culture_bl: false,
        comit_course_bl: false,
        check_Depart_bl: false,
        check_Teacher_bl: false,
        other4_4_4_bl: false,
    })

    const handleCheckBoxValue = (e) => {
        const { name, checked } = e.target;
        setDataBoxValue((prevValues) => ({
            ...prevValues,
            [name]: checked,
        }));
    };

    const handleOtherTextChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    /* Function ข้อมูล CLOs */
    const [CLOs, setCLOs] = useState([{
        clo_Id: '',
        clo_code: '',
        clo_Name: '',
        cloCodeName: '',
    }])

    const handleAddCLOs = (e) => {
        e.preventDefault();
        setCLOs([...CLOs, { clo_Name: '', clo_code: '', clo_Id: '', cloCodeName: '' }])
    };

    const handleDeleteCLOs = (index) => {
        if (CLOs.length > 1) {
            const deleteCLO = [...CLOs];
            deleteCLO.splice(index, 1);
            setCLOs(deleteCLO);
        } else {
            alert("Cannot Delete the Last CLOs");
        }
    };

    const handleCLOsChange = (index, field, value) => {
        const updatedCLOs = CLOs.map((clo, i) =>
            i === index ? {
                ...clo,
                [field]: value,
                cloCodeName: `${field === 'clo_code' ? value : clo.clo_code} ${field === 'clo_Name' ? value : clo.clo_Name}`
            } : clo
        );
        setCLOs(updatedCLOs);
    };

    /* Function ข้อมูลประสิทธิผลของวิธีการจัดการเรียนรู้ */
    const [effectives, setEffectives] = useState([{
        effectOn_Student: false,
        experience_Name: '',
        teaching_Method_Set: '',
        measuring_Name: '',
        measurement_Method: '',
        improve_Clo: ''
    }]);

    const handleEffectiveChange = (CLOindex, Fieldname, value, checked, type) => {
        const updatedEffectives = [...effectives];
        const newValue = type === 'text' ? value : type === 'checkbox' ? checked : value;

        updatedEffectives[CLOindex] = {
            ...updatedEffectives[CLOindex],
            [Fieldname]: newValue,
        };

        setEffectives(updatedEffectives);
    };

    const handleSaveROL = async (obe5_Id) => {
        try {
            const ROL = effectives.map((ef, index) => {

                const effective = {
                    clo_Id: CLOs[index].clo_Id,
                    effectOn_Student: ef.effectOn_Student,
                    experience_Name: ef.experience_Name,
                    teaching_Method_Set: ef.teaching_Method_Set,
                    measuring_Name: ef.measuring_Name,
                    measurement_Method: ef.measurement_Method,
                    improve_Clo: ef.improve_Clo,
                    course_Id: selectedCourseId,
                    obe5_Id: obe5_Id,
                }

                console.log(`Sending Data for Document Results of Learning Index ${index}:`, effective);
                return axios.post('http://localhost:8081/api/ROL', effective);
            });

            const responses = await Promise.all(ROL);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Results of Learning ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Results of Learning ${index}: `, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function การประเมินผลแบบ Formative Evaluation */
    const [assignfmtive, setAssignfmtive] = useState({
        fmtive_assign: '',
    });

    const handleAssignfmtive = (e) => {
        const { checked, value } = e.target;

        if (checked) {
            setAssignfmtive((prevValues) => ({
                ...prevValues,
                fmtive_assign: prevValues.fmtive_assign === value ? '' : value,
            }));
        } else {
            setAssignfmtive((prevValues) => ({
                ...prevValues,
                fmtive_assign: prevValues.fmtive_assign === value ? '' : value,
            }));
        }
    };

    /* Function Formative Evaluation */
    const FormativeEvalution = [
        { fmtive_Name: 'ก. กำหนดระยะเวลา/ช่วงเวลาประเมินชัดเจน', fmtive_setplan: null, fmtive_develop: '' },
        { fmtive_Name: 'ข. กำหนดเครื่องมือที่ใช้ ถ้ามี ระบุเครื่องมือที่ใช้', fmtive_setplan: null, fmtive_develop: '' },
        { fmtive_Name: 'ค. มีการให้ข้อมูลป้อนกลับแก่นักศึกษารายบุคคล', fmtive_setplan: null, fmtive_develop: '' },
        { fmtive_Name: 'ง. นำผลประเมินมาวางแผนเพื่อพัฒนานักศึกษา', fmtive_setplan: null, fmtive_develop: '' },
    ];

    const [formatives, setFormative] = useState(FormativeEvalution);

    const handleFormativeCheckbox = (index, value) => {
        const newfmtiveBox = [...formatives];
        newfmtiveBox[index].fmtive_setplan = newfmtiveBox[index].fmtive_setplan === value ? null : value;
        setFormative(newfmtiveBox);
    }

    const handleFormativeChange = (index, field, value) => {
        const newfmtive = [...formatives];
        newfmtive[index][field] = value;
        setFormative(newfmtive);
    }

    const handleAppendNameChange = (index, value) => {
        const newfmtive = [...formatives];
        newfmtive[index].fmtive_Name = newfmtive[index].fmtive_Name + value;
        setFormative(newfmtive);
    }

    const handleSaveFormative = async (obe5_Id) => {
        try {
            const FMTive = formatives.map((fmts, index) => {

                const formative = {
                    fmtive_assign: assignfmtive.fmtive_assign,
                    fmtive_Name: fmts.fmtive_Name,
                    fmtive_setplan: fmts.fmtive_setplan,
                    fmtive_develop: fmts.fmtive_develop,
                    course_Id: selectedCourseId,
                    obe5_Id: obe5_Id,
                }

                console.log(`Sending Data for Document Results Formative Evalution ${index} Complete`);
                return axios.post('http://localhost:8081/api/formative', formative);
            })

            const responses = await Promise.all(FMTive);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Formative Evaluation ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Formative Evaluation ${index}:`, response.statusText);
                }
            })
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function Summative Evaluation */
    const SummativeEvalution = [
        { smtive_Name: '1. ใช้การวัดผลด้วยการสอบ', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: 'ก. กำหนด Table of Specification', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: 'ข. ทบทวนข้อสอบก่อนนำไปใช้', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: 'ค. วิเคราะห์ข้อสอบ', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: 'ง. จัดทำคลังข้อสอบ', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: '2. จัดทำ Rubrics เป็นเครื่องมือในการวัดผล', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: '3. กำหนดเกณฑ์ตัดสินผลการประเมินไว้ชัดเจน', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: '4. ใช้ระบบการตัดสินผล/การตัดเกรดที่เป็นไปตามมาตรฐาน', smtive_setplan: null, smtive_Develop: '' },
        { smtive_Name: '5. จัดการทวนสอบการวัดและประเมินผลลัพธ์การเรียน', smtive_setplan: null, smtive_Develop: '' },
    ];

    const [summatives, setSummatives] = useState(SummativeEvalution);

    const [addsmtives, setAddSummatives] = useState({
        smtiverule: '',
        smtivegroup: '',
        smtiveother: '',
    });

    const [showOtherInput, setShowOtherInput] = useState(false);

    const handleAddSummative = (field, value) => {
        setAddSummatives(prevState => ({
            ...prevState,
            [field]: value,
        }));
    }

    const handleSummativeCheckbox = (index, value) => {
        const newSumatives = [...summatives];
        newSumatives[index].smtive_setplan = newSumatives[index].smtive_setplan === value ? null : value;
        setSummatives(newSumatives);
    }

    const handleSummativeChange = (index, field, value) => {
        const newSumatives = [...summatives];
        newSumatives[index][field] = value;
        setSummatives(newSumatives);
    }

    const handleOtherInputChange = (value) => {
        setAddSummatives(prevState => ({
            ...prevState,
            smtiveother: value
        }));
    }

    const handleToggleOtherInput = () => {
        setShowOtherInput(prevShow => !prevShow);
        if (showOtherInput) {
            handleOtherInputChange('');
        }
    }

    const handleSaveSummative = async (obe5_Id) => {
        try {
            const SMTive = summatives.map((smts, index) => {

                const summative = {
                    smtive_Name: smts.smtive_Name,
                    smtive_setplan: smts.smtive_setplan,
                    smtive_Develop: smts.smtive_Develop,
                    course_Id: selectedCourseId,
                    obe5_Id: obe5_Id,
                }

                console.log(`Sending Data for Document Summative Evaluation ${index} Complete`);
                return axios.post('http://localhost:8081/api/summative', summative);
            })

            const responses = await Promise.all(SMTive);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Summative Evaluation ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Summative Evaluation ${index}:`, response.statusText);
                }
            })
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    useEffect(() => {
        const newSummatives = [...summatives];

        let newName = newSummatives[7].smtive_Name.split(' - ')[0];

        const { smtiverule, smtivegroup, smtiveother } = addsmtives;
        const additionalValues = [smtiverule, smtivegroup, smtiveother].filter(Boolean).join(' - ');

        if (additionalValues) {
            newName += ` - ${additionalValues}`;
        }

        newSummatives[7].smtive_Name = newName;
        setSummatives(newSummatives);
    }, [addsmtives]);

    /* Function Image Input */
    const [imgFile, setImgFile] = useState({
        result_of_Teach: null
    });

    const handleDeleteFile = () => {
        setImgFile({ result_of_Teach: null });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile({ result_of_Teach: file });
        }
    };

    const handleSaveImg = async (obe5_Id) => {
        const data = new FormData();

        data.append('results_Of_Teach', imgFile.result_of_Teach || "");
        data.append('obe5_Id', obe5_Id)

        try {
            const response = await fetch('http://localhost:8081/api/roltech', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Response Message:', result.message);
        } catch (error) {
            console.error('Error Uploading File:', error);
        }
    }

    /* Function ความคลาดเคลื่อนจากแผนการประเมิน */
    const [discrepancy, setDiscrepancy] = useState(Array.from({ length: 3 }, () => ({
        learning_outcome: '',
        planed_Evalution: '',
        actual_Evalution: '',
        planed_EvalutionWeek: '',
        actual_EvalutionWeek: '',
        planned_Assessment: '',
        actual_Assessment: '',
    })));


    const handleAddDiscrepancy = () => {
        setDiscrepancy([...discrepancy, {
            learning_outcome: '',
            planed_Evalution: '',
            actual_Evalution: '',
            planed_EvalutionWeek: '',
            actual_EvalutionWeek: '',
            planned_Assessment: '',
            actual_Assessment: '',
        }]);
    };

    const handleDeleteDiscrepancy = index => {
        const updatedDiscrepancy = [...discrepancy];
        updatedDiscrepancy.splice(index, 1);
        setDiscrepancy(updatedDiscrepancy);
    };

    const handleDiscrepancyChange = (index, field, value) => {
        const updateDiscrepancy = [...discrepancy];
        updateDiscrepancy[index][field] = value;
        setDiscrepancy(updateDiscrepancy);
    };

    const handleSaveEvalplan = async (obe5_Id) => {
        try {
            const evlplan = discrepancy.map((dis, index) => {

                const evalutionplan = {
                    learning_outcome: dis.learning_outcome,
                    planed_Evalution: dis.planed_Evalution,
                    actual_Evalution: dis.actual_Evalution,
                    planed_EvalutionWeek: dis.planed_EvalutionWeek,
                    actual_EvalutionWeek: dis.actual_EvalutionWeek,
                    planned_Assessment: dis.planned_Assessment,
                    actual_Assessment: dis.actual_Assessment,
                    obe5_Id: obe5_Id,
                }

                console.log(`Sending Data for Document Evaluation Plan ${index} Complete`);
                return axios.post('http://localhost:8081/api/evlplan', evalutionplan);
            })

            const responses = await Promise.all(evlplan);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Evaluation Plan ${index} Complete`);
                } else {
                    console.error(`Failed to Save for Document Evaluation Plan ${index}:`, response.statusText);
                }
            })
        } catch (error) {
            console.error('Error Saving Data');
        }
    }

    /* Function Resize Input */
    const [description1, setDescription1] = useState('');
    const [description2, setDescription2] = useState('');
    const [description3, setDescription3] = useState('');
    const [description4, setDescription4] = useState('');
    const [description5, setDescription5] = useState('');
    const [description6, setDescription6] = useState('');
    const [description7, setDescription7] = useState('');
    const [description8, setDescription8] = useState('');

    const handleResize = (event, setDescription) => {
        setDescription(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    /* Function Save Data OBE 5 */
    const handleSaveOBE5 = async () => {
        try {
            const dataOBE5 = {
                user_Id: user.user_Id,
                university_Name: formData.college,
                campusObe5: formData.campus,
                facultyObe5: formData.faculty,
                departmentObe5: formData.department_Name,
                obe5_studyArea: formData.study_Area,
                course_Id: selectedCourseId,
                courseNamecode: formData.courseNamecode,
                obe5_Credit: formData.course_Credit,
                obe5_Curriculum: formData.curriculum_Name,
                obe5_branch: formData.branch,
                obe5_courseCategory: formData.course_Category,
                obe5_semster: formData.semster_term,
                obe5_yearstudy: formData.year_of_study,
                obe5_prereq: formData.prerequisites,
                obe5_coreq: formData.corequisites,
                obe_latestC: formData.obe_latestC,
                report_Overtime: formData.report_Overtime,
                topic_Overtime: formData.topic_Overtime,
                abnormal_Score: formData.abnormal_Score,
                other4_4_4_description: formData.other4_4_4_Description,
                resourceIssue: formData.resourceIssue,
                administrativeIssues: formData.administrativeIssues,
                evaluation_Student: formData.evaluation_Students,
                evaluation_Teacher: formData.evaluation_Teacher,
                evaluation_Other: formData.evaluation_Other,
                comment_Teacher_6222: formData.comment_Teacher_6222,
                improveTeaching7_1: formData.improveTeaching7_1,
                recomment7_2: formData.recomment7_2,
                compare_teach_bl: DataBoxValue.compare_teach_bl,
                outsider_teach_bl: DataBoxValue.outsider_teach_bl,
                reseach_bl: DataBoxValue.reseach_bl,
                society_bl: DataBoxValue.society_bl,
                culture_bl: DataBoxValue.culture_bl,
                comit_course_bl: DataBoxValue.comit_course_bl,
                check_Depart_bl: DataBoxValue.check_Depart_bl,
                check_Teacher_bl: DataBoxValue.check_Teacher_bl,
                other4_4_4_bl: DataBoxValue.other4_4_4_bl,
            }

            const response = await fetch('http://localhost:8081/api/obe5', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(dataOBE5),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                console.log('Data Outcome-Based Education 5 Saved Successful', responseData);
                return responseData.obe5_Id;
            } else {
                console.error('Failed to Save Data Outcome-Based Education 5');
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    const [OBE5Ids, setOBE5Ids] = useState(null);

    const handleSaveData = async (e) => {
        e.preventDefault();

        const userConfirmed = window.confirm('โปรดตรวจสอบข้อมูลก่อนบันทึก! คุณต้องการบันทึกข้อมูลต่อหรือไม่?');

        if (!userConfirmed) {
            return;
        }

        const obe5_Id = await handleSaveOBE5()

        if (obe5_Id) {
            console.log('Successfull Saved OBE 5:', obe5_Id);
            setOBE5Ids(obe5_Id);

            await handleSaveSupport(obe5_Id);
            await handleSaveROL(obe5_Id);
            await handleSaveFormative(obe5_Id);
            await handleSaveSummative(obe5_Id);
            await handleSaveImg(obe5_Id);
            await handleSaveEvalplan(obe5_Id);
        } else {
            console.error('Error Saving All Data Document');
        }
    };

    /* Function Download PDF */
    const RenderPDF = async (e) => {
        e.preventDefault();

        const selectedInstructorNames = instructors

            .map(inst => `${inst.user_FirstName} ${inst.user_LastName}`)
            .filter(name => name !== null && name !== '');

        console.log('Instructors:', selectedInstructorNames);

        const doc = (
            <MyDocument5
                formData={formData}
                DataBoxValue={DataBoxValue}
                selectedInstructorNames={selectedInstructorNames}
                Support={Support}
                CLOs={CLOs}
                effectives={effectives}
                assignfmtive={assignfmtive}
                formatives={formatives}
                summatives={summatives}
                addsmtives={addsmtives}
                showOtherInput={showOtherInput}
                imgFile={imgFile}
                discrepancy={discrepancy}
            />
        );

        const blob = await pdf(doc).toBlob();

        const Data = new FormData();
        const fileSize = blob.size;
        const fileName = `${formData.courseNamecode}.pdf`;

        Data.append('pdfFile', blob, fileName);
        Data.append('fileSize', fileSize);
        Data.append('fileName', fileName);
        Data.append('obe5Id', OBE5Ids)

        const response = await fetch(`http://localhost:8081/api/pdf5`, {
            method: 'POST',
            body: Data
        });

        if (response.status === 200) {
            console.log('PDF Outcome-Based Education5 Uploaded on Database Successful');
        } else {
            console.error('Failed to Upload PDF Outcome-Based Education 5');
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };

    return (
        <>
            <div className={Fill5}>

                <div className="fill5-container">
                    <div className="fill5-bar">

                        <div className="fill5-obe">
                            <button className="name-obe5" type="button"> OBE 5 </button>
                        </div>

                        <div className="name-head-obe5">
                            <b> <p> รายงานผลการดำเนินการของรายวิชา </p> </b>
                        </div>

                        {/* Select Course OBE 3 From User */}
                        <div className="select-subject-obe3">
                            <label className="select-course-head"> * เลือกวิชาและผู้ใช้งาน เพื่อดึงข้อมูลจาก Outcome-Based Education 3 * </label>

                            <div className="select-course-container">
                                <select className="select-course-obe3" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                                    <option value=""> Select Course </option>
                                    {Array.isArray(courseId) && courseId.map((course) => (
                                        <option key={course.course_Id} value={course.course_Id}>
                                            {course.course_Code} - {course.course_Name}
                                        </option>
                                    ))}
                                </select>

                                <select className="select-user-obe3" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                                    <option value="">Select User</option>
                                    {availableUserIds.map((user) => (
                                        <option key={user.user_Id} value={user.user_Id}>
                                            {user.user_Id} - {user.user_FirstName} - {user.user_LastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pull Data OBE 5 */}
                        <div className="from-group">
                            <label className="select-course-head"> * เลือกปีในกรณีมีข้อมูล Outcome-Based Education 5 * </label>

                            <div className="input-group">
                                <select
                                    id="yearselect"
                                    value={selectyearobe5}
                                    onChange={(e) => setselectyearobe5(e.target.value)}
                                >
                                    <option value=""> Select Year </option>
                                    {yearobe5.map((item) => (
                                        <option key={item.year} value={item.year}>
                                            {item.year}
                                        </option>
                                    ))}
                                </select>
                                <button className="btn-search" onClick={handleSearch}> Search OBE 5 </button>
                            </div>
                        </div>

                        <form>
                            <div className="input-container-obe5">

                                <label className="from-title-obe5"> <b> ชื่อสถาบันอุดมศึกษา </b>
                                    <input
                                        className="from-college-obe5"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>

                                <label className="from-title-obe5">
                                    <label> <b> วิทยาเขต </b> </label>
                                    <input
                                        className="from-input-obe5"
                                        name="campus"
                                        type="text"
                                        value={formData.campus}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label> <b> คณะ </b> </label>
                                    <input
                                        className="from-input-obe5"
                                        name="faculty"
                                        type="text"
                                        value={formData.faculty}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label> <b> ภาควิชา </b> </label>
                                    <input
                                        className="from-inputs-obe5"
                                        name="department_Name"
                                        type="text"
                                        value={formData.department_Name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>

                                {/* หมวดที่ 1 ข้อมูลทั่วไป */}
                                <div className="mode1">
                                    <b> <p> หมวดที่ 1 ข้อมูลทั่วไป </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. รหัสและชื่อรายวิชา </b> </label>
                                        <input
                                            className="from-course-obe5"
                                            name="courseNamecode"
                                            type="text"
                                            value={formData.courseNamecode}
                                            onChange={handleInputChange}
                                            placeholder='รหัสและชื่อรายวิชา'
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. จำนวนหน่วยกิต </b> </label>
                                        <input
                                            className="from-credit-obe5"
                                            name="course_Credit"
                                            type="number"
                                            value={formData.course_Credit}
                                            onChange={handleInputChange}
                                            min={1} max={3}
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 3. หลักสูตรและประเภทของรายวิชา </b> </label>
                                        <label className="form-name-obe5"> หลักสูตร
                                            <input
                                                className="from-obe5"
                                                name="curriculum_Name"
                                                type="text"
                                                value={formData.curriculum_Name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                        <label> สาขาวิชา
                                            <input
                                                className="from-obe5"
                                                name="branch"
                                                type="text"
                                                value={formData.branch}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                        <label> เป็นรายวิชา
                                            <input
                                                className="from-obe5"
                                                name="course_Category"
                                                type="text"
                                                value={formData.course_Category}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 4. อาจารย์ผู้รับผิดชอบรายวิชาและอาจารย์ผู้สอน </b> </label>
                                        <label className="form-name1-obe5"> อาจารย์ผู้รับผิดชอบรายวิชา </label>
                                        <input
                                            className="from1-obe5"
                                            name="responsible_Teacher"
                                            type="text"
                                            value={formData.responsible_Teacher}
                                            onChange={handleInputChange}
                                            placeholder="ชื่ออาจารย์ผู้รับผิดชอบรายวิชา"
                                            required
                                        /> <br />

                                        <label className="form-name2-obe5"> อาจารย์ผู้สอน </label>
                                        <button className="add-button-obe5" onClick={handleAddInstructor}> <FontAwesomeIcon icon={faPlus} /> </button>
                                        {instructors.map((inst, index) => (
                                            <div key={index}>
                                                <input
                                                    className="from2-obe5"
                                                    name="course_Instructor"
                                                    type="text"
                                                    value={`${inst.user_FirstName || ''} ${inst.user_LastName || ''}`}
                                                    onChange={(e) => handleInstructorChange(index, e.target.value)}
                                                    placeholder="ชื่ออาจารย์ผู้สอน"
                                                    required
                                                />
                                                {instructors.length > 1 && (
                                                    <button className="delete-button-obe5" onClick={() => handleDeleteInstructor(index)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 5. ภาคการศึกษา/ชั้นปีที่เรียน </b> </label>
                                        <label className="form-name3-obe5"> ภาคการศึกษา </label>
                                        <input
                                            className="from-semester-obe5"
                                            name="semster_term"
                                            type="text"
                                            value={formData.semster_term || ''}
                                            onChange={handleInputChange}
                                            min={1} max={3}
                                            required
                                        />
                                        <label className="form-name3-obe5"> ของชั้นปีที่
                                            <input
                                                className="from-year-obe5"
                                                name="year_of_study"
                                                type="number"
                                                value={formData.year_of_study}
                                                onChange={handleInputChange}
                                                min={1} max={8}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 6. รายวิชาบังคับก่อน (Pre-requisite) (ถ้ามี) </b> </label>
                                        <input
                                            className="from0-obe5"
                                            name="prerequisites"
                                            type="text"
                                            value={formData.prerequisites}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 7. รายวิชาที่ต้องเรียนพร้อมกัน (Co-requisites) (ถ้ามี) </b> </label>
                                        <input
                                            className="from0-obe5"
                                            name="corequisites"
                                            type="text"
                                            value={formData.corequisites}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 8. สถานที่เรียน </b> </label>
                                        <label className="form-name-obe5"> คณะ/วิทยาลัย
                                            <input
                                                className="from5-obe5"
                                                name="study_Area"
                                                type="text"
                                                value={formData.study_Area}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </label>
                                        <label> มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 9. ข้อมูลประกอบการประกันคุณภาพการศึกษา </b> </label>
                                        <input
                                            className="from-check-obe5"
                                            name="compare_teach_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.compare_teach_bl}
                                            onChange={handleCheckBoxValue}
                                        /> การเรียนการสอนในรายวิชานี้มีส่วนที่ได้รับการพัฒนาขึ้นใหม่หรือปรับปรุงจากที่สอนเมื่อครั้งก่อน <br />
                                        <input
                                            className="from-check-obe5"
                                            name="outsider_teach_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.outsider_teach_bl}
                                            onChange={handleCheckBoxValue}
                                        /> รายวิชานี้มีการให้ผู้มีประสบการณ์ทางวิชาการหรือวิชาชีพจากหน่วยงานภายนอกเข้ามามีส่วนร่วมในกระบวนการเรียนการสอน <br />
                                        <input
                                            className="from-check-obe5"
                                            name="reseach_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.reseach_bl}
                                            onChange={handleCheckBoxValue}
                                        /> รายวิชานี้มีการบูรณาการกระบวนการวิจัยกับการจัดการเรียนการสอน หรือการจัดการเรียนรู้ที่พัฒนาจากการวิจัย <br />
                                        <input
                                            className="from-check-obe5"
                                            name="society_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.society_bl}
                                            onChange={handleCheckBoxValue}
                                        /> รายวิชานี้มีการบูรณาการงานบริการทางวิชาการแก่สังคมกับการเรียนการสอน <br />
                                        <input
                                            className="from-check-obe5"
                                            name="culture_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.culture_bl}
                                            onChange={handleCheckBoxValue}
                                        /> รายวิชานี้มีการบูรณาการงานด้านทำนุบำรุงศิลปะและวัฒนธรรมกับการจัดการเรียนการสอนและกิจกรรมนักศึกษา
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 10. วันที่จัดทำหรือปรับปรุงรายละเอียดของรายวิชาครั้งล่าสุด </b> </label>
                                        <input
                                            className="from0-obe5"
                                            name="obe_latestC"
                                            type="text"
                                            value={formData.obe_latestC}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* หมวดที่ 2 การจัดการเรียนการสอนที่เปรียบเทียบกับแผนการสอน */}
                                <div className="mode2">
                                    <b> <p> หมวดที่ 2 การจัดการเรียนการสอนที่เปรียบเทียบกับแผนการสอน </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. รายงานชั่วโมงการสอนจริงที่คลาดเคลื่อนจากแผนการสอน (ถ้ามี) </b> </label>
                                        <input
                                            className="from4-obe5"
                                            name="report_Overtime"
                                            type="text"
                                            value={formData.report_Overtime}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. หัวข้อที่สอนไม่ครอบคลุมตามแผน (ถ้ามี) </b> </label>
                                        <input
                                            className="from4-obe5"
                                            name="topic_Overtime"
                                            type="text"
                                            value={formData.topic_Overtime}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-modes"> <b> 3. จัดสิ่งสนับสนุนเพื่อประสิทธิผลในการเรียนรู้ของนักศึกษา </b> </label>
                                        <button className="add-support-obe5" onClick={handleAddSupport}> <FontAwesomeIcon icon={faPlus} /> </button>
                                        <table className="table-support">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2"> สิ่งสนับสนุน </th>
                                                    <th colSpan="3"> ผลการดำเนินการ </th>
                                                </tr>
                                                <tr>
                                                    <th> มีการดำเนินการ </th>
                                                    <th> ไม่ได้ดำเนินการ </th>
                                                    <th> แผนการปรับปรุง </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Support.map((sp, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-table-support1"
                                                                name={`support_Name${index}`}
                                                                type="text"
                                                                value={sp.support_Name || ''}
                                                                onChange={(e) => handleSupportChange(index, 'support_Name', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table-support2"
                                                                name={`support_Operation${index}`}
                                                                type="text"
                                                                value={sp.support_Operation || ''}
                                                                onChange={(e) => handleSupportChange(index, 'support_Operation', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table-support2"
                                                                name={`support_NotOperation${index}`}
                                                                type="text"
                                                                value={sp.support_NotOperation || ''}
                                                                onChange={(e) => handleSupportChange(index, 'support_NotOperation', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table-support2"
                                                                name={`support_Improvement${index}`}
                                                                type="text"
                                                                value={sp.support_Improvement || ''}
                                                                onChange={(e) => handleSupportChange(index, 'support_Improvement', e.target.value)}
                                                            />
                                                        </td>
                                                        <button className="delete-support-obe5" onClick={() => handleDeleteSupport(index)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-modes"> <b> 4. ผลลัพธ์การเรียนรู้ของรายวิชา (Course Learning Outcomes: CLOs) : นักศึกษาสามารถ </b> </label>
                                        <button className="add-button-obe5" onClick={handleAddCLOs}> <FontAwesomeIcon icon={faPlus} /> </button>
                                        {CLOs.map((clos, CLOindex) => (
                                            <div key={CLOindex}>
                                                <input
                                                    className="from-clo-obe5"
                                                    name={`clo_code_${CLOindex}`}
                                                    type="text"
                                                    value={clos.clo_code || ''}
                                                    onChange={(e) => handleCLOsChange(CLOindex, 'clo_code', e.target.value)}
                                                    placeholder="รหัสเลข CLOs"
                                                    required
                                                />
                                                <input
                                                    className="from-clo-name-obe5"
                                                    name={`clo_Name${CLOindex}`}
                                                    type="text"
                                                    value={clos.clo_Name || ''}
                                                    onChange={(e) => handleCLOsChange(CLOindex, 'clo_Name', e.target.value)}
                                                    placeholder="ชื่อ CLOs"
                                                    required
                                                />
                                                <button className="delete-button-obe5" onClick={() => handleDeleteCLOs(CLOindex)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="description">
                                        <label className="from-mode-obe5"> <b> 5. ประสิทธิผลของวิธีการจัดการเรียนรู้และวิธีการประเมินผลที่ดำเนินการเพื่อทำให้เกิดผลลัพธ์การเรียนรู้ตามที่ระบุในรายละเอียดรายวิชา </b> </label>
                                        <table className="table-effective">
                                            <thead>
                                                <tr>
                                                    <th> ผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) </th>
                                                    <th> ผลที่เกิดกับนักศึกษาตาม CLOs (บรรลุ/ ไม่บรรลุ) </th>
                                                    <th> วิธีการจัดการสอน/ประสบการณ์การเรียนรู้ตาม CLOs </th>
                                                    <th> วิธีการจัดการสอน (เหมาะสม/ไม่เหมาะสม) </th>
                                                    <th> วิธีการวัดผลลัพธ์การเรียนรู้ ตาม CLOs </th>
                                                    <th> วิธีการวัดผล (เหมาะสม/ไม่เหมาะสม) </th>
                                                    <th> แนวทางการพัฒนาปรับปรุง เพื่อให้นักศึกษาบรรลุตามแต่ละ CLO หรือแนวทางที่ทำให้มีวิธีการจัดการสอนหรือวิธีการวัดผลลัพธ์การเรียนรู้ที่เหมาะสม </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {CLOs.map((clo, CLOindex) => (
                                                    <tr key={CLOindex}>
                                                        <td>
                                                            <input
                                                                className="from-table-effective"
                                                                name={`cloCodeName${CLOindex}`}
                                                                type="text"
                                                                value={`${clo.clo_code} ${clo.clo_Name} `}
                                                                key={clo.clo_Id}
                                                                onChange={(e) => handleCLOsChange(CLOindex, 'cloCodeName', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-check-effective"
                                                                name={`effectOn_Student${CLOindex}`}
                                                                type="checkbox"
                                                                value={effectives[CLOindex]?.effectOn_Student || false}
                                                                onChange={(event) => handleEffectiveChange(CLOindex, 'effectOn_Student', null, event.target.checked, 'checkbox')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table1-effective"
                                                                name={`experience_Name${CLOindex}`}
                                                                type="text"
                                                                value={effectives[CLOindex]?.experience_Name || ''}
                                                                onChange={(event) => handleEffectiveChange(CLOindex, 'experience_Name', event.target.value, null, 'text')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="from-select-effective"
                                                                name={`teaching_Method_Set${CLOindex}`}
                                                                value={effectives[CLOindex]?.teaching_Method_Set || ''}
                                                                onChange={(event) => handleEffectiveChange(CLOindex, 'teaching_Method_Set', event.target.value, null, 'text')}
                                                                required
                                                            >
                                                                <option className="from-option-obe5" value="-"> Please Choose </option>
                                                                <option className="from-option-obe5" value="เหมาะสม"> เหมาะสม </option>
                                                                <option className="from-option-obe5" value="ไม่เหมาะสม"> ไม่เหมาะสม </option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table1-effective"
                                                                name={`measuring_Name${CLOindex}`}
                                                                type="text"
                                                                value={effectives[CLOindex]?.measuring_Name || ''}
                                                                onChange={(event) => handleEffectiveChange(CLOindex, 'measuring_Name', event.target.value, null, 'text')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="from-select-effective"
                                                                name={`measurement_Method${CLOindex}`}
                                                                value={effectives[CLOindex]?.measurement_Method || ''}
                                                                onChange={(event) => handleEffectiveChange(CLOindex, 'measurement_Method', event.target.value, null, 'text')}
                                                                required
                                                            >
                                                                <option className="from-option-obe5" value="-"> Please Choose </option>
                                                                <option className="from-option-obe5" value="เหมาะสม"> เหมาะสม </option>
                                                                <option className="from-option-obe5" value="ไม่เหมาะสม"> ไม่เหมาะสม </option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table1-effective"
                                                                name={`improve_Clo${CLOindex}`}
                                                                type="text"
                                                                value={effectives[CLOindex]?.improve_Clo || ''}
                                                                onChange={(event) => handleEffectiveChange(CLOindex, 'improve_Clo', event.target.value, null, 'text')}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* หมวดที่ 3 ระบบการวัดและการประเมินผลการเรียนรู้ */}
                                <div className="mode3">
                                    <b> <p> หมวดที่ 3 ระบบการวัดและการประเมินผลการเรียนรู้ </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. การประเมินผลแบบ Formative Evaluation : </b> </label>
                                        <input
                                            className="from-assign-obe5"
                                            name="fmtive_assign"
                                            type="checkbox"
                                            value={`มีการประเมิน`}
                                            onChange={handleAssignfmtive}
                                            checked={assignfmtive.fmtive_assign === 'มีการประเมิน'}
                                        /> มีการประเมิน (กรุณาให้ข้อมูลในตาราง เพิ่มเติม)
                                        <input
                                            className="from-assign-obe5"
                                            name="fmtive_assign"
                                            type="checkbox"
                                            value={`ไม่มีการประเมิน`}
                                            onChange={handleAssignfmtive}
                                            checked={assignfmtive.fmtive_assign === 'ไม่มีการประเมิน'}
                                        /> ไม่มีการประเมิน

                                        <table className="table-formative">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2"> วิธีจัดการประเมินผลแบบ Formative Evaluation </th>
                                                    <th colSpan="2"> แผนที่กำหนดไว้ </th>
                                                    <th rowSpan="2"> แนวทางการปรับปรุงพัฒนา </th>
                                                </tr>
                                                <tr>
                                                    <th> มี </th>
                                                    <th> ไม่มี </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formatives.map((fmt, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="from-fmt">
                                                                <input
                                                                    className="from-formative"
                                                                    name={`fmtive_Name${index}`}
                                                                    type="text"
                                                                    value={fmt.fmtive_Name || ''}
                                                                    onChange={(e) => handleFormativeChange(index, 'fmtive_Name', e.target.value)}
                                                                />
                                                                {(index === 1 || index === 2) && (
                                                                    <input
                                                                        className="from-formative"
                                                                        name={`append_fmtive_Name${index}`}
                                                                        type="text"
                                                                        placeholder="เพิ่มข้อมูล"
                                                                        onBlur={(e) => handleAppendNameChange(index, e.target.value)}
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-choice"
                                                                name={`fmtive_setplan${index}`}
                                                                type="checkbox"
                                                                checked={fmt.fmtive_setplan === 1}
                                                                onChange={() => handleFormativeCheckbox(index, 1)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-choice"
                                                                name={`fmtive_setplan${index}`}
                                                                type="checkbox"
                                                                checked={fmt.fmtive_setplan === 0}
                                                                onChange={() => handleFormativeCheckbox(index, 0)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-guideline"
                                                                name={`fmtive_develop${index}`}
                                                                type="text"
                                                                value={fmt.fmtive_develop || ''}
                                                                onChange={(e) => handleFormativeChange(index, 'fmtive_develop', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. การประเมินผลแบบ Summative Evaluation : </b> </label>
                                        <label className="label-name"> มาตรฐานและการประกันคุณภาพระบบการวัดและประเมินผลลัพธ์การเรียนรู้ของนักศึกษา </label>
                                        <table className="table-summative">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2"> กระบวนการวัดและประเมินผลลัพธ์การเรียนรู้ </th>
                                                    <th colSpan="2"> การดำเนินการ </th>
                                                    <th rowSpan="2"> แนวทางการพัฒนาคุณภาพ </th>
                                                </tr>
                                                <tr>
                                                    <th> มี </th>
                                                    <th> ไม่มี </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {summatives.map((smt, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-summative"
                                                                name={`smtive_Name${index}`}
                                                                type="text"
                                                                value={smt.smtive_Name || ''}
                                                                onChange={(e) => handleSummativeChange(index, 'smtive_Name', e.target.value)}
                                                            />
                                                            {index === 7 && (
                                                                <div className="from-smt">
                                                                    <input
                                                                        className="from-standard"
                                                                        name={`smtiverule`}
                                                                        type="checkbox"
                                                                        value="อิงเกณฑ์"
                                                                        checked={addsmtives.smtiverule === "อิงเกณฑ์"}
                                                                        onChange={(e) => handleAddSummative('smtiverule', e.target.checked ? e.target.value : '')}
                                                                    /> อิงเกณฑ์
                                                                    <input
                                                                        className="from-standard"
                                                                        name={`smtivegroup`}
                                                                        type="checkbox"
                                                                        value="อิงกลุ่ม"
                                                                        checked={addsmtives.smtivegroup === "อิงกลุ่ม"}
                                                                        onChange={(e) => handleAddSummative('smtivegroup', e.target.checked ? e.target.value : '')}
                                                                    /> อิงกลุ่ม
                                                                    <input
                                                                        className="from-standard"
                                                                        name="smtiveotherCheckbox"
                                                                        type="checkbox"
                                                                        checked={showOtherInput}
                                                                        onChange={handleToggleOtherInput}
                                                                    /> อื่นๆ
                                                                    {showOtherInput && (
                                                                        <input
                                                                            className="from-summative-other"
                                                                            name={`smtiveother`}
                                                                            type="text"
                                                                            value={addsmtives.smtiveother}
                                                                            onChange={(e) => handleOtherInputChange(e.target.value)}
                                                                            placeholder="ระบุอื่นๆ"
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-choice"
                                                                name={`smtive_setplan${index}`}
                                                                type="checkbox"
                                                                checked={smt.smtive_setplan === 1}
                                                                onChange={() => handleSummativeCheckbox(index, 1)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-choice"
                                                                name={`smtive_setplan${index}`}
                                                                type="checkbox"
                                                                checked={smt.smtive_setplan === 0}
                                                                onChange={() => handleSummativeCheckbox(index, 0)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-guideline"
                                                                name={`smtive_Develop${index}`}
                                                                type="text"
                                                                value={smt.smtive_Develop || ''}
                                                                onChange={(e) => handleSummativeChange(index, 'smtive_Develop', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* หมวดที่ 4 สรุปผลการจัดการเรียนการสอนของรายวิชา */}
                                <div className="mode4">
                                    <b> <p> หมวดที่ 4 สรุปผลการจัดการเรียนการสอนของรายวิชา </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. ผลการจัดการเรียนการสอนของรายวิชา </b> </label>
                                        <label className="button-choose" htmlFor="file-upload"> <span> Choose File </span> </label>
                                        <input
                                            className="from-file"
                                            name="result_of_Teach"
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {imgFile.result_of_Teach && (
                                            <div>
                                                <img className="show-file" src={URL.createObjectURL(imgFile.result_of_Teach)} />
                                                <button className="file-delete" onClick={handleDeleteFile}> Remove File </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. ปัจจัยที่ทำให้ระดับคะแนนผิดปกติ (ถ้ามี) </b> </label>
                                        <input
                                            className="from4-obe5"
                                            name="abnormal_Score"
                                            type="text"
                                            value={formData.abnormal_Score}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-modes"> <b> 3. ความคลาดเคลื่อนจากแผนการประเมินที่กำหนดไว้ในรายละเอียดรายวิชาทั้งด้านกำหนดเวลาและวิธีการประเมินผล (ถ้ามี) </b> </label>
                                        <button className="add-button-obe5" onClick={handleAddDiscrepancy}> <FontAwesomeIcon icon={faPlus} /> </button>
                                        <table className="table-discrepancy">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2"> ผลการเรียนรู้ </th>
                                                    <th colSpan="2"> วิธีการประเมิน </th>
                                                    <th colSpan="2"> สัปดาห์ที่ประเมิน </th>
                                                    <th colSpan="2"> สัดส่วนของการประเมิน </th>
                                                </tr>
                                                <tr>
                                                    <th> ตามแผน </th>
                                                    <th> ตามจริง </th>
                                                    <th> ตามแผน </th>
                                                    <th> ตามจริง </th>
                                                    <th> ตามแผน </th>
                                                    <th> ตามจริง </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {discrepancy.map((dsp, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-table-discrepancy"
                                                                name={`learning_outcome${index}`}
                                                                type="text"
                                                                value={dsp.learning_outcome || ''}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'learning_outcome', event.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table1-discrepancy"
                                                                name={`planed_Evalution${index}`}
                                                                type="text"
                                                                value={dsp.planed_Evalution || ''}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'planed_Evalution', event.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table1-discrepancy"
                                                                name={`actual_Evalution${index}`}
                                                                type="text"
                                                                value={dsp.actual_Evalution}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'actual_Evalution', event.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table1-discrepancy"
                                                                name={`planed_EvalutionWeek${index}`}
                                                                type="text"
                                                                value={dsp.planed_EvalutionWeek}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'planed_EvalutionWeek', event.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table1-discrepancy"
                                                                name={`actual_EvalutionWeek${index}`}
                                                                type="text"
                                                                value={dsp.actual_EvalutionWeek}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'actual_EvalutionWeek', event.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table1-discrepancy"
                                                                name={`planned_Assessment${index}`}
                                                                type="text"
                                                                value={dsp.planned_Assessment}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'planned_Assessment', event.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table1-discrepancy"
                                                                name={`actual_Assessment${index}`}
                                                                type="text"
                                                                value={dsp.actual_Assessment}
                                                                onChange={(event) => handleDiscrepancyChange(index, 'actual_Assessment', event.target.value)}
                                                            />
                                                        </td>
                                                        <button className="delete-button-obe5" onClick={() => handleDeleteDiscrepancy(index)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 4. การทวนสอบผลสัมฤทธิ์ของนักศึกษา </b> </label>
                                        <input
                                            className="from-check-obe5"
                                            name="comit_course_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.comit_course_bl}
                                            onChange={handleCheckBoxValue}
                                        /> มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินผลลัพธ์การเรียนรู้ของนักศึกษา โดยวิธีการให้คะแนนสอบคะแนนพฤติกรรม <br />
                                        <input
                                            className="from-check-obe5"
                                            name="check_Depart_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.check_Depart_bl}
                                            onChange={handleCheckBoxValue}
                                        /> การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ <br />
                                        <input
                                            className="from-check-obe5"
                                            name="check_Teacher_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.check_Teacher_bl}
                                            onChange={handleCheckBoxValue}
                                        /> การทวนสอบการให้คะแนนจากการสุ่มตรวจผลงานของนักศึกษาโดยอาจารย์ หรือผู้ทรงคุณวุฒิอื่นๆที่ไม่ใช่อาจารย์ประจำหลักสูตร <br />
                                        <input
                                            className="from-check-obe5"
                                            name="other4_4_4_bl"
                                            type="checkbox"
                                            checked={DataBoxValue.other4_4_4_bl}
                                            onChange={handleCheckBoxValue}
                                        />
                                        <label className="other-obe5"> อื่นๆ(ระบุ) </label>
                                        {DataBoxValue.other4_4_4_bl && (
                                            <input
                                                className="from-other-obe5"
                                                name="other4_4_4_Description"
                                                value={formData.other4_4_4_Description}
                                                onChange={handleOtherTextChange}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* หมวดที่ 5 ปัญหาและผลกระทบต่อการดำเนินการ */}
                                <div className="mode5">
                                    <b> <p> หมวดที่ 5 ปัญหาและผลกระทบต่อการดำเนินการ </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> 1. ประเด็นด้านทรัพยากรประกอบการเรียนและสิ่งอำนวยความสะดวก (ถ้ามี) </label>
                                        <textarea
                                            className="from4-obe5"
                                            name="resourceIssue"
                                            type="text"
                                            value={formData.resourceIssue}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription1)}
                                        />
                                    </div>
                                    <div className="description">
                                        <label className="from-mode"> 2. ประเด็นด้านการบริหารจัดการ (ถ้ามี) </label>
                                        <textarea
                                            className="from4-obe5"
                                            name="administrativeIssues"
                                            type="text"
                                            value={formData.administrativeIssues}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription2)}
                                        />
                                    </div>
                                </div>

                                {/* หมวดที่ 6 การประเมินรายวิชา */}
                                <div className="mode6">
                                    <b> <p> หมวดที่ 6 การประเมินรายวิชา </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. ผลการประเมินรายวิชาโดยนักศึกษา (แนบเอกสาร) </b> </label>
                                        <label className="from-obe5-small-name"> 1.1 ข้อวิพากษ์ที่สำคัญจากผลการประเมินโดยนักศึกษา </label>
                                        <textarea
                                            className="from-obe5-small"
                                            name="evaluation_Students"
                                            type="text"
                                            value={formData.evaluation_Students}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription3)}
                                        />

                                        <label className="from-obe5-small-name"> 1.2 ความเห็นของอาจารย์ผู้สอนต่อข้อวิพากษ์ตามข้อ 1.1 </label>
                                        <textarea
                                            className="from-obe5-small"
                                            name="evaluation_Teacher"
                                            type="text"
                                            value={formData.evaluation_Teacher}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription4)}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. ผลการประเมินรายวิชาโดยวิธีอื่น </b> </label>
                                        <label className="from-obe5-small-name"> 2.1 ข้อวิพากษ์ที่สำคัญจากผลการประเมินโดยวิธีอื่น </label>
                                        <textarea
                                            className="from-obe5-small"
                                            name="evaluation_Other"
                                            type="text"
                                            value={formData.evaluation_Other}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription5)}
                                        />

                                        <label className="from-obe5-small-name"> 2.2 ความเห็นของอาจารย์ผู้สอนต่อข้อวิพากษ์ตามข้อ 2.1 </label>
                                        <textarea
                                            className="from-obe5-small"
                                            name="comment_Teacher_6222"
                                            type="text"
                                            value={formData.comment_Teacher_6222}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription6)}
                                        />
                                    </div>
                                </div>

                                {/* หมวดที่ 7 แผนการปรับปรุง */}
                                <div className="mode7">
                                    <b> <p> หมวดที่ 7 แผนการปรับปรุง </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. การดำเนินการเพื่อการปรับปรุงการเรียนการสอน/รายวิชา (นอกเหนือจากที่ระบุไว้ในหมวดที่ 2) </b> </label>
                                        <textarea
                                            className="from4-obe5"
                                            name="improveTeaching7_1"
                                            type="text"
                                            value={formData.improveTeaching7_1}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription7)}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. ข้อเสนอแนะของอาจารย์ผู้รับผิดชอบรายวิชาต่ออาจารย์ผู้รับผิดชอบหลักสูตร </b> </label>
                                        <textarea
                                            className="from4-obe5"
                                            name="recomment7_2"
                                            type="text"
                                            value={formData.recomment7_2}
                                            onChange={handleInputChange}
                                            onInput={(event) => handleResize(event, setDescription8)}
                                        />
                                    </div>
                                </div>

                            </div>
                        </form>

                        {/* Function Button Fill Out Document OBE 5 */}
                        <div className="button-container">
                            {/* Save Data OBE 5 */}
                            <button className="button-save-obe5" type="button" onClick={handleSaveData}> Save </button>

                            {/* Download OBE 5 */}
                            <button className="button-download-obe5" type="button" onClick={RenderPDF}> Download </button>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}

export default Fill_obe5;