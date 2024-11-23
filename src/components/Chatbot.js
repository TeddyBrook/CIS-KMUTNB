import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

/* CSS */
import '../style/Chatbot.css';

/* Data Set */
import data from '../data_set/Dataset.json';

import axios from "axios";

const API_KEY = '25kKzPl7L5cqjXSSi0wxJRxMji3yRecA';
const QA_API_URL = 'https://api.aiforthai.in.th/qaiapp';

function Chatbot() {
    const [question, setQuestion] = useState('');
    const [context, setContext] = useState('');
    const [chat, setChat] = useState([]);
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const [localData, setLocalData] = useState([{ courses: [] }]);
    const [expandmessage, setexpandmessage] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLocalData(data);
    }, []);

    const ControlDataJSON = (question) => {

        const lowerQuestion = question.toLowerCase();

        /* กำหนดการจับคู่สำหรับคำถาม */
        const courseIdMatch = lowerQuestion.match(/วิชา\s(\w+)/);
        const courseId = courseIdMatch ? courseIdMatch[1] : null;

        const courseNameMatch = lowerQuestion.match(/วิชา\s([^ ]+)/);
        const courseName = courseNameMatch ? courseNameMatch[1] : null;

        const cloMatch = lowerQuestion.match(/clo\s(\d+)/);
        const cloNumber = cloMatch ? `CLO${cloMatch[1]}` : null;

        const prerequisitesCheck = lowerQuestion.includes('วิชาที่ต้องเรียนก่อน');
        const corequisitesCheck = lowerQuestion.includes('วิชาบังคับร่วม');

        const findCourseDetails = (course) => {
            /* ถามชื่อวิชา */
            if (courseId && lowerQuestion.includes('ชื่อวิชาอะไร')) {
                return `ชื่อวิชา: ${course.course_Name}`;
            }

            /* ถามรหัสวิชา */
            if (courseName && lowerQuestion.includes('รหัสวิชาอะไร')) {
                return `รหัสวิชา: ${course.course_Id}`;
            }

            /* ถามชื่อวิชาภาษาอังกฤษ */
            if (lowerQuestion.includes('ชื่อวิชาภาษาอังกฤษ')) {
                if (courseId && course.course_Id.toLowerCase() === courseId.toLowerCase()) {
                    return `ชื่อวิชาภาษาอังกฤษ: ${course.course_NameEng}`;
                }

                if (courseName && course.course_Name.toLowerCase().includes(courseName.toLowerCase())) {
                    return `ชื่อวิชาภาษาอังกฤษ: ${course.course_NameEng}`;
                }
            }

            /* ถาม CLOs */
            if (cloNumber && course.CLOs[cloNumber]) {
                if (courseId && lowerQuestion.includes(`ของวิชา ${courseId}`)) {
                    return `${cloNumber} ของวิชา ${course.course_Id}:\n${course.CLOs[cloNumber]}`;
                }

                if (courseName && lowerQuestion.includes(`ของวิชา ${courseName}`)) {
                    return `${cloNumber} ของวิชา ${course.course_Name}:\n${course.CLOs[cloNumber]}`;
                }
            }

            /* ตรวจสอบ CLOs ทั้งหมด */
            if (lowerQuestion.includes('clo ทั้งหมด') || lowerQuestion.includes('CLO ทั้งหมด')) {
                if (courseId) {
                    const cloes = Object.entries(course.CLOs).map(([key, value]) => `${key}: ${value}`).join('\n');
                    return `CLO ทั้งหมดของวิชา ${course.course_Id}:\n${cloes}`;
                }
            }

            if (lowerQuestion.includes('clo ทั้งหมด') || lowerQuestion.includes('CLO ทั้งหมด')) {
                if (courseName && course.course_Name.toLowerCase().includes(courseName.toLowerCase())) {
                    const cloes = Object.entries(course.CLOs).map(([key, value]) => `${key}: ${value}`).join('\n');
                    return `CLO ทั้งหมดของวิชา ${course.course_Name}:\n${cloes}`;
                }
            }

            /* ถามแผนการสอน */
            if (lowerQuestion.includes('แผนการสอน')) {
                const totalHours = course.plans.reduce((total, p) => total + p.hours, 0);
                const plans = course.plans.map(p => `สัปดาห์ ${p.week}: ${p.topic} (${p.hours} ชั่วโมง)`).join('\n');

                if (courseId && course.course_Id === courseId) {
                    return `แผนการสอนสำหรับ ${course.course_Id}:\n${plans}\nรวมทั้งหมด: ${totalHours} ชั่วโมง`;
                }

                if (courseName && course.course_Name.toLowerCase().includes(courseName.toLowerCase())) {
                    return `แผนการสอนสำหรับ ${course.course_Name}:\n${plans}\nรวมทั้งหมด: ${totalHours} ชั่วโมง`;
                }
            }

            /* ถามวิชาที่ต้องเรียนก่อน */
            if (courseId && prerequisitesCheck) {
                return `วิชาที่ต้องเรียนก่อนวิชา ${course.course_Id}: ${course.prerequisites}`;
            }

            if (courseId && corequisitesCheck) {
                return `วิชาบังคับร่วม ${course.course_Id}: ${course.corequisites}`;
            }

            if (courseName && prerequisitesCheck) {
                return `วิชาที่ต้องเรียนก่อนวิชา ${course.course_Name}: ${course.prerequisites}`;
            }

            if (courseName && corequisitesCheck) {
                return `วิชาบังคับร่วม ${course.course_Name}: ${course.corequisites}`;
            }

            /* ถามคำอธิบายรายวิชา */
            if (courseId && (lowerQuestion.includes('คำอธิบายรายวิชา') || lowerQuestion.includes('คำอธิบาย'))) {
                if (course.course_Id.toLowerCase() === courseId.toLowerCase()) {
                    return `คำอธิบายของ ${course.course_Id}:\n${course.description}`;
                }
            }

            if (courseName && (lowerQuestion.includes('คำอธิบายรายวิชา') || lowerQuestion.includes('คำอธิบาย'))) {
                if (course.course_Name.toLowerCase().includes(courseName.toLowerCase())) {
                    return `คำอธิบายของ ${course.course_Name}:\n${course.description}`;
                }
            }

            return null; /* return null ถ้าไม่พบข้อมูล */
        };

        for (const course of localData.courses) {
            const result = findCourseDetails(course);
            if (result) return result; /* return ผลลัพธ์แรกที่พบ */
        }

        return "ไม่พบข้อมูลที่เกี่ยวข้อง"; /* กรณีไม่พบข้อมูล */
    };

    const sendMessage = async () => {

        if (question.trim() === '') return;

        setChat(prevChat => [...prevChat, { user: 'You', message: question }]);
        setQuestion('');

        const jsonAnswer = ControlDataJSON(question);

        console.log('JSON Answer:', jsonAnswer);
        if (jsonAnswer) {
            setChat(prevChat => [...prevChat, { user: 'NLP', message: jsonAnswer }]);
            return;
        }

        try {

            const response = await axios.post('http://localhost:8081/api/get-course-info', { question });
            const dbAnswer = response.data.answer;

            if (dbAnswer) {
                setChat(prevChat => [...prevChat, { user: 'Bot', message: dbAnswer }]);
                console.log('For Answer data on Database');
                return;
            }

            const botResponse = await axios.post(QA_API_URL, { question, context }, {
                headers: {
                    'Apikey': API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            setChat(prevChat => [...prevChat, { user: 'NLP', message: botResponse.data }]);

        } catch (error) {
            console.error(error);
            setChat(prevChat => [...prevChat, { user: 'NLP', message: 'Error processing request' }]);
        }
    };

    const toggleChatbot = () => {
        setIsChatbotVisible(!isChatbotVisible);
    };

    const openModal = (message) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="chatbot-container">

            <button className="chatbot-button" onClick={toggleChatbot}>
                <FontAwesomeIcon icon={faComments} />
            </button>

            {isChatbotVisible && (
                <div className="chatbot-popup">
                    <h1> Question & Answer </h1>

                    <div className="chatbox">
                        {chat.map((cbqa, index) => (
                            <div key={index} className={`message ${cbqa.user.toLowerCase()}`}>
                                {cbqa.user}: {cbqa.message.length > 100 && expandmessage !== index ? cbqa.message.slice(0, 100) : cbqa.message}
                                {cbqa.message.length > 100 && (
                                    <Button variant="link" className="expand-button" onClick={() => openModal(cbqa.message)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="ถามคำถามได้ที่นี่?"
                        />
                        <button className="chat-submit" onClick={sendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}

            <Modal show={isModalOpen} onHide={closeModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title> รายละเอียดข้อความ </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="modal-body" dangerouslySetInnerHTML={{ __html: selectedMessage }} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}> Close </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Chatbot; 