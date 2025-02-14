import React, { useState, useEffect, useContext } from "react";
import { pdf } from "@react-pdf/renderer";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

/* img */
import Logo from '../img/Logo.png';

/* CSS */
import Fill3 from '../style/Fill3.css';

/* Component AuthContext */
import AuthContext from "./AuthContext";

/* Component MyDocument3 (PDF) */
import MyDocument3 from './MyDocument3';

import axios from 'axios';

function Fill_obe3() {

    /* Function Authentication User OBE 3 */
    const { user } = useContext(AuthContext);

    const [courseData, setCourseData] = useState([]);

    const [showData, setShowData] = useState({
        course_Id: '',
        course_Code: '',
        course_Name: '',
        course_NameEng: '',
        course_Description: '',
        course_DescriptionEng: '',
        course_Credit: '',
        course_Category: '',
        responsible_Teacher: '',
        semster_term: '',
        year_of_study: '',
        prerequisites: '',
        corequisites: '',
        study_Area: '',
        selectedCourse: '',
        college: '',
        campus: '',
        faculty: '',
        department_Name: '',
        curriculum_Name: '',
        branch: '',
    })

    /* Function Suggested Course OBE 3 */
    const [suggestCourse, setSuggestCourse] = useState([]);

    const handleShowInputChange = (e) => {
        const { name, value } = e.target;

        if (value && value.length >= 1) {
            const suggestData = courseData.filter((data) =>
                Array.isArray(data.course_Code) && data.course_Code.includes(value) ||
                data.course_Name.includes(value) ||
                data.course_NameEng.includes(value)
            );
            setSuggestCourse(suggestData);
        }

        setShowData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setFormDataOBE3((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchSuggestedCourse = async () => {
            try {
                const suggestedResponse = await axios.get('http://localhost:8081/api/course');

                setCourseData(suggestedResponse.data);
                setSuggestCourse(suggestedResponse.data);
            } catch (error) {
                console.error('Error Fetching Course Data:', error);
            }
        };
        fetchSuggestedCourse()
    }, []);

    const [instructors, setInstructors] = useState([]);
    const [selectedIns, setSelectedIns] = useState(['']);

    const handleAddInstructor = () => {
        setSelectedIns([...selectedIns, ""]);
    };

    const handleDeleteInstructor = (index) => {
        const newSelectedIns = selectedIns.filter((_, idx) => idx !== index);
        setSelectedIns(newSelectedIns);
    };

    const handleInstructorInputChange = (index, value) => {
        console.log(`Instructor Selected at Index ${index}: ${value}`);

        const newSelectedIns = [...selectedIns];
        newSelectedIns[index] = value;
        setSelectedIns(newSelectedIns);

        console.log("Updated Selected Instructor:", newSelectedIns);
    };

    const fetchInstructors = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/course/users/${courseId}`);
            setInstructors(response.data);
            console.log('Instructors:', response.data);
        } catch (error) {
            console.error(`Error Fetching Instructors for Course Id ${courseId}:`, error);
        }
    };

    const handleSuggestedCourseChange = (selectedData) => {

        console.log('Selected Course:', selectedData);

        if (selectedData && selectedData.course_Code) {
            console.log('Selected Course Code:', selectedData.course_Code);

            const courseNamecode = `${selectedData.course_Code} ${selectedData.course_Name} ${selectedData.course_NameEng}`;

            setShowData((prevData) => ({
                ...prevData,
                course_Id: selectedData.course_Id,
                course_Code: selectedData.course_Code,
                course_Name: selectedData.course_Name,
                course_NameEng: selectedData.course_NameEng,
                selectedCourse: selectedData.course_Code,
                course_Description: selectedData.course_Description,
                course_DescriptionEng: selectedData.course_DescriptionEng,
                course_Credit: selectedData.course_Credit,
                course_Category: selectedData.course_Category,
                responsible_Teacher: selectedData.responsible_Teacher,
                semster_term: selectedData.semster_term,
                year_of_study: selectedData.year_of_study,
                prerequisites: selectedData.prerequisites,
                corequisites: selectedData.corequisites,
                study_Area: selectedData.study_Area,
                college: selectedData.college,
                campus: selectedData.campus,
                faculty: selectedData.faculty,
                department_Name: selectedData.department_Name,
                curriculum_Name: selectedData.curriculum_Name,
                branch: selectedData.branch
            }));

            setFormDataOBE3((prevState) => ({
                ...prevState,
                courseNamecode: courseNamecode,
            }));

            fetchInstructors(selectedData.course_Id);
        }
    };

    /* Function Pull Data Course OBE 3 */
    const [yearobe3, setYearobe3] = useState([]);
    const [selectyearobe3, setselectyearobe3] = useState([]);

    useEffect(() => {
        const fetchyearobe3 = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/yearobe3');
                setYearobe3(response.data.results);
            } catch (error) {
                console.error('Error Fetching Years:', error);
            }
        };
        fetchyearobe3();
    }, []);

    const [obeData, setObeData] = useState(null);
    const [obe3Ids, setObe3Ids] = useState('');

    const fetchDataobe3 = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/dataobe3', {
                params: {
                    user_Id: user.user_Id,
                    course_Id: showData.course_Id,
                    year: selectyearobe3
                },
            });

            const data = response.data.results && response.data.results[0];

            if (data) {
                setObeData(data);
                setObe3Ids(data.obe3_Id);
            } else {
                alert("No Data Found");
            }
        } catch (error) {
            console.error('Error fetching OBE3 data:', error);
        }
    };

    const handleSearch = () => {
        if (showData.course_Id && selectyearobe3) {
            fetchDataobe3();
        } else {
            alert('Please Select Year and Course');
        }
    }

    useEffect(() => {
        if (obeData) {

            const obeinfo = obeData;

            setFromQualityAssurance({
                compare_teach_bl: obeinfo.compare_teach_bl,
                outsider_teach_bl: obeinfo.outsider_teach_bl,
                research_bl: obeinfo.research_bl,
                society_bl: obeinfo.society_bl,
                culture_bl: obeinfo.culture_bl,
                obe_description_bl: obeinfo.obe_description_bl,
                obe_practice_bl: obeinfo.obe_practice_bl,
                obe_A_F_bl: obeinfo.obe_A_F_bl,
                obe_S_U_bl: obeinfo.obe_S_U_bl,
                obe_P_bl: obeinfo.obe_P_bl,
            });

            setFormDataOBE3({
                courseNamecode: obeinfo.courseNamecode,
                obe_latestC: obeinfo.obe3_latestC,
                obe_Sumtime_Theory: obeinfo.obe3_sumtime_theory,
                obe_Sumtime_Practice: obeinfo.obe3_sumtime_practice,
                obe_Sumtime_Selfeducation: obeinfo.obe3_sumtime_selfEducation,
                assess_course_bl: obeinfo.assess_course_bl,
                discuss_bl: obeinfo.discuss_bl,
                suggestion_bl: obeinfo.suggestion_bl,
                reflection_bl: obeinfo.reflection_bl,
                other6_1_bl: obeinfo.other6_1_bl === 1,
                other6_1_description: obeinfo.other6_1_description || '',
                teacher_Evalu_bl: obeinfo.teacher_Evalu_bl,
                exam_result_bl: obeinfo.exam_result_bl,
                verification_bl: obeinfo.verification_bl,
                ex_Evalu_comit_bl: obeinfo.ex_Evalu_comit_bl,
                observation_bl: obeinfo.observation_bl,
                other6_2_bl: obeinfo.other6_2_bl === 1,
                other6_2_description: obeinfo.other6_2_description || '',
                teach_Seminar_bl: obeinfo.teach_Seminar_bl,
                researchInOut_bl: obeinfo.researchInOut_bl,
                other6_3_bl: obeinfo.other6_3_bl === 1,
                other6_3_description: obeinfo.other6_3_description || '',
                commit_course_bl: obeinfo.commit_course_bl,
                check_depart_bl: obeinfo.check_depart_bl,
                check_teacher_bl: obeinfo.check_teacher_bl,
                other6_4_bl: obeinfo.other6_4_bl === 1,
                other6_4_description: obeinfo.other6_4_description || '',
                improve_offer_bl: obeinfo.improve_offer_bl,
                improve_By_stu_bl: obeinfo.improve_By_stu_bl,
                other6_5_bl: obeinfo.other6_5_bl === 1,
                other6_5_description: obeinfo.other6_5_description || '',
            })
        }
    }, [obeData]);

    useEffect(() => {
        if (obe3Ids) {

            const fetchAssessments = async () => {

                try {
                    const response = await axios.get('http://localhost:8081/api/dataAssessments', {
                        params: { obe3_Id: obe3Ids }
                    });

                    if (response.data && response.data.results) {
                        setAssessments(response.data.results);
                    }

                    const plansResponse = await axios.get('http://localhost:8081/api/dataPlans', {
                        params: { obe3_Id: obe3Ids }
                    });

                    if (plansResponse.data && plansResponse.data.results) {
                        setPlans(plansResponse.data.results);
                    }

                    const TextbookResponse = await axios.get('http://localhost:8081/api/datatextbooks', {
                        params: { obe3_Id: obe3Ids }
                    });

                    if (TextbookResponse.data && TextbookResponse.data.results) {
                        setTreatises(TextbookResponse.data.results);
                    }

                    const ConsellingResponse = await axios.get('http://localhost:8081/api/dataconsellings', {
                        params: { obe3_Id: obe3Ids }
                    });

                    if (ConsellingResponse.data && ConsellingResponse.data.results) {
                        setCourseTimeData(ConsellingResponse.data.results);
                    }

                    alert('ดึงข้อมูลมาเรียบร้อย');

                } catch (error) {
                    console.error('Error fetching assessments:', error);
                }
            };
            fetchAssessments();
        }
    }, [obe3Ids]);

    const fetchLatestCLOdata = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/oldclo', {
                params: {
                    course_Id: showData.course_Id,
                    user_Id: user.user_Id
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                setCloFromData(response.data.results);
            } else {
                setCloFromData([]);
            }
        } catch (error) {
            console.error('Error fetching latest CLO data:', error);
            setCloFromData([]);
        }
    }

    const fetchlatestEdu = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/edulatest', {
                params: { obe3_Id: obe3Ids }
            });

            if (response.data && response.data.results) {
                setExperience(response.data.results);
                setMeasuring(response.data.results);
            }
        } catch (error) {
            console.error('Error fetching latest Edu data:', error);
        }
    }

    const handleSearchCLOs = (e) => {
        e.preventDefault();
        fetchLatestCLOdata();
        fetchlatestEdu();
    }

    /* Function Reset Select Course OBE 3 */
    const handleResetSelect = () => {
        setShowData((prevData) => ({
            ...prevData,
            selectedCourse: '',
            course_Code: '',
            course_Name: '',
            course_NameEng: '',
            course_Description: '',
            course_DescriptionEng: '',
            course_Credit: '',
            course_Category: '',
            responsible_Teacher: '',
            course_Instructor: '',
            semster_term: '',
            year_of_study: '',
            prerequisites: '',
            corequisites: '',
            study_Area: '',
            college: '',
            campus: '',
            faculty: '',
            department_Name: '',
            curriculum_Name: '',
            branch: '',
        }));

        const fetchSuggestedCourse = async () => {
            try {
                const responseSuggest = await axios.get('http://localhost:8081/api/course');
                setSuggestCourse(responseSuggest.data);
            } catch (error) {
                console.error('Error Fetching Course Data:', error);
            }
        };

        fetchSuggestedCourse();
    };

    /* Function Data OBE 3 */
    const [formDataOBE3, setFormDataOBE3] = useState({
        courseNamecode: '',
        obe_latestC: '',
        obe_Sumtime_Theory: '',
        obe_Sumtime_Practice: '',
        obe_Sumtime_Selfeducation: '',
        assess_course_bl: false,
        discuss_bl: false,
        suggestion_bl: false,
        reflection_bl: false,
        other6_1_bl: false,
        other6_1_description: '',
        teacher_Evalu_bl: false,
        exam_result_bl: false,
        verification_bl: false,
        ex_Evalu_comit_bl: false,
        observation_bl: false,
        other6_2_bl: false,
        other6_2_description: '',
        teach_Seminar_bl: false,
        researchInOut_bl: false,
        other6_3_bl: false,
        other6_3_description: '',
        commit_course_bl: false,
        check_depart_bl: false,
        check_teacher_bl: false,
        other6_4_bl: false,
        other6_4_description: '',
        improve_offer_bl: false,
        improve_By_stu_bl: false,
        other6_5_bl: false,
        other6_5_description: '',
    })

    /* Function Course Time Data */
    const [courseTimeData, setCourseTimeData] = useState([{
        conselling_Name: '',
    }]);

    const handleAddTimeData = (e) => {
        e.preventDefault();
        const newTimeData = [...courseTimeData, { conselling_Name: '' }];
        setCourseTimeData(newTimeData);
    };

    const handleDeleteTimeData = (index) => {
        const newTimeData = [...courseTimeData];
        newTimeData.splice(index, 1);
        setCourseTimeData(newTimeData);
    };

    const handleTimeDataChange = (index, event) => {
        const { name, value } = event.target;
        const newTimeData = [...courseTimeData];
        newTimeData[index][name] = value;
        setCourseTimeData(newTimeData);
    };

    /* Function Save Concelling */
    const handleSaveConselling = async (obe3_Id) => {
        try {
            const courseTime = courseTimeData.map((ct, index) => {
                const ctd = {
                    conselling_Name: ct.conselling_Name,
                    course_Id: showData.course_Id,
                    obe3_Id: obe3_Id,
                }
                console.log(`Sending Data for Conselling Course Time Index ${index}:`, ctd);
                return axios.post('http://localhost:8081/api/conselling', ctd);
            });

            const responses = await Promise.all(courseTime);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Course Conselling Time ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for Course Conselling Time ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data', error);
        }
    }

    /* Function Quality Assurance */
    const [fromQualityAssurance, setFromQualityAssurance] = useState({
        compare_teach_bl: false,
        outsider_teach_bl: false,
        research_bl: false,
        society_bl: false,
        culture_bl: false,
        obe_description_bl: false,
        obe_practice_bl: false,
        obe_A_F_bl: false,
        obe_S_U_bl: false,
        obe_P_bl: false,
    })

    const handleCheckQuality = (event) => {
        const { name, checked } = event.target;
        setFromQualityAssurance((prevValues) => ({
            ...prevValues,
            [name]: checked,
        }));
    };

    /* Function ข้อมูล CLOs */
    const [CloFromData, setCloFromData] = useState([{
        clo_Id: '',
        clo_code: '',
        clo_Name: '',
        cloCodeName: '',
    }])

    const [cloCodeName, setCloCodeName] = useState('');

    const handleAddCLOs = (e) => {
        e.preventDefault();
        setCloFromData([...CloFromData, { clo_Id: '', clo_code: '', clo_Name: '', cloCodeName: '' }]);
    }

    const handleDeleteCLOs = (index) => {
        if (CloFromData.length > 1) {
            const updatedCLO = [...CloFromData];
            updatedCLO.splice(index, 1);
            setCloFromData(updatedCLO);
        } else {
            alert("Cannot Delete the Last CLOs");
        }
    }

    const handleCLOsChange = (index, field, value) => {
        const updateCLO = [...CloFromData];

        updateCLO[index][field] = value;
        updateCLO[index].cloCodeName = `${updateCLO[index].clo_code} ${updateCLO[index].clo_Name}`;

        setCloFromData(updateCLO);

        const cloCodes = updateCLO.map(clo => clo.clo_code).join(', ');
        setCloCodeName(cloCodes);
    }

    const [cloIds, setCloIds] = useState([]);

    /* Function Button Saved CLOs */
    const handleSaveCLOs = async (e) => {
        e.preventDefault();
        try {
            const incompleteField = CloFromData.flatMap((clos, CLOindex) => {
                if (!clos.clo_code || !clos.clo_Name) {
                    return `CLO Index ${CLOindex + 1}`;
                }
                return null;
            }).filter(Boolean);

            if (incompleteField.length > 0) {
                alert(`กรุณากรอกข้อมูล ${incompleteField.join(', ')} ให้ครบก่อนทำการบันทึกข้อมูล`);
                return;
            }

            const dataToSave = CloFromData.map(clos => ({
                clo_code: clos.clo_code,
                clo_Name: clos.clo_Name,
                course_Id: showData.course_Id,
                user_Id: user.user_Id,
            }));

            const responseCLo = await axios.post('http://localhost:8081/api/clos', dataToSave);

            if (responseCLo.status === 200) {
                console.log('Saving CLOs Complete');
                console.log('Response Data:', responseCLo.data);
            } else {
                console.error('Error Executing Request to Save Data');
            }
        } catch (error) {
            console.error('Error Saving CLOs:', error);
        }
    };

    const fetchCloIds = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/cloIds');
            setCloIds(response.data);
        } catch (error) {
            console.error('Error Fetching Latest Data:', error);
        }
    };

    /* Function ข้อมูล ELOs */
    const [ELOs, setELOs] = useState([{
        elo_Id: '',
        elo_code: '',
        elo_Name: '',
    }]);

    /* Function Choose Years */
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        if (selectedYear) {
            fetch(`http://localhost:8081/api/eloByYear/${selectedYear}`)
                .then((response) => response.json())
                .then((data) => {
                    setELOs(data);
                })
                .catch((error) => {
                    console.error('Error Fetching ELO by Year:', error);
                });
        }
    }, [selectedYear]);

    useEffect(() => {
        fetch('http://localhost:8081/api/eloYears')
            .then((response) => response.json())
            .then((data) => {
                setYears(data.map((year) => year.years_elo));
            })
            .catch((error) => {
                console.error('Error Fetching ELO Year:', error);
            });
    }, []);

    const handleAddELOs = () => {
        const newELO = { elo_code: '', elo_Name: '' };
        setELOs((prevELOs) => [...prevELOs, newELO]);
    };

    const handleDeleteELOs = (index) => {
        setELOs((prevELOs) => {
            const newELOs = prevELOs && prevELOs.filter((_, i) => i !== index);
            return newELOs;
        });
    };

    const handleELOsChange = (index, field, value) => {
        const newELOs = [...ELOs];
        newELOs[index][field] = value;
        setELOs(newELOs);
    };

    const handleResetELO = (e) => {
        e.preventDefault();
        setELOs([{
            elo_Id: '',
            elo_code: '',
            elo_Name: '',
        }]);
        setSelectedYear('');
    }

    /* Function เก็บค่าความสอดคล้องระหว่าง CLOs และ ELOs */
    const [valueCompareClowElo, setValueCompareCLOwELO] = useState([]);

    const handleCompareClowElo = (CLOindex, ELOindex, checked, clo_Id, elo_Id) => {
        setValueCompareCLOwELO((prevValue) => {
            const newValue = [...prevValue];

            newValue[CLOindex] = newValue[CLOindex] || {};
            newValue[CLOindex][ELOindex] = newValue[CLOindex][ELOindex] || {};
            newValue[CLOindex][ELOindex] = { valueCompareClowElo: checked ? 1 : 0, clo_Id, elo_Id };

            console.log(newValue);
            console.log(valueCompareClowElo);

            return newValue;
        });
    };

    const handleSaveCompareClowElo = async (e) => {
        e.preventDefault();

        try {
            const coorrectedValueCompareClowElo = valueCompareClowElo.map((CLO) => {
                return Object.values(CLO);
            });

            const requests = coorrectedValueCompareClowElo.flatMap((CLO, CLOindex) => {
                return CLO.map((item, ELOindex) => {
                    if (item) {

                        const { valueCompareClowElo, clo_Id, elo_Id } = item;
                        const mapClowElo = {
                            valueCompareClowElo,
                            clo_Id,
                            elo_Id,
                            course_Id: showData.course_Id,
                            user_Id: user.user_Id,

                        };

                        console.log(`Sending Data for CLOs Index ${CLOindex}, ELO Index ${ELOindex}:`, mapClowElo);
                        return axios.post('http://localhost:8081/api/compareClowElo', mapClowElo);
                    }
                    return null;
                }).filter(Boolean);
            });

            const responses = await Promise.all(requests);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saved Value Compare CLOs with ELO Complete for Request at Index ${index}`);
                } else {
                    console.error(`Failed to Save Data for Request at Index ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Value Compare:', error);
        }
    };

    /* Function ข้อมูลคุณลักษณะพื้นฐานร่วมกันของบัณฑิต */
    const [attribute, setAttribute] = useState([{
        clo_basic_Id: '',
        clo_basic_Name: '',
        basicClo_year: '',
    }]);

    const [basicyear, setBasic] = useState([]);
    const [selectedbasic, setSelectedBasic] = useState('');

    useEffect(() => {
        if (selectedbasic) {
            fetch(`http://localhost:8081/api/cloBasic/${selectedbasic}`)
                .then((response) => response.json())
                .then((data) => {
                    setAttribute(data);
                })
                .catch((error) => {
                    console.error('Error Fetching ELO by Year:', error);
                });
        }
    }, [selectedbasic]);

    useEffect(() => {
        fetch('http://localhost:8081/api/basicYear')
            .then((response) => response.json())
            .then((data) => {
                setBasic(data.map((years) => years.basicClo_year));
            })
            .catch((error) => {
                console.error('Error Fetching ELO Years:', error);
            });
    }, []);

    const handleAddAttribute = (e) => {
        e.preventDefault();
        const newAttr = { clo_basic_Name: '', };
        setAttribute((prevAttr) => [...prevAttr, newAttr]);
    };

    const handleDeleteAttribute = (index) => {
        setAttribute((prevAttr) => {
            const newAttr = prevAttr && prevAttr.filter((_, i) => i !== index);
            return newAttr;
        });
    };

    const handleAttributeChange = (index, field, value) => {
        const newAttribute = [...attribute];
        newAttribute[index][field] = value;
        setAttribute(newAttribute);
    };

    const handleResetAttribute = (e) => {
        e.preventDefault();
        setAttribute([{
            clo_basic_Id: '',
            clo_basic_Name: '',
            basicClo_year: '',
        }]);
        setSelectedBasic('');
    }

    /* Function เก็บค่าคุณลักษณะพื้นฐานร่วมกันของบัณฑิต และ CLOs */
    const [ValueCompareCLOwAttribute, setValueCompareCLOwAttribute] = useState([]);

    const handleValueCompareCLOwAttributeChange = (CLOindex, Atrindex, checked, clo_Id, clo_basic_Id) => {
        setValueCompareCLOwAttribute((prevValue) => {
            const newValues = [...prevValue];

            newValues[CLOindex] = newValues[CLOindex] || {};
            newValues[CLOindex][Atrindex] = newValues[CLOindex][Atrindex] || {};
            newValues[CLOindex][Atrindex] = { BasicValue: checked ? 1 : 0, clo_Id, clo_basic_Id };

            console.log(newValues);
            return newValues;
        });
    };

    const handleSaveBasicValue = async (e) => {
        e.preventDefault();

        try {

            if (!Array.isArray(ValueCompareCLOwAttribute) || ValueCompareCLOwAttribute.length === 0) {
                alert('ไม่มีข้อมูลเพื่อบันทึก');
                return;
            }

            const correctedValueCompareCLOBasic = ValueCompareCLOwAttribute.map((CLO) => {
                return Object.values(CLO);
            });

            const requests = correctedValueCompareCLOBasic.flatMap((CLO, CLOindex) => {
                return CLO.map((item, Atrindex) => {
                    if (item) {

                        const { BasicValue, clo_basic_Id, clo_Id } = item;
                        const mapBasicClo = {
                            BasicValue,
                            clo_basic_Id,
                            clo_Id,
                            course_Id: showData.course_Id,
                            user_Id: user.user_Id,
                        }
                        console.log(`Sending Data for CLOs Index ${CLOindex}, Attribute Index ${Atrindex}:`, mapBasicClo);
                        return axios.post('http://localhost:8081/api/comparebasicclo', mapBasicClo);
                    }
                    return null
                }).filter(Boolean);
            });

            const responses = await Promise.all(requests);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Value Compare CLOs with CLOs Basic Complete for Request at Index ${index}`);
                } else {
                    console.error(`Failed to Save Data for Request at Index ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Value Compare:', error);
        }
    };

    /* Function Pull CLOs */
    const handlePullCloIds = (e) => {
        e.preventDefault();
        fetchCloIds();

        const newCloFormData = cloIds.map(clo => ({
            clo_Id: clo.clo_Id,
            clo_code: clo.clo_code,
            clo_Name: clo.clo_Name,
            cloCodeName: '',
        }));

        setCloFromData(newCloFormData);
        setCloIds([]);

        console.log("After Setting CLOs FromData:", CloFromData);
        console.log("After Setting CLOs Ids:", cloIds);
    };

    /* Function เลือกตารางในหมวด 2 ข้อที่ 5 */
    const [checkbox5_1, setCheckbox5_1] = useState(false);
    const [checkbox5_2, setCheckbox5_2] = useState(false);

    const handleCheckboxChoose = (checkbox) => {
        if (checkbox === 1) {
            setCheckbox5_1(true);
            setCheckbox5_2(false);
            setSelectedTable('Table5_1');
        } else if (checkbox === 2) {
            setCheckbox5_2(true);
            setCheckbox5_1(false);
            setSelectedTable('Table5_2');
        }
    };

    /* Function แสดงตารางที่เลือกในหมวด 2 ข้อที่ 5 */
    const renderTable = () => {
        if (checkbox5_1) {
            return renderTable5_1();
        }
        else if (checkbox5_2) {
            return renderTable5_2();
        }
        return null;
    };

    /* ตาราง 5.1 */
    const renderTable5_1 = () => {
        return (
            <div className="title-table">
                <label> Select Year </label>
                <select
                    className="btn-select-year"
                    value={selectedbasic}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value=""> All </option>
                    {years.map((year) => (
                        <option key={year} value={year}> {year} </option>
                    ))}
                </select>

                <button className="button-reset" onClick={handleResetELO}> Reset ELO </button>
                <button className="pull-clo" onClick={handlePullCloIds}> Pull CLOs </button>

                <label> ตารางที่ 5.1 ความสอดคล้องของ ELOs และ CLOs </label>
                <button className="add-button-obe3" onClick={handleAddELOs}> <FontAwesomeIcon icon={faPlus} /> </button>
                <table className="table5-1">
                    <thead>
                        <tr>
                            <th> ELOs / CLOs </th>
                            {CloFromData.map((clo, CLOindex) => (
                                <th key={CLOindex + clo.clo_Id}> {clo.clo_code} </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ELOs.map((elo, ELOindex) => (
                            <tr key={ELOindex}>
                                <td>
                                    <textarea
                                        className="from-elo-obe3"
                                        name={`elo_code${ELOindex}`}
                                        type="text"
                                        key={elo.elo_Id}
                                        value={`${elo.elo_code} ${elo.elo_Name}`}
                                        onChange={(e) => handleELOsChange(ELOindex, e)}
                                    />
                                    <button className="delete-button-obe3" onClick={() => handleDeleteELOs(ELOindex)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                </td>
                                {CloFromData.map((clo, CLOindex) => (
                                    <td key={CLOindex}>
                                        <input
                                            type="checkbox"
                                            checked={valueCompareClowElo[ELOindex]?.valueCompareClowElo?.[CLOindex]}
                                            onChange={(e) => handleCompareClowElo(ELOindex, CLOindex, e.target.checked, clo.clo_Id, elo.elo_Id)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="position">
                    <button className="btn-save-elo" onClick={handleSaveCompareClowElo}> Save ELOs </button>
                </div>
            </div>
        );
    };

    /* ตาราง 5.2 */
    const renderTable5_2 = () => {
        return (
            <div className="title-table">
                <label> Select Year </label>
                <select
                    className="btn-select-year"
                    value={selectedYear}
                    onChange={(e) => setSelectedBasic(e.target.value)}
                >
                    <option> All </option>
                    {basicyear.map((years) => (
                        <option key={years} value={years}> {years} </option>
                    ))}
                </select>

                <button className="button-reset" onClick={handleResetAttribute}> Reset </button>
                <button className="pull-clo" onClick={handlePullCloIds}> Pull CLOs </button>

                <label> ตารางที่ 5.2 ความสอดคล้องของคุณลักษณะพื้นฐานร่วมกันของบัณฑิตที่พึงประสงค์ มจพ. และ CLOs </label>
                <button className="add-button-obe3" onClick={handleAddAttribute}>  <FontAwesomeIcon icon={faPlus} /> </button>
                <table className="table5-2">
                    <thead>
                        <tr>
                            <th> คุณลักษณะพื้นฐานร่วมกันของบัณฑิต <br /> ที่พึงประสงค์ มจพ./CLOs </th>
                            {CloFromData.map((clo, CLOindex) => (
                                <th key={CLOindex + clo.clo_Id}> {clo.clo_code} </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {attribute.map((attr, Atrindex) => (
                            <tr key={Atrindex}>
                                <td>
                                    <textarea
                                        className="from-elo-obe3"
                                        name={`clo_basic_Name${Atrindex}`}
                                        type="text"
                                        key={attr.clo_basic_Id}
                                        value={`${attr.clo_basic_Name}`}
                                        onChange={(e) => handleAttributeChange(Atrindex, e)}
                                    />
                                    <button className="delete-button-obe3" onClick={() => handleDeleteAttribute(Atrindex)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                </td>
                                {CloFromData.map((clo, CLOindex) => (
                                    <td key={CLOindex}>
                                        <input
                                            type="checkbox"
                                            checked={ValueCompareCLOwAttribute[Atrindex]?.BasicValue?.[CLOindex]}
                                            onChange={(e) => handleValueCompareCLOwAttributeChange(Atrindex, CLOindex, e.target.checked, clo.clo_Id, attr.clo_basic_Id)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="position">
                    <button className="btn-save-value" onClick={handleSaveBasicValue}> Save Value </button>
                </div>
            </div>
        );
    };

    /* Function ข้อมูลการพัฒนานักศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง */
    const [experience, setExperience] = useState([{
        experience_Name: ''
    }]);

    const handleExperienceChange = (experienceName, fieldName, CLOindex) => {
        const newExperience = [...experience];
        newExperience[CLOindex] = {
            ...newExperience[CLOindex],
            [fieldName]: experienceName
        };
        setExperience(newExperience);
    };

    const [measuring, setMeasuring] = useState([{
        measuring_Name: ''
    }]);

    const handleMeasuringChange = (measuringName, fieldName, CLOindex) => {
        const newMeasuring = [...measuring];
        newMeasuring[CLOindex] = {
            ...newMeasuring[CLOindex],
            [fieldName]: measuringName,
        };
        setMeasuring(newMeasuring);
    };

    const handleSaveExp = async (obe3_Id) => {
        try {
            if (!CloFromData || !experience || !measuring || !showData) {
                throw new Error('Missing Required Data');
            }

            const requests = CloFromData.map((clo, CLOindex) => {
                const CEM = {
                    clo_Id: clo.clo_Id,
                    experience_Name: experience[CLOindex]?.experience_Name || '',
                    measuring_Name: measuring[CLOindex]?.measuring_Name || '',
                    course_Id: showData.course_Id,
                    obe3_Id: obe3_Id,
                };

                console.log(`Sending Data for CLOs Index ${CLOindex}:`, CEM);
                return axios.post('http://localhost:8081/api/developEXP', CEM);
            });

            const responses = await Promise.all(requests);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for CLOs Index ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for CLOs Index ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data:', error);
        }
    };

    /* Function ข้อมูลแผนการสอน */
    const [Plans, setPlans] = useState(Array.from({ length: 15 }, (_, index) => ({
        plan_Name: '',
        plan_Clo: '',
        lecture_Hours: '',
        pratice_Hours: '',
        plan_description: '',
    })));

    const handleAddPlan = () => {
        setPlans([...Plans, {
            plan_Name: '',
            plan_Clo: '',
            lecture_Hours: '',
            pratice_Hours: '',
            plan_description: '',
        }]);
    };

    const handleDeletePlan = (index) => {
        const updatedPlans = Plans.filter((_, i) => i !== index);
        setPlans(updatedPlans);
    };

    const handlePlanChange = (index, field, value) => {
        const updatePlan = [...Plans];
        updatePlan[index][field] = value;
        setPlans(updatePlan);
    };

    const handleSavePlan = async (obe3_Id) => {
        try {
            const incompleteField = Plans.map((plan, index) => {
                if (!plan.plan_Name || !plan.plan_Clo || !plan.lecture_Hours || !plan.pratice_Hours || !plan.plan_description) {
                    return `Plan Data ${index + 1}`;
                }
                return null;
            }).filter(Boolean);

            if (incompleteField.length > 0) {
                alert(`กรุณากรอกข้อมูลให้ครบถ้วนใน ${incompleteField.join(', ')}`);
                return;
            }

            const PlanData = Plans.map((plan, index) => {
                const p = {
                    plan_Name: plan.plan_Name,
                    plan_Clo: plan.plan_Clo,
                    lecture_Hours: plan.lecture_Hours,
                    pratice_Hours: plan.pratice_Hours,
                    plan_description: plan.plan_description,
                    course_Id: showData.course_Id,
                    obe3_Id: obe3_Id,
                };
                console.log(`Sending Data for Plan Index ${index}:`, p);
                return axios.post('http://localhost:8081/api/Plans', p);
            })

            const responses = await Promise.all(PlanData);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Teaching Plans ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for Teaching Plans ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data:', error.message);
        }
    };

    /* Function ข้อมูลแผนการประเมิน */
    const [assessments, setAssessments] = useState(Array.from({ length: 3 }, () => ({
        assessment_outCome: '',
        activity_Learning: '',
        assessment_Deadline: '',
        assessment_Proportion: '',
    })));

    const handleAddAssessment = () => {
        setAssessments([...assessments, {
            assessment_outCome: '',
            activity_Learning: '',
            assessment_Deadline: '',
            assessment_Proportion: '',
        }]);
    };

    const handleDeleteAssessment = assessmentIndex => {
        const newAssessment = [...assessments];
        newAssessment.splice(assessmentIndex, 1);
        setAssessments(newAssessment);
    };

    const handleAssessmentChange = (index, event) => {
        const { name, value } = event.target;
        const updateAssessment = [...assessments];
        updateAssessment[index][name] = value;
        setAssessments(updateAssessment);
    };

    const handleSaveAssessment = async (obe3_Id) => {
        try {
            const incompleteField = assessments.map((as, index) => {
                if (!as.assessment_outCome || !as.activity_Learning || !as.assessment_Deadline || !as.assessment_Proportion) {
                    return `Assessments Data Index ${index + 1}`;
                }
                return null;

            }).filter(Boolean);

            if (incompleteField.length > 0) {
                alert(`กรุณากรอกข้อมูลให้เรียบร้อยก่อนบันทึกข้อมูล ${incompleteField.join(', ')}`);
                return;
            }

            const Asm = assessments.map((as, index) => {

                const ass = {
                    assessment_outCome: as.assessment_outCome,
                    activity_Learning: as.activity_Learning,
                    assessment_Deadline: as.assessment_Deadline,
                    assessment_Proportion: as.assessment_Proportion,
                    course_Id: showData.course_Id,
                    obe3_Id: obe3_Id,
                }

                console.log(`Sending Data for Assessment Index ${index}:`, ass);
                return axios.post('http://localhost:8081/api/assessments', ass);
            });

            const responses = await Promise.all(Asm);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Assessment ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for Assessment ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data:', error.message);
        }
    }

    /* Function ข้อมูลตำราและเอกสารที่ใช้ประกอบการเรียนการสอน */
    const [Treatises, setTreatises] = useState([{
        textbook_Name: '',
    }]);

    const handleAddTreatise = () => {
        const newTreatises = [...Treatises, { textbook_Name: '' }];
        setTreatises(newTreatises);
    };

    const handleDeleteTreatise = (index) => {
        const newTreatises = [...Treatises];
        newTreatises.splice(index, 1);
        setTreatises(newTreatises);
    };

    const handleTreatiseChange = (index, event) => {
        const { name, value } = event.target;
        const newTreatises = [...Treatises];
        newTreatises[index][name] = value;
        setTreatises(newTreatises);
    };

    const handleSaveTreatise = async (obe3_Id) => {
        try {
            const txb = Treatises.map((tb, index) => {

                const doc = {
                    textbook_Name: tb.textbook_Name,
                    course_Id: showData.course_Id,
                    obe3_Id: obe3_Id,
                }

                console.log(`Sending Data for Document Treatise Index ${index}:`, doc);
                return axios.post('http://localhost:8081/api/textbook', doc);
            });

            const responses = await Promise.all(txb);

            responses.forEach((response, index) => {
                if (response.status === 200) {
                    console.log(`Saving Data for Document Treatise ${index} Complete`);
                } else {
                    console.error(`Failed to Save Data for Document Treatise ${index}:`, response.statusText);
                }
            });
        } catch (error) {
            console.error('Error Saving Data');
        }
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* Function Resize Input */
    const [description1, setDescription1] = useState('');
    const [description2, setDescription2] = useState('');

    const handleResize = (event, setDescription) => {
        setDescription(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };

    /* Function Save Data OBE 3 */
    const handleSaveOBE3 = async () => {
        setLoading(true);
        setError('');
        try {
            const dataOBE3 = {
                user_Id: user.user_Id,
                courseNamecode: formDataOBE3.courseNamecode,
                university_Name: showData.college,
                campusObe3: showData.campus,
                facultyObe3: showData.faculty,
                departmentObe3: showData.department_Name,
                obe3_Credit: showData.course_Credit,
                obe3_Curriculum: showData.curriculum_Name,
                obe3_branch: showData.branch,
                obe3_courseCategory: showData.course_Category,
                obe3_semster: showData.semster_term,
                obe3_yearstudy: showData.year_of_study,
                obe3_prereq: showData.prerequisites,
                obe3_coreq: showData.corequisites,
                obe3_studyArea: showData.study_Area,
                obe3_latestC: formDataOBE3.obe_latestC,
                obe3_sumtime_theory: formDataOBE3.obe_Sumtime_Theory,
                obe3_sumtime_practice: formDataOBE3.obe_Sumtime_Practice,
                obe3_sumtime_selfEducation: formDataOBE3.obe_Sumtime_Selfeducation,
                assess_course_bl: formDataOBE3.assess_course_bl,
                discuss_bl: formDataOBE3.discuss_bl,
                suggestion_bl: formDataOBE3.suggestion_bl,
                reflection_bl: formDataOBE3.reflection_bl,
                other6_1_bl: formDataOBE3.other6_1_bl,
                other6_1_description: formDataOBE3.other6_1_description,
                teacher_Evalu_bl: formDataOBE3.teacher_Evalu_bl,
                exam_result_bl: formDataOBE3.exam_result_bl,
                verification_bl: formDataOBE3.verification_bl,
                ex_Evalu_comit_bl: formDataOBE3.ex_Evalu_comit_bl,
                observation_bl: formDataOBE3.observation_bl,
                other6_2_bl: formDataOBE3.other6_2_bl,
                other6_2_description: formDataOBE3.other6_2_description,
                teach_Seminar_bl: formDataOBE3.teach_Seminar_bl,
                researchInOut_bl: formDataOBE3.researchInOut_bl,
                other6_3_bl: formDataOBE3.other6_3_bl,
                other6_3_description: formDataOBE3.other6_3_description,
                commit_course_bl: formDataOBE3.commit_course_bl,
                check_depart_bl: formDataOBE3.check_depart_bl,
                check_teacher_bl: formDataOBE3.check_teacher_bl,
                other6_4_bl: formDataOBE3.other6_4_bl,
                other6_4_description: formDataOBE3.other6_4_description,
                improve_offer_bl: formDataOBE3.improve_offer_bl,
                improve_By_stu_bl: formDataOBE3.improve_By_stu_bl,
                other6_5_bl: formDataOBE3.other6_5_bl,
                other6_5_description: formDataOBE3.other6_5_description,
                compare_teach_bl: fromQualityAssurance.compare_teach_bl,
                outsider_teach_bl: fromQualityAssurance.outsider_teach_bl,
                research_bl: fromQualityAssurance.research_bl,
                society_bl: fromQualityAssurance.society_bl,
                culture_bl: fromQualityAssurance.culture_bl,
                obe_description_bl: fromQualityAssurance.obe_description_bl,
                obe_practice_bl: fromQualityAssurance.obe_practice_bl,
                obe_A_F_bl: fromQualityAssurance.obe_A_F_bl,
                obe_S_U_bl: fromQualityAssurance.obe_S_U_bl,
                obe_P_bl: fromQualityAssurance.obe_P_bl,
                course_Id: showData.course_Id
            };

            const response = await fetch('http://localhost:8081/api/obe3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(dataOBE3),
            })

            if (response.status === 200) {
                const responseData = await response.json();
                console.log('Data Outcome-Based Education 3 Saved Successful', responseData);
                return responseData.obe3_Id;
            } else {
                const errorData = await response.json();
                setError(`ไม่สามารถบันทึกได้: ${errorData.message}`);
                console.error('ไม่สามารถบันทึกข้อมูล Outcome-Based Education 3');
                return null;
            }
        } catch (error) {
            setError(`ข้อผิดพลาด: ${error.message}`);
            console.error('Error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const [OBE3Ids, setOBE3Ids] = useState(null);

    const handleSaveData = async (e) => {
        e.preventDefault();

        const userConfirmed = window.confirm('โปรดตรวจสอบข้อมูลก่อนบันทึก! คุณต้องการบันทึกข้อมูลต่อหรือไม่?');

        if (!userConfirmed) {
            return;
        }

        const obe3_Id = await handleSaveOBE3()

        if (obe3_Id) {
            console.log('Successful Saved OBE 3:', obe3_Id);
            setOBE3Ids(obe3_Id);

            try {
                await handleSaveConselling(obe3_Id);
                await handleSaveExp(obe3_Id);
                await handleSavePlan(obe3_Id);
                await handleSaveAssessment(obe3_Id);
                await handleSaveTreatise(obe3_Id);

            } catch (error) {
                console.error('Error occurred while saving data:', error);
            }
        } else {
            console.error('Error Saving Data All Document');
        }
    }

    /* Function Download PDF */
    const [selectedTable, setSelectedTable] = useState(null);

    const RenderPDF = async (e) => {
        e.preventDefault();

        const selectedInstructorNames = selectedIns.map(instructorName => {
            return instructorName;
        }).filter(name => name !== null && name !== '');

        if (!checkbox5_1 && !checkbox5_2) {
            alert("กรุณาเลือกตารางและใส่ค่าในตารางให้เรียบร้อยก่อน ดาวน์โหลด PDF");
            return;
        }

        const doc = (
            <MyDocument3
                showData={showData}
                selectedInstructorNames={selectedInstructorNames}
                fromQualityAssurance={fromQualityAssurance}
                formDataOBE3={formDataOBE3}
                courseTimeData={courseTimeData}
                CloFromData={CloFromData}
                selectedTable={selectedTable}
                ELOs={ELOs}
                valueCompareClowElo={valueCompareClowElo}
                attribute={attribute}
                ValueCompareCLOwAttribute={ValueCompareCLOwAttribute}
                experience={experience}
                measuring={measuring}
                Plans={Plans}
                assessments={assessments}
                Treatises={Treatises}
            />
        );

        const blob = await pdf(doc).toBlob();
        const formData = new FormData();
        const fileSize = blob.size;
        const fileName = `${showData.course_Code} ${showData.course_Name}.pdf`;

        formData.append('pdfFile', blob, fileName);
        formData.append('fileSize', fileSize);
        formData.append('fileName', fileName);
        formData.append('obe3Id', OBE3Ids);

        const response = await fetch(`http://localhost:8081/api/pdf3`, {
            method: 'POST',
            body: formData
        });

        if (response.status === 200) {
            console.log('PDF upload Successful');
        } else {
            console.error('Failed to upload PDF');
        }

        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };

    /* Function Chatbot QA */
    const suggestedQuestion = [
        "แผนการสอนวิชา [รหัสวิชา]",
        "แผนการสอนวิชา [ชื่อวิชา]",
        "วิชา [รหัสวิชา] ชื่อวิชาอะไร",
        "วิชา [ชื่อวิชา] รหัสวิชาอะไร",
        "คำอธิบายรายวิชา [รหัสวิชา]",
        "คำอธิบายรายวิชา [ชื่อวิชา]",
        "[CLO ตามด้วยตัวเลขของ CLO] ของวิชา [รหัสวิชา]?",
        "[CLO ตามด้วยตัวเลขของ CLO] ของวิชา [ชื่อวิชา]?",
        "CLO ทั้งหมดของวิชา [รหัสวิชา]?",
        "CLO ทั้งหมดของวิชา [ชื่อวิชา]?",
        "วิชาที่ต้องเรียนก่อน วิชา[รหัสวิชา]",
        "วิชาบังคับร่วม วิชา [รหัสวิชา]",
        "วิชาที่ต้องเรียนก่อน วิชา[ชื่อวิชา]",
        "วิชาบังคับร่วม วิชา [ชื่อวิชา]",
    ]

    const selectedQuestions = [
        suggestedQuestion[2],
        suggestedQuestion[3],
        suggestedQuestion[4],
        suggestedQuestion[5],
        suggestedQuestion[10],
        suggestedQuestion[11],
        suggestedQuestion[12],
        suggestedQuestion[13],
    ];

    const selectedplanQ = [
        suggestedQuestion[0],
        suggestedQuestion[1],
    ];

    const selectedCLOsQ = [
        suggestedQuestion[6],
        suggestedQuestion[7],
        suggestedQuestion[8],
        suggestedQuestion[9],
    ]

    return (
        <>
            <div className={Fill3}>

                <div className="fill3-container">
                    <div className="fill3-bar">

                        <div className="fill3-obe">
                            <button className="name-obe3" type="button"> OBE 3 </button>

                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <div className="question-button">
                                    ตัวอย่างคำถาม ถามบอท
                                    <div className="simple-tooltip">
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {selectedQuestions.map((question, index) => (
                                                <li key={index}>{question}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pull Data OBE 3 */}
                        <div className="form-group">
                            <label className="from-head-recommend">
                                * เลือกปีในกรณีมีข้อมูล Outcome-Based Education 3 และ เลือกวิชาที่ Select Course *
                            </label>

                            <div className="input-group">
                                <select
                                    id="yearselect"
                                    value={selectyearobe3}
                                    onChange={(e) => setselectyearobe3(e.target.value)}
                                >
                                    <option value=""> Select Year </option>
                                    {yearobe3.map((item) => (
                                        <option key={item.year} value={item.year}>
                                            {item.year}
                                        </option>
                                    ))}
                                </select>

                                <button className="btn-search" onClick={handleSearch}> Search OBE 3 </button>
                            </div>
                        </div>

                        <div className="fill3-img">
                            <img src={Logo} className="Logo-obe3" alt="Logo" />
                        </div>

                        <form>
                            <div className="input-container-obe3">

                                {/* เลือกวิชา */}
                                <div className="course-obe3">
                                    <select
                                        className="btn-course-select"
                                        name="selectedCourse"
                                        value={showData.selectedCourse || ''}
                                        onChange={(e) => {
                                            const selectedCourse = suggestCourse.find(course => course.course_Code == e.target.value);
                                            handleSuggestedCourseChange(selectedCourse);
                                        }}
                                    >
                                        <option> Select Course </option>
                                        {suggestCourse.map((course) => (
                                            <option key={course.course_Code} value={course.course_Code}>
                                                {course.course_Code} {course.course_Name} {course.semster_term}
                                            </option>
                                        ))}
                                    </select>

                                    <button className="btn-course-reset" type="button" onClick={handleResetSelect}>
                                        <span>
                                            <svg viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                                                <path d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>

                                <label className="from-head-obe3"> <b> รายชื่อวิชา </b>
                                    <input
                                        className="from-input-course-obe3"
                                        name="course_Code"
                                        type="text"
                                        value={showData.course_Code || ''}
                                        onChange={handleShowInputChange}
                                        placeholder='XXXXXXXXX'
                                        required
                                    />
                                    <input
                                        className="from-input-course-obe3"
                                        name="course_Name"
                                        type="text"
                                        value={showData.course_Name || ''}
                                        onChange={handleShowInputChange}
                                        placeholder='ชื่อวิชาภาษาไทย'
                                        required
                                    />
                                    <input
                                        className="from-input-course-obe3"
                                        name="course_NameEng"
                                        type="text"
                                        value={showData.course_NameEng || ''}
                                        onChange={handleShowInputChange}
                                        placeholder='ชื่อวิชาภาษาอังกฤษ'
                                        required
                                    />
                                </label>

                                <label className="from-title-obe3"> <b> ชื่อสถาบันอุดมศึกษา </b>
                                    <input
                                        className="from-college-obe3"
                                        name="college"
                                        value={showData.college || ''}
                                        onChange={handleShowInputChange}
                                        required
                                    />
                                </label>

                                <label className="from-title-obe3">
                                    <label> <b> วิทยาเขต </b> </label>
                                    <input
                                        className="from-input-obe3"
                                        name="campus"
                                        type="text"
                                        value={showData.campus || ''}
                                        onChange={handleShowInputChange}
                                        required
                                    />
                                    <label> <b> คณะ </b> </label>
                                    <input
                                        className="from-input-obe3"
                                        name="faculty"
                                        type="text"
                                        value={showData.faculty || ''}
                                        onChange={handleShowInputChange}
                                        required
                                    />
                                    <label> <b> ภาควิชา </b> </label>
                                    <input
                                        className="from-inputs-obe3"
                                        name="department_Name"
                                        type="text"
                                        value={showData.department_Name || ''}
                                        onChange={handleShowInputChange}
                                        required
                                    />
                                </label>

                                {/* หมวดที่ 1 ข้อมูลทั่วไป */}
                                <div className="mode1">
                                    <b> <p> หมวดที่ 1 ข้อมูลทั่วไป </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. รหัสและชื่อรายวิชา </b> </label>
                                        <input
                                            className="from-course-obe3"
                                            name="courseNamecode"
                                            type="text"
                                            value={`${showData.course_Code || ''}  ${showData.course_Name || ''}  ${showData.course_NameEng || ''}`}
                                            onChange={handleShowInputChange}
                                            placeholder='รหัสและชื่อรายวิชา'
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. จำนวนหน่วยกิต </b> </label>
                                        <input
                                            className="from-credit-obe3"
                                            name="course_Credit"
                                            type="number"
                                            value={showData.course_Credit || ''}
                                            onChange={handleShowInputChange}
                                            min={1} max={3}
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 3. หลักสูตรและประเภทของรายวิชา </b> </label>
                                        <label className="form-name-obe3"> หลักสูตร
                                            <input
                                                className="from-obe3"
                                                name="curriculum_Name"
                                                type="text"
                                                value={showData.curriculum_Name || ''}
                                                onChange={handleShowInputChange}
                                                required
                                            />
                                        </label>
                                        <label> สาขาวิชา
                                            <input
                                                className="from-obe3"
                                                name="branch"
                                                type="text"
                                                value={showData.branch || ''}
                                                onChange={handleShowInputChange}
                                                required
                                            />
                                        </label>
                                        <label> เป็นรายวิชา
                                            <input
                                                className="from-obe3"
                                                name="course_Category"
                                                type="text"
                                                value={showData.course_Category || ''}
                                                onChange={handleShowInputChange}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 4. อาจารย์ผู้รับผิดชอบรายวิชาและอาจารย์ผู้สอน </b> </label>
                                        <label className="form-name1-obe3"> อาจารย์ผู้รับผิดชอบรายวิชา </label>
                                        <input
                                            className="from1-obe3"
                                            name="responsible_Teacher"
                                            type="text"
                                            value={showData.responsible_Teacher || ''}
                                            onChange={handleShowInputChange}
                                            placeholder="ชื่ออาจารย์ผู้รับผิดชอบรายวิชา"
                                            required
                                        /> <br />

                                        <label className="form-name2-obe3"> อาจารย์ผู้สอน </label>
                                        <button className="add-button-obe3" onClick={handleAddInstructor}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        {selectedIns.map((instructorId, index) => (
                                            <div key={instructorId ? instructorId : index}>
                                                <select
                                                    className="from3-obe3"
                                                    name={`course_Instructor${index}`}
                                                    value={instructorId}
                                                    onChange={(e) => handleInstructorInputChange(index, e.target.value)}
                                                    required
                                                >
                                                    <option value=""> เลือกอาจารย์ผู้สอน </option>
                                                    {instructors.map((inst, idx) => (
                                                        <option key={`${inst.user_Id}-${idx}`} value={inst.user_Id}>
                                                            {`${inst.user_FirstName} ${inst.user_LastName}`}
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedIns.length > 1 && (
                                                    <button className="delete-button-obe3" onClick={() => handleDeleteInstructor(index)}>
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 5. ภาคการศึกษา/ชั้นปีที่เรียน </b> </label>
                                        <label className="form-name3-obe3"> ภาคการศึกษา </label>
                                        <input
                                            className="from-semester-obe3"
                                            name="semster_term"
                                            type="text"
                                            value={showData.semster_term || ''}
                                            onChange={handleShowInputChange}
                                            min={1} max={3}
                                            required
                                        />
                                        <label className="form-name1-obe3"> ของชั้นปีที่
                                            <input
                                                className="from-year-obe3"
                                                name="year_of_study"
                                                type="number"
                                                value={showData.year_of_study || ''}
                                                onChange={handleShowInputChange}
                                                min={1} max={8}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 6. รายวิชาบังคับก่อน (Pre-requisite) (ถ้ามี) </b> </label>
                                        <input
                                            className="from0-obe3"
                                            name="prerequisites"
                                            type="text"
                                            value={showData.prerequisites || ''}
                                            onChange={handleShowInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 7. รายวิชาที่ต้องเรียนพร้อมกัน (Co-requisites) (ถ้ามี) </b> </label>
                                        <input
                                            className="from0-obe3"
                                            name="corequisites"
                                            type="text"
                                            value={showData.corequisites || ''}
                                            onChange={handleShowInputChange}
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 8. สถานที่เรียน </b> </label>
                                        <label className="form-name-obe3"> คณะ/วิทยาลัย
                                            <input
                                                className="from4-obe3"
                                                name="study_Area"
                                                type="text"
                                                value={showData.study_Area || ''}
                                                onChange={handleShowInputChange}
                                                required
                                            />
                                        </label>
                                        <label> มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ </label>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 9. ข้อมูลประกอบการประกันคุณภาพการศึกษา </b> </label>
                                        <input
                                            className="from-check-obe3"
                                            name="compare_teach_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.compare_teach_bl}
                                            onChange={handleCheckQuality}
                                        /> การเรียนการสอนในรายวิชานี้มีส่วนที่ได้รับการพัฒนาขึ้นใหม่หรือปรับปรุงจากที่สอนเมื่อครั้งก่อน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="outsider_teach_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.outsider_teach_bl}
                                            onChange={handleCheckQuality}
                                        /> รายวิชานี้มีการให้ผู้มีประสบการณ์ทางวิชาการหรือวิชาชีพจากหน่วยงานภายนอกเข้ามามีส่วนร่วมในกระบวนการเรียนการสอน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="research_bl"
                                            type="checkbox" fromQualityAssurance
                                            checked={fromQualityAssurance.research_bl}
                                            onChange={handleCheckQuality}
                                        /> รายวิชานี้มีการบูรณาการกระบวนการวิจัยกับการจัดการเรียนการสอน หรือการจัดการเรียนรู้ที่พัฒนาจากการวิจัย <br />
                                        <input
                                            className="from-check-obe3"
                                            name="society_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.society_bl}
                                            onChange={handleCheckQuality}
                                        /> รายวิชานี้มีการบูรณาการงานบริการทางวิชาการแก่สังคมกับการเรียนการสอน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="culture_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.culture_bl}
                                            onChange={handleCheckQuality}
                                        /> รายวิชานี้มีการบูรณาการงานด้านทำนุบำรุงศิลปะและวัฒนธรรมกับการจัดการเรียนการสอนและกิจกรรมนักศึกษา
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 10. วันที่จัดทำหรือปรับปรุงรายละเอียดของรายวิชาครั้งล่าสุด </b> </label>
                                        <input
                                            className="from0-obe3"
                                            name="obe_latestC"
                                            type="text"
                                            value={formDataOBE3.obe_latestC}
                                            onChange={handleShowInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* หมวดที่ 2 ลักษณะและการดำเนินการ */}
                                <div className="mode2">
                                    <b> <p> หมวดที่ 2 ลักษณะและการดำเนินการ </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode"> <b> 1. คำอธิบายรายวิชา </b> </label>
                                        <textarea
                                            className="from-description-obe3"
                                            name="course_Description"
                                            type="text"
                                            value={showData.course_Description}
                                            onChange={handleShowInputChange}
                                            onInput={(event) => handleResize(event, setDescription1)}
                                            required
                                        />
                                        <textarea
                                            className="from-description-obe3"
                                            name="course_DescriptionEng"
                                            type="text"
                                            value={showData.course_DescriptionEng}
                                            onChange={handleShowInputChange}
                                            onInput={(event) => handleResize(event, setDescription2)}
                                            required
                                        />
                                    </div>

                                    <div className="description">
                                        <label className="from-mode"> <b> 2. จำนวนชั่วโมงต่อสัปดาห์ </b> </label>
                                        <table className="table-obe3">
                                            <thead>
                                                <tr>
                                                    <th> ทฤษฎี <br /> (ชั่วโมง) </th>
                                                    <th> ฝึกปฏิบัติ <br /> (ชั่วโมง) </th>
                                                    <th> การศึกษาด้วยตนเอง <br /> (ชั่วโมง) </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <input
                                                            className="from-hours-obe3"
                                                            name="obe_Sumtime_Theory"
                                                            type="text"
                                                            value={formDataOBE3.obe_Sumtime_Theory}
                                                            onChange={handleShowInputChange}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="from-hours-obe3"
                                                            name="obe_Sumtime_Practice"
                                                            type="text"
                                                            value={formDataOBE3.obe_Sumtime_Practice}
                                                            onChange={handleShowInputChange}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="from-hours-obe3"
                                                            name="obe_Sumtime_Selfeducation"
                                                            type="text"
                                                            value={formDataOBE3.obe_Sumtime_Selfeducation}
                                                            onChange={handleShowInputChange}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <label className="from-mode-obe3"> ลักษณะรายวิชา </label>
                                        <input
                                            className="from-check1-obe3"
                                            name="obe_description_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.obe_description_bl}
                                            onChange={handleCheckQuality}
                                        /> บรรยาย
                                        <input
                                            className="from-check1_1-obe3"
                                            name="obe_practice_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.obe_practice_bl}
                                            onChange={handleCheckQuality}
                                        /> ปฏิบัติการ <br />
                                        <label className="from-mode-obe3"> การวัดและประเมินผล </label>
                                        <input
                                            className="from-check2-obe3"
                                            name="obe_A_F_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.obe_A_F_bl}
                                            onChange={handleCheckQuality}
                                        /> A-F
                                        <input
                                            className="from-check2_1-obe3"
                                            name="obe_S_U_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.obe_S_U_bl}
                                            onChange={handleCheckQuality}
                                        /> S/U
                                        <input
                                            className="from-check2_2-obe3"
                                            name="obe_P_bl"
                                            type="checkbox"
                                            checked={fromQualityAssurance.obe_P_bl}
                                            onChange={handleCheckQuality}
                                        /> P
                                    </div>

                                    <div className="description">
                                        <label className="from-modes"> <b> 3. จำนวนชั่วโมงต่อสัปดาห์ที่จะให้คำปรึกษาและแนะนำทางวิชาการแก่นักศึกษา </b> </label>
                                        <button className="add-button-obe3" onClick={handleAddTimeData}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        {courseTimeData.map((ctd, index) => (
                                            <div key={index}>
                                                <input
                                                    className="from5-obe3"
                                                    name="conselling_Name"
                                                    type="text"
                                                    value={ctd.conselling_Name || ''}
                                                    onChange={(event) => handleTimeDataChange(index, event)}
                                                    placeholder="จำนวนชั่วโมงต่อสัปดาห์ที่จะให้คำปรึกษา"
                                                    required
                                                />
                                                <button className="delete-button-obe3" onClick={() => handleDeleteTimeData(index)}>
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="description">
                                        <label className="from-modes"> <b> 4. ผลลัพธ์การเรียนรู้ของรายวิชา (Course Learning Outcomes: CLOs) : นักศึกษาสามารถ </b> </label>
                                        <button className="add-button-obe3" onClick={handleAddCLOs}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>

                                        {/* Pull Data CLOs */}
                                        <button className="btn-search" onClick={handleSearchCLOs}> Search CLOs </button>

                                        {/* Chatbot QA */}
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <div className="question-button">
                                                ตัวอย่างคำถาม ถามบอท
                                                <div className="simple-tooltip">
                                                    {selectedCLOsQ.map((question, index) => (
                                                        <li key={index}>{question}</li>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {CloFromData.map((clos, CLOindex) => (
                                            <div key={CLOindex}>
                                                <input
                                                    className="from-clo-obe3"
                                                    name={`clo_code_${CLOindex}`}
                                                    type="text"
                                                    value={clos.clo_code || ''}
                                                    onChange={(e) => handleCLOsChange(CLOindex, 'clo_code', e.target.value)}
                                                    placeholder="รหัสเลข CLOs"
                                                    required
                                                />
                                                <input
                                                    className="from-clo-name-obe3"
                                                    name={`clo_Name_${CLOindex}`}
                                                    type="text"
                                                    value={clos.clo_Name || ''}
                                                    onChange={(e) => handleCLOsChange(CLOindex, 'clo_Name', e.target.value)}
                                                    placeholder="ชื่อ CLOs"
                                                    required
                                                />
                                                <button className="delete-button-obe3" onClick={handleDeleteCLOs}>
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="position">
                                            <button className="btn-save-clo" onClick={handleSaveCLOs}> Save CLOs </button>
                                        </div>
                                    </div>

                                    <div className="description">
                                        <label className="from-mode">
                                            <b> 5. ความสอดคล้องของผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (Expected Learning Outcomes: ELOs) </b> <br /> <b> และผลลัพธ์การเรียนรู้ของรายวิชา (Course Learning Outcomes: CLOs) </b>
                                            <label className="table-choose"> ตารางที่ 5.1
                                                <input
                                                    className="from-check3-obe3"
                                                    name="checkbox5_1"
                                                    type="checkbox"
                                                    checked={checkbox5_1}
                                                    onChange={() => handleCheckboxChoose(1)}
                                                />
                                            </label>
                                            <label className="table-choose"> ตารางที่ 5.2
                                                <input
                                                    className="from-check3-obe3"
                                                    name="checkbox5_2"
                                                    type="checkbox"
                                                    checked={checkbox5_2}
                                                    onChange={() => handleCheckboxChoose(2)}
                                                />
                                            </label>
                                        </label>
                                        {renderTable()}
                                    </div>
                                </div>

                                {/* หมวดที่ 3 การพัฒนานักศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง */}
                                <div className="mode3">
                                    <b> <p> หมวดที่ 3 การพัฒนานักศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode3"> วิธีการจัดประสบการณ์การเรียนรู้เพื่อพัฒนาความรู้หรือทักษะ และการวัดผลลัพธ์การเรียนรู้ของรายวิชา ที่สอดคล้องกับผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) ในหมวดที่ 2 ข้อ 4 </label>
                                        <table className="table2-obe3">
                                            <thead>
                                                <tr>
                                                    <th> ผลลัพธ์การเรียนรู้ที่ <br /> คาดหวังของรายวิชา (CLOs) </th>
                                                    <th> วิธีการจัดการสอน/ประสบการณ์การ <br /> เรียนรู้ตาม CLOs </th>
                                                    <th> วิธีการวัดผลลัพธ์ <br /> การเรียนรู้ตาม CLOs <br /> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {CloFromData.map((clo, CLOindex) => (
                                                    <tr key={CLOindex}>
                                                        <td>
                                                            <textarea
                                                                className="from-exp-obe3"
                                                                name={`cloCodeName${CLOindex}`}
                                                                type="text"
                                                                value={`${clo.clo_code} ${clo.clo_Name} `}
                                                                key={clo.clo_Id}
                                                                onChange={(e) => handleCLOsChange(CLOindex, 'cloCodeName', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-exp-obe3"
                                                                name={`experience_Name${CLOindex}`}
                                                                type="text"
                                                                value={experience[CLOindex]?.experience_Name || ''}
                                                                onChange={(event) => handleExperienceChange(event.target.value, 'experience_Name', CLOindex)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-exp-obe3"
                                                                name={`measuring_Name${CLOindex}`}
                                                                type="text"
                                                                value={measuring[CLOindex]?.measuring_Name || ''}
                                                                onChange={(event) => handleMeasuringChange(event.target.value, 'measuring_Name', CLOindex)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* หมวดที่ 4 แผนการสอนและการประเมินผล */}
                                <div className="mode4">
                                    <b> <p> หมวดที่ 4 แผนการสอนและการประเมินผล </p> </b> <br />

                                    <div className="description">
                                        <label className="from-modes"> <b> 1. แผนการสอน </b> </label>
                                        <button className="add-button-obe3" onClick={handleAddPlan}> <FontAwesomeIcon icon={faPlus} /> </button>

                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <div className="question-button">
                                                ตัวอย่างคำถาม ถามบอท
                                                <div className="simple-tooltip">
                                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                        {selectedQuestions.map((question, index) => (
                                                            <li key={index}>{question}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <table className="table3-obe3">
                                            <thead>
                                                <tr>
                                                    <th rowSpan={2}> สัปดาห์ที่ </th>
                                                    <th rowSpan={2}> หัวข้อ/รายละเอียด </th>
                                                    <th rowSpan={2}> CLOs </th>
                                                    <th colSpan={2}> จำนวนชั่วโมง </th>
                                                    <th rowSpan={2}> กิจกรรมการเรียนการสอน สื่อที่ใช้ (ถ้ามี) </th>
                                                </tr>
                                                <tr>
                                                    <th> บรรยาย </th>
                                                    <th> ปฎิบัติการ </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Plans.map((plan, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="from-table1"
                                                                name="plan_weekend"
                                                                type="text"
                                                                value={index + 1}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table2"
                                                                name={`plan_Name${index}`}
                                                                type="text"
                                                                value={plan.plan_Name || ''}
                                                                onChange={(e) => handlePlanChange(index, 'plan_Name', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table3"
                                                                name={`plan_Clo${index}`}
                                                                type="text"
                                                                value={plan.plan_Clo || ''}
                                                                onChange={(e) => handlePlanChange(index, 'plan_Clo', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table4"
                                                                name={`lecture_Hours${index}`}
                                                                type="text"
                                                                value={plan.lecture_Hours || ''}
                                                                onChange={(e) => handlePlanChange(index, 'lecture_Hours', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="from-table4"
                                                                name={`pratice_Hours${index}`}
                                                                type="text"
                                                                value={plan.pratice_Hours || ''}
                                                                onChange={(e) => handlePlanChange(index, 'pratice_Hours', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table5"
                                                                name={`plan_description${index}`}
                                                                type="text"
                                                                value={plan.plan_description || ''}
                                                                onChange={(e) => handlePlanChange(index, 'plan_description', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td className="none">
                                                            <button className="delete-button-obe3" onClick={() => handleDeletePlan(index)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="description">
                                        <label className="from-modes"> <b> 2. แผนการประเมินตามผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา </b> </label>
                                        <button className="add-button-obe3" onClick={handleAddAssessment}> <FontAwesomeIcon icon={faPlus} /> </button>
                                        <table className="table4-obe3">
                                            <thead>
                                                <tr>
                                                    <th> ผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) </th>
                                                    <th> กิจกรรมการประเมินผลการเรียนรู้ของผู้เรียน </th>
                                                    <th> กำหนดการประเมิน (สัปดาห์ที่) </th>
                                                    <th> สัดส่วนของการประเมินผล </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assessments.map((assessment, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <textarea
                                                                className="from-table2"
                                                                name="assessment_outCome"
                                                                type="text"
                                                                value={assessment.assessment_outCome || ''}
                                                                onChange={(event) => handleAssessmentChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table2"
                                                                name="activity_Learning"
                                                                type="text"
                                                                value={assessment.activity_Learning || ''}
                                                                onChange={(event) => handleAssessmentChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table5"
                                                                name="assessment_Deadline"
                                                                type="text"
                                                                value={assessment.assessment_Deadline || ''}
                                                                onChange={(event) => handleAssessmentChange(index, event)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className="from-table5"
                                                                name="assessment_Proportion"
                                                                type="text"
                                                                value={assessment.assessment_Proportion || ''}
                                                                onChange={(event) => handleAssessmentChange(index, event)}
                                                            />
                                                        </td>
                                                        <td className="none">
                                                            <button className="delete-button-obe3" onClick={() => handleDeleteAssessment(index)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* หมวดที่ 5 ทรัพยากรประกอบการเรียนการสอน */}
                                <div className="mode5">
                                    <b> <p> หมวดที่ 5 ทรัพยากรประกอบการเรียนการสอน </p> </b> <br />

                                    <div className="description">
                                        <label className="name-treatise"> ตำราและเอกสารที่ใช้ประกอบการเรียนการสอน </label>
                                        <button className="add-button-obe3" onClick={handleAddTreatise}> <FontAwesomeIcon icon={faPlus} /> </button>
                                        {Treatises.map((treatise, index) => (
                                            <div key={index}>
                                                <input
                                                    className="from5-obe3"
                                                    name="textbook_Name"
                                                    type="text"
                                                    value={treatise.textbook_Name || ''}
                                                    onChange={(event) => handleTreatiseChange(index, event)}
                                                    placeholder="ชื่อตำราและเอกสารที่ใช้ประกอบการเรียนการสอน"
                                                />
                                                <button className="delete-button-obe3" onClick={() => handleDeleteTreatise(index)}> <FontAwesomeIcon icon={faMinus} /> </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* หมวดที่ 6 การประเมินและปรับปรุงการดาเนินการของรายวิชา */}
                                <div className="mode6">
                                    <b> <p> หมวดที่ 6 การประเมินและปรับปรุงการดำเนินการของรายวิชา </p> </b> <br />

                                    <div className="description">
                                        <label className="from-mode-c6"> <b> 1. กลยุทธ์การประเมินประสิทธิผลของรายวิชาโดยนักศึกษา </b> </label>
                                        <input
                                            className="from-check-obe3"
                                            name="assess_course_bl"
                                            type="checkbox"
                                            value="แบบประเมินรายวิชา"
                                            checked={formDataOBE3.assess_course_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, assess_course_bl: !formDataOBE3.assess_course_bl })}
                                        /> แบบประเมินรายวิชา <br />
                                        <input
                                            className="from-check-obe3"
                                            name="discuss_bl"
                                            type="checkbox"
                                            value="การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน"
                                            checked={formDataOBE3.discuss_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, discuss_bl: !formDataOBE3.discuss_bl })}
                                        /> การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="reflection_bl"
                                            type="checkbox"
                                            value="การสะท้อนคิด จากพฤติกรรมของผู้เรียน"
                                            checked={formDataOBE3.reflection_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, reflection_bl: !formDataOBE3.reflection_bl })}
                                        /> การสะท้อนคิด จากพฤติกรรมของผู้เรียน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="suggestion_bl"
                                            type="checkbox"
                                            value="ข้อเสนอแนะผ่านช่องทางออนไลน์ ที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา"
                                            checked={formDataOBE3.suggestion_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, suggestion_bl: !formDataOBE3.suggestion_bl })}
                                        /> ข้อเสนอแนะผ่านช่องทางออนไลน์ ที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา <br />
                                        <input
                                            className="from-check-obe3"
                                            name="other6_1_bl"
                                            type="checkbox"
                                            value="อื่นๆ(ระบุ)"
                                            checked={formDataOBE3.other6_1_bl}
                                            onChange={() => {
                                                setFormDataOBE3((prevData) => ({
                                                    ...prevData,
                                                    other6_1_bl: !prevData.other6_1_bl,
                                                    other6_1_description: prevData.other6_1_bl ? '' : prevData.other6_1_description,
                                                }));
                                            }}
                                        />
                                        <label className="other-obe3"> อื่นๆ (ระบุ) </label>
                                        {formDataOBE3.other6_1_bl && (
                                            <input
                                                className="from-other-obe3"
                                                name="other6_1_description"
                                                value={formDataOBE3.other6_1_description}
                                                onChange={(event) => setFormDataOBE3({ ...formDataOBE3, other6_1_description: event.target.value })}
                                            />
                                        )}

                                        <label className="from-mode1-c6"> <b> 2. กลยุทธ์การประเมินการจัดการเรียนรู้ </b> </label>
                                        <input
                                            className="from-check-obe3"
                                            name="teacher_Evalu_bl"
                                            type="checkbox"
                                            value="แบบประเมินผู้สอน"
                                            checked={formDataOBE3.teacher_Evalu_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, teacher_Evalu_bl: !formDataOBE3.teacher_Evalu_bl })}
                                        /> แบบประเมินผู้สอน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="exam_result_bl"
                                            type="checkbox"
                                            value="ผลการสอบ"
                                            checked={formDataOBE3.exam_result_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, exam_result_bl: !formDataOBE3.exam_result_bl })}
                                        /> ผลการสอบ <br />
                                        <input
                                            className="from-check-obe3"
                                            name="verification_bl"
                                            type="checkbox"
                                            value="การทวนสอบผลประเมินผลลัพธ์การเรียนรู้"
                                            checked={formDataOBE3.verification_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, verification_bl: !formDataOBE3.verification_bl })}
                                        /> การทวนสอบผลประเมินผลลัพธ์การเรียนรู้ <br />
                                        <input
                                            className="from-check-obe3"
                                            name="ex_Evalu_comit_bl"
                                            type="checkbox"
                                            value="การประเมินโดยคณะกรรมการประเมินข้อสอบ"
                                            checked={formDataOBE3.ex_Evalu_comit_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, ex_Evalu_comit_bl: !formDataOBE3.ex_Evalu_comit_bl })}
                                        /> การประเมินโดยคณะกรรมการประเมินข้อสอบ <br />
                                        <input
                                            className="from-check-obe3"
                                            name="observation_bl"
                                            type="checkbox"
                                            value="การสังเกตการณ์สอนของผู้ร่วมทีมการสอน"
                                            checked={formDataOBE3.observation_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, observation_bl: !formDataOBE3.observation_bl })}
                                        /> การสังเกตการณ์สอนของผู้ร่วมทีมการสอน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="other6_2_bl"
                                            type="checkbox"
                                            value="อื่นๆ(ระบุ)"
                                            checked={formDataOBE3.other6_2_bl}
                                            onChange={() => {
                                                setFormDataOBE3((prevData) => ({
                                                    ...prevData,
                                                    other6_2_bl: !prevData.other6_2_bl,
                                                    other6_2_description: prevData.other6_2_bl ? '' : prevData.other6_2_description,
                                                }));
                                            }}
                                        />
                                        <label className="other-obe3"> อื่นๆ (ระบุ) </label>
                                        {formDataOBE3.other6_2_bl && (
                                            <input
                                                className="from-other-obe3"
                                                name="other6_2_description"
                                                value={formDataOBE3.other6_2_description}
                                                onChange={(event) => setFormDataOBE3({ ...formDataOBE3, other6_2_description: event.target.value })}
                                            />
                                        )}

                                        <label className="from-mode1-c6"> <b> 3. กลไกการปรับปรุงการจัดการเรียนรู้ </b> </label>
                                        <input
                                            className="from-check-obe3"
                                            name="teach_Seminar_bl"
                                            type="checkbox"
                                            value="สัมมนาการจัดการเรียนการสอน"
                                            checked={formDataOBE3.teach_Seminar_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, teach_Seminar_bl: !formDataOBE3.teach_Seminar_bl })}
                                        /> สัมมนาการจัดการเรียนการสอน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="researchInOut_bl"
                                            type="checkbox"
                                            value="การวิจัยในและนอกชั้นเรียน"
                                            checked={formDataOBE3.researchInOut_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, researchInOut_bl: !formDataOBE3.researchInOut_bl })}
                                        /> การวิจัยในและนอกชั้นเรียน <br />
                                        <input
                                            className="from-check-obe3"
                                            name="other6_3_bl"
                                            type="checkbox"
                                            value="อื่นๆ(ระบุ)"
                                            checked={formDataOBE3.other6_3_bl}
                                            onChange={() => {
                                                setFormDataOBE3((prevData) => ({
                                                    ...prevData,
                                                    other6_3_bl: !prevData.other6_3_bl,
                                                    other6_3_description: prevData.other6_3_bl ? '' : prevData.other6_3_description,
                                                }));
                                            }}
                                        />
                                        <label className="other-obe3"> อื่นๆ (ระบุ) </label>
                                        {formDataOBE3.other6_3_bl && (
                                            <input
                                                className="from-other-obe3"
                                                name="other6_3_description"
                                                value={formDataOBE3.other6_3_description}
                                                onChange={(event) => setFormDataOBE3({ ...formDataOBE3, other6_3_description: event.target.value })}
                                            />
                                        )}

                                        <label className="from-mode1-c6"> <b> 4. กระบวนการทวนสอบผลลัพธ์การเรียนรู้ของรายวิชาของนักศึกษา </b> </label>
                                        <input
                                            className="from-check-obe3"
                                            name="commit_course_bl"
                                            type="checkbox"
                                            value="มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินผลลัพธ์การเรียนรู้ของนักศึกษา วิธีการให้คะแนนสอบ และการให้คะแนนพฤติกรรม"
                                            checked={formDataOBE3.commit_course_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, commit_course_bl: !formDataOBE3.commit_course_bl })}
                                        /> มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินผลลัพธ์การเรียนรู้ของนักศึกษา วิธีการให้คะแนน <label className="name-mode-c6 "> สอบและการให้คะแนนพฤติกรรม </label>
                                        <input
                                            className="from-check-obe3"
                                            name="check_depart_bl"
                                            type="checkbox"
                                            value="การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ"
                                            checked={formDataOBE3.check_depart_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, check_depart_bl: !formDataOBE3.check_depart_bl })}
                                        /> การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ <br />
                                        <input
                                            className="from-check-obe3"
                                            name="check_teacher_bl"
                                            type="checkbox"
                                            value="การสะท้อนคิด จากพฤติกรรมของผู้เรียน"
                                            checked={formDataOBE3.check_teacher_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, check_teacher_bl: !formDataOBE3.check_teacher_bl })}
                                        /> การทวนสอบการให้คะแนนจากการสุ่มตรวจผลงานของนักศึกษาโดยอาจารย์ หรือผู้ทรงคุณวุฒิอื่นๆ ที่ไม่ใช่อาจารย์ประจำหลักสูตร <br />
                                        <input
                                            className="from-check-obe3"
                                            name="other6_4_bl"
                                            type="checkbox"
                                            value="อื่นๆ(ระบุ)"
                                            checked={formDataOBE3.other6_4_bl}
                                            onChange={() => {
                                                setFormDataOBE3((prevData) => ({
                                                    ...prevData,
                                                    other6_4_bl: !prevData.other6_4_bl,
                                                    other6_4_description: prevData.other6_4_bl ? '' : prevData.other6_4_description,
                                                }));
                                            }}
                                        />
                                        <label className="other-obe3"> อื่นๆ (ระบุ) </label>
                                        {formDataOBE3.other6_4_bl && (
                                            <input
                                                className="from-other-obe3"
                                                name="other6_4_description"
                                                value={formDataOBE3.other6_4_description}
                                                onChange={(event) => setFormDataOBE3({ ...formDataOBE3, other6_4_description: event.target.value })}
                                            />
                                        )}

                                        <label className="from-mode1-c6"> <b> 5. การดำเนินการทบทวนและการวางแผนปรับปรุงประสิทธิผลของรายวิชา </b> </label>
                                        <input
                                            className="from-check-obe3"
                                            name="improve_offer_bl"
                                            type="checkbox"
                                            value="ปรับปรุงรายวิชาในแต่ละปี ตามข้อเสนอแนะและผลการทวนสอบตามข้อ 4"
                                            checked={formDataOBE3.improve_offer_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, improve_offer_bl: !formDataOBE3.improve_offer_bl })}
                                        /> ปรับปรุงรายวิชาในแต่ละปี ตามข้อเสนอแนะและผลการทวนสอบตามข้อ 4 <br />
                                        <input
                                            className="from-check-obe3"
                                            name="improve_By_stu_bl"
                                            type="checkbox"
                                            value="ปรับปรุงรายวิชาในแต่ละปี ตามผลการประเมินผู้สอนโดยนักศึกษา"
                                            checked={formDataOBE3.improve_By_stu_bl}
                                            onChange={() => setFormDataOBE3({ ...formDataOBE3, improve_By_stu_bl: !formDataOBE3.improve_By_stu_bl })}
                                        /> ปรับปรุงรายวิชาในแต่ละปี ตามผลการประเมินผู้สอนโดยนักศึกษา <br />
                                        <input
                                            className="from-check-obe3"
                                            name="other6_5_bl"
                                            type="checkbox"
                                            value="อื่นๆ(ระบุ)"
                                            checked={formDataOBE3.other6_5_bl}
                                            onChange={() => {
                                                setFormDataOBE3((prevData) => ({
                                                    ...prevData,
                                                    other6_5_bl: !prevData.other6_5_bl,
                                                    other6_5_description: prevData.other6_5_bl ? '' : prevData.other6_5_description,
                                                }));
                                            }}
                                        />
                                        <label className="other-obe3"> อื่นๆ (ระบุ) </label>
                                        {formDataOBE3.other6_5_bl && (
                                            <input
                                                className="from-other-obe3"
                                                name="other6_5_description"
                                                value={formDataOBE3.other6_5_description}
                                                onChange={(event) => setFormDataOBE3({ ...formDataOBE3, other6_5_description: event.target.value })}
                                            />
                                        )}
                                    </div>
                                </div>

                            </div>
                        </form>

                        {/* Function Button Fill Out Document OBE 3 */}
                        <div className="button-container">
                            {/* Save Data OBE 3 */}
                            <button className="button-save-obe3" type="button" onClick={handleSaveData}> Save </button>

                            {/* Download OBE 3 */}
                            <button className="button-download-obe3" type="button" onClick={RenderPDF}> Download </button>
                        </div>

                    </div>
                </div >

            </div >
        </>
    );
}

export default Fill_obe3;