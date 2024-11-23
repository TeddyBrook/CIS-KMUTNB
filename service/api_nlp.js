const express = require('express');
const router = express.Router();

module.exports = (db) => {

    router.post('/get-course-info', (req, res) => {

        const { question } = req.body;
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('รหัสวิชา') && lowerQuestion.includes('คำอธิบาย')) {

            const courseCode = lowerQuestion.match(/รหัสวิชา (\w+)/)?.[1];

            if (courseCode) {

                const query = `SELECT * FROM course WHERE course_Code = ?`;

                db.query(query, [courseCode], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the database' });
                        return;
                    }

                    if (results.length > 0) {
                        const course = results[0];
                        res.send({ answer: `คำอธิบายรายวิชา: ${course.course_Description}` });
                    } else {
                        res.send({ answer: `ไม่มีข้อมูลสำหรับรหัสวิชา ${courseCode}` });
                    }
                });
            } else {
                res.send({ answer: 'รูปแบบคำถามไม่ถูกต้อง' });
            }
        }

        else if (lowerQuestion.includes('ชื่อวิชา') && lowerQuestion.includes('คำอธิบาย')) {

            const courseName = lowerQuestion.match(/ชื่อวิชา ([^ ]+)/)?.[1];

            if (courseName) {

                const query = `SELECT * FROM course WHERE course_Name LIKE ? OR course_NameEng LIKE ?`;

                db.query(query, [`%${courseName}%`, `%${courseName}%`], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {
                        const course = results[0];
                        res.send({ answer: `คำอธิบายรายวิชา: ${course.course_Description}` });
                    } else {
                        res.send({ answer: `ไม่มีข้อมูลสำหรับชื่อวิชา ${courseName}` });
                    }
                });
            } else {
                res.send({ answer: 'รูปแบบคำถามไม่ถูกต้อง' });
            }
        }

        else if (lowerQuestion.includes('รหัสวิชา') && lowerQuestion.includes('ชื่อวิชาอะไร')) {

            const courseCode = lowerQuestion.match(/รหัสวิชา (\w+)/)?.[1];

            if (courseCode) {

                const query = `SELECT * FROM course WHERE course_Code = ?`;

                db.query(query, [courseCode], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {
                        const course = results[0];
                        res.send({ answer: `ชื่อวิชา: ${course.course_NameEng}` });
                    } else {
                        res.send({ answer: `ไม่มีรหัสวิชา ${courseCode} ในฐานข้อมูล` });
                    }
                });
            } else {
                res.send({ answer: 'รูปแบบคำถามไม่ถูกต้อง' });
            }
        }

        else if (lowerQuestion.includes('ชื่อวิชา') && lowerQuestion.includes('รหัสวิชาอะไร')) {

            const courseName = lowerQuestion.match(/ชื่อวิชา ([^ ]+)/)?.[1];

            if (courseName) {

                const query = `SELECT * FROM course WHERE course_Name LIKE ? OR course_NameEng LIKE ?`;

                db.query(query, [`%${courseName}%`, `%${courseName}%`], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {
                        const course = results[0];
                        res.send({ answer: `รหัสวิชา: ${course.course_Code}` });
                    } else {
                        res.send({ answer: `ไม่มีชื่อวิชา ${courseName} ในฐานข้อมูล` });
                    }
                });
            } else {
                res.send({ answer: 'รูปแบบคำถามไม่ถูกต้อง' });
            }
        }

        else if (lowerQuestion.includes('แสดงข้อมูลของวิชา') || lowerQuestion.includes('ขอข้อมูลวิชา')) {

            const courseCode = lowerQuestion.match(/วิชา (\w+)/)?.[1];
            const courseName = lowerQuestion.match(/(?:ชื่อ\s)?วิชา\s([^ ]+)/)?.[1];

            if (courseCode) {

                const query = `SELECT * FROM course WHERE course_Code = ?`;

                db.query(query, [courseCode], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {
                        const course = results[0];
                        res.send({
                            answer: `รหัสวิชา: ${course.course_Code}
                            ชื่อวิชา: ${course.course_NameEng}
                            คำอธิบายรายวิชา: ${course.course_Description}
                            คำอธิบายรายวิชาภาษาอังกฤษ: ${course.course_DescriptionEng}
                            หน่วยกิต: ${course.course_Credit}
                            หมวดวิชา: ${course.course_Category}
                            ผู้รับผิดชอบวิชา: ${course.responsible_Teacher}
                            เทอม: ${course.semster_term}
                            ปีที่: ${course.year_of_study}
                            prerequisites: ${course.prerequisites}
                            corequisites: ${course.corequisites}
                            `
                        });
                    } else {
                        res.send({ answer: `ไม่มีข้อมูลรายวิชา ${courseCode} นี้` });
                    }
                });
            }

            else if (courseName) {

                const query = `SELECT * FROM course WHERE course_Name LIKE ? OR course_NameEng LIKE ?`;

                db.query(query, [`%${courseName}%`, `%${courseName}%`], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {
                        const course = results[0];
                        res.send({
                            answer: `รหัสวิชา: ${course.course_Code} 
                            ชื่อวิชา: ${course.course_NameEng}
                            คำอธิบายรายวิชา: ${course.course_Description}
                            คำอธิบายรายวิชาภาษาอังกฤษ: ${course.course_DescriptionEng}
                            หน่วยกิต: ${course.course_Credit}
                            หมวดวิชา: ${course.course_Category}
                            ผู้รับผิดชอบวิชา: ${course.responsible_Teacher}
                            เทอม: ${course.semster_term}
                            ปีที่: ${course.year_of_study}
                            prerequisites: ${course.prerequisites}
                            corequisites: ${course.corequisites}
                            `
                        });
                    } else {
                        res.send({ answer: `ไม่มีข้อมูลรายชื่อวิชา ${courseName} นี้` });
                    }
                });
            }

            else {
                res.send({ answer: 'รูปแบบคำถามไม่ถูกต้อง' });
            }
        }

        else if (lowerQuestion.includes('คนสอนวิชา') || lowerQuestion.includes('อาจารย์ผู้สอนวิชา')) {

            const courseCode = lowerQuestion.match(/วิชา (\w+)/)?.[1];
            const courseName = lowerQuestion.match(/(?:ชื่อ\s)?วิชา\s([^ ]+)/)?.[1];

            if (courseCode) {
                const query = `SELECT u.user_FirstName,u.user_LastName 
                FROM user u 
                    JOIN user_course uc 
                        ON u.user_Id = uc.user_Id 
                    JOIN course c 
                        ON uc.course_Id = c.course_Id 
                    WHERE c.course_Code = ?;`;

                db.query(query, [courseCode], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {

                        const teacher = results.map(r => `${r.user_FirstName} ${r.user_LastName}`).join(', ');

                        res.send({
                            answer: `ชื่ออาจารย์ผู้สอนวิชา:${courseCode}:
                            ${teacher}`
                        });
                    } else {
                        res.send({ answer: `ไม่มีชื่ออาจารย์ที่สอนวิชา: ${courseCode}` });
                    }
                });
            }

            else if (courseName) {
                const query = `SELECT u.user_FirstName,u.user_LastName 
                FROM user u 
                    JOIN user_course uc 
                        ON u.user_Id = uc.user_Id 
                    JOIN course c 
                        ON uc.course_Id = c.course_Id 
                    WHERE c.course_Name LIKE ? OR c.course_NameEng LIKE ?;`;

                db.query(query, [`%${courseName}`, `${courseName}`], (err, results) => {
                    if (err) {
                        console.error('Error executing query', err);
                        res.status(500).send({ answer: 'Error querying the Database' });
                        return;
                    }

                    if (results.length > 0) {

                        const courseCode = results[0].course_Code;
                        const teacher = results.map(r => `${r.user_FirstName} ${r.user_LastName}`).join(', ');

                        res.send({
                            answer: `ชื่ออาจารย์ผู้สอนวิชา ${courseCode}:
                            ${teacher}`
                        });
                    } else {
                        res.send({ answer: `ไม่มีชื่ออาจารย์ที่สอนวิชา: ${courseName}` });
                    }
                })
            }

            else {
                res.send({ answer: 'รูปแบบคำถามไม่ถูกต้อง' });
            }
        }

        else {
            res.send({ answer: 'ไม่สามารถเข้าใจคำถามได้' });
        }
    });

    return router;
}