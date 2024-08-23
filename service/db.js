const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8081;
const secretKey = 'teacher';

app.use(cors());
app.use(express.json({ limit: '800mb' }));
app.use(express.urlencoded({ limit: '800mb', extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'KritsadaBM224688',
    database: 'obe'
});

const upload = multer({ storage: storage });

app.post("/api/register", (req, res) => {
    const { user_FirstName, user_LastName, user_Name, passwords, email, qualification, role_Id } = req.body;
    const sqlInsertUser = `INSERT INTO user (user_FirstName, user_LastName, user_Name, passwords, email, qualification, role_Id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sqlInsertUser, [user_FirstName, user_LastName, user_Name, passwords, email, qualification, role_Id], (userError, userResult) => {
        if (userError) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const user_Id = userResult.insertId;
        res.json({ user_Id });
    });
});

app.post("/api/role", (req, res) => {
    const { role_Name, user_Id } = req.body;
    const sqlInsertRole = `INSERT INTO role (role_Name, user_Id) VALUES (?,?)`;

    db.query(sqlInsertRole, [role_Name, user_Id], (roleError, roleResult) => {
        if (roleError) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Role Added Successful' });
    });
});

app.put("/api/update-user-role/:user_Id", (req, res) => {
    const { user_Id } = req.params;
    const { role_Name } = req.body;

    db.query("SELECT role_Id FROM role WHERE user_Id = ?", [user_Id], (roleError, roleResult) => {
        if (roleError) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const userRoleIds = roleResult.map((row) => row.role_Id);

        db.query("UPDATE user SET role_Id = ? WHERE user_Id = ?", [userRoleIds.join(','), user_Id], (updateError, updateResult) => {
            if (updateError) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json({ message: 'User Role Updated Successful' });
        });
    });
});

app.post("/api/login", async (req, res) => {
    const { user_Name, passwords } = req.body;

    db.query('SELECT user.*, role.role_Name FROM user JOIN role ON user.role_Id = role.role_Id WHERE user.user_Name = ? AND user.passwords = ?', [user_Name, passwords],
        (err, results) => {
            if (err) {
                console.error('Error querying database', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length > 0) {
                const user = results[0]
                const token = jwt.sign({ user }, secretKey, { expiresIn: '3h' });

                res.status(200).json({
                    message: 'Login Successful',
                    user: {
                        user_Id: user.user_Id,
                        user_Name: user.user_Name,
                        role_Name: user.role_Name,
                    }, token,
                });
            } else {
                res.status(401).json({ message: 'Invalid Username or Password' });
            }
        });
});

app.post("/api/elo", (req, res) => {
    const { elo_code, elo_Name, elo_description, years_elo } = req.body;
    const sqlELO = `INSERT INTO expected_learning_outcome (elo_code, elo_Name, elo_description, years_elo) VALUES (?,?,?,?)`;

    db.query(sqlELO, [elo_code, elo_Name, elo_description, years_elo], (error, results) => {
        if (error) {
            console.error('Error saving ELO:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'ELO Saved Successful' });
        }
    });
});

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. Invalid Token Format.' });
    }
    const tokenValue = token.split(' ')[1];

    try {
        jwt.verify(tokenValue, secretKey, (err, user) => {
            if (err) {
                console.error('Error Verify Token:', err.message);
                console.error('Token:', token);
                console.error(err.stack);
                return res.status(403).json({ message: 'Invalid Token !' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error Verifying Token:', error.message);
        return res.status(403).json({ message: 'Invalid Token !' });
    }
}

app.post("/api/subject", (req, res) => {
    const { course_Code, course_Name, course_NameEng, course_Credit, course_Description, course_DescriptionEng, course_Category,
        semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area, course_Instructor, course_Instructor2, course_Instructor3, course_Instructor4, curriculum_Id } = req.body;

    const insertSubject = `INSERT INTO course (course_Code, course_Name, course_NameEng,
        course_Credit, course_Description, course_DescriptionEng, course_Category, semster_term, year_of_study, responsible_Teacher, 
        prerequisites, corequisites, study_Area, course_Instructor,course_Instructor2,course_Instructor3,course_Instructor4,curriculum_Id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(insertSubject, [course_Code, course_Name, course_NameEng, course_Credit, course_Description, course_DescriptionEng,
        course_Category, semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area, course_Instructor,
        course_Instructor2, course_Instructor3, course_Instructor4, curriculum_Id]
        , (error, results) => {
            if (error) {
                console.error('Error saving subject', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            } else {
                res.status(200).json({ success: true, message: 'Subject Saved Successful' });
            }
        });
});

app.get('/api/course', (req, res) => {
    const query = `
    SELECT
        course.course_Id, course.course_Code, course.course_Name, course.course_NameEng, course.course_Credit, course.course_Description,
        course.course_DescriptionEng, course.course_Category, course.semster_term, course.year_of_study, course.responsible_Teacher,
        course.prerequisites, course.corequisites, course.study_Area, course_Instructor, course_Instructor2, course_Instructor3,
        course_Instructor4, curriculum.curriculum_Name, curriculum.branch, curriculum.college, curriculum.faculty, curriculum.campus, curriculum.department_Name
    FROM
        course
    LEFT JOIN
        curriculum ON course.curriculum_Id = curriculum.curriculum_Id
    `
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error Executing MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.post("/api/curriculum", (req, res) => {
    const { curriculum_Name, branch, college, campus, faculty, department_Name } = req.body;
    const curriculum = `INSERT INTO curriculum (curriculum_Name, branch, college, campus, faculty, department_Name) VALUES (?,?,?,?,?,?)`;

    db.query(curriculum, [curriculum_Name, branch, college, campus, faculty, department_Name,], (error, results) => {
        if (error) {
            console.error('Error Saving Curriculum', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            const newCurriculumId = results.insertId;
            res.status(200).json({ success: true, message: 'Curriculum Saved Successful', newCurriculumId });
        }
    });
});

app.put('/api/updatecurriculumId', (req, res) => {
    const { course_Id, curriculum_Id } = req.body;
    const updateQuery = 'UPDATE course INNER JOIN curriculum ON course.curriculum_Id = curriculum.curriculum_Id SET course.curriculum_Id = ? WHERE course.course_Id = ?';

    db.query(updateQuery, [curriculum_Id, course_Id], (error, results) => {
        if (error) {
            console.error('Error Updating Curriculum_Id in Course Table', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Curriculum_Id Updated Successful in Course Table' });
        }
    });
});

app.post('/api/clos', (req, res) => {
    const cloData = req.body;
    const inputClo = `INSERT INTO course_learning_outcome (clo_code, clo_Name, course_Id) VALUES ?`;

    db.query(inputClo, [cloData.map(clos => [clos.clo_code, clos.clo_Name, clos.course_Id])], (err, result) => {
        if (err) {
            console.error('Error Execute SQL Query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Saving to CLO Complete');
            res.status(200).send('Saving Data to Complete');
        }
    });
});

// app.get('/api/clo', (req, res) => {
//     const showclo = `SELECT course_learning_outcome.clo_Id, course.course_code, course.course_Name, course.semster_term 
//     FROM course_learning_outcome 
//     JOIN course ON course_learning_outcome.course_Id = course.course_Id`;
//     db.query(showclo, (err, results) => {
//         if (err) {
//             console.error('Error Execute MySQL Query:', err);
//             res.status(500).json({ message: 'Internal Server Error' });
//             return;
//         }
//         res.status(200).json(results);
//     })
// })

app.get('/api/cloIds', (req, res) => {
    const CloIds = `SELECT clo_Id, clo_code, clo_Name, course_Id FROM course_learning_outcome WHERE created_at = (SELECT MAX(created_at) FROM course_learning_outcome)`;

    db.query(CloIds, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    })
})

app.get('/api/eloYears', (req, res) => {
    const getYears = 'SELECT DISTINCT years_elo FROM expected_learning_outcome';

    db.query(getYears, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/api/eloByYear/:year', (req, res) => {
    const year = req.params.year;
    const getEloByYear = 'SELECT * FROM expected_learning_outcome WHERE years_elo = ?';

    db.query(getEloByYear, [year], (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.post('/api/basicCLO', (req, res) => {
    const { clo_basic_Name, basicClo_year } = req.body;
    const BasicClo = `INSERT INTO clo_basic_feature (clo_basic_Name, basicClo_year) VALUES (?,?)`;

    db.query(BasicClo, [clo_basic_Name, basicClo_year], (error, results) => {
        if (error) {
            console.error('Error Saving Basic CLO', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Basic CLO Saved Successful' });
        }
    });
});

app.get('/api/basicYear', (req, res) => {
    const basicyear = 'SELECT DISTINCT basicClo_year FROM clo_basic_feature';

    db.query(basicyear, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/api/cloBasic/:years', (req, res) => {
    const years = req.params.years;
    const getBasic = 'SELECT * FROM clo_basic_feature WHERE basicClo_year = ?';

    db.query(getBasic, [years], (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/api/teaching', (req, res) => {
    const getteaching = 'SELECT teaching_method_Name FROM teaching_method';

    db.query(getteaching, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    })
})

app.post('/api/addteaching', (req, res) => {
    const { teaching_method_Name, } = req.body;
    const teaching = `INSERT INTO teaching_method (teaching_method_Name) VALUES (?)`;

    db.query(teaching, [teaching_method_Name], (err, results) => {
        if (err) {
            console.error('Error Saving Teaching Method', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Teaching Method Saved Successful' });
        }
    })
})

app.post('/api/addresults', (req, res) => {
    const { results_Name, } = req.body;
    const rs = `INSERT INTO resultclo (results_Name) VALUES (?)`;

    db.query(rs, [results_Name], (err, results) => {
        if (err) {
            console.error('Error Saving Teaching Method', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Results CLO Saved Successful' });
        }
    })
})

app.post('/api/educations', (req, res) => {
    const { exp_Name, rst_Name, clo_Id, course_Id } = req.body;
    const edu = `INSERT INTO edudevelop (exp_Name, rst_Name, clo_Id, course_Id) VALUES (?,?,?,?)`;

    db.query(edu, [exp_Name, rst_Name, clo_Id, course_Id], (err, resuls) => {
        if (err) {
            console.error('Error Saving Education Department', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Education Department Successful' })
        }
    })
})

app.post('/api/compareClowElo', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { valueCompareClowElo, elo_Id, clo_Id, course_Id } = req.body;

        if (typeof valueCompareClowElo !== 'number' || typeof elo_Id !== 'number' || typeof clo_Id !== 'number' || typeof course_Id !== 'number') {
            return res.status(400).json({ success: false, message: 'Invalid Data Format. Expected Integers.' });
        }

        const mapCloElo = `INSERT INTO compare_teaching_clo_with_elo (valueCompareClowElo, elo_Id, clo_Id, course_Id) VALUES (?,?,?,?)`;

        db.query(mapCloElo, [valueCompareClowElo, elo_Id, clo_Id, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Data to Database:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Compare CLO with ELO Successful' });
        });
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// app.post('/api/compareCloBasic', (req, res) => {
//     const { BasicValue, clo_Id, clo_basic_Id, course_Id } = req.body;
//     const mapBasicClo = `INSERT INTO comparebasicclo (basicValue,clo_Id,clo_basic_Id,course_Id) VALUES (?,?,?,?)`;
//     db.query(mapBasicClo, [BasicValue, clo_Id, clo_basic_Id, course_Id], (err, results) => {
//         if (err) {
//             console.error('Error saving compare CLO Basic Feature', err);
//             res.status(500).json({ success: false, message: 'Internal Server Error' });
//         } else {
//             res.status(200).json({ success: true, message: 'Compare CLO Basic Feature successfully' });
//         }
//     })
// })

app.post('/api/comparebasicclo', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { BasicValue, clo_basic_Id, clo_Id, course_Id } = req.body;

        if (typeof BasicValue !== 'number' || typeof clo_basic_Id !== 'number' || typeof clo_Id !== 'number' || typeof course_Id !== 'number') {
            return res.status(400).json({ success: false, message: 'Invalid Data Format. Expected Integer' });
        }

        const mapBasicValue = `INSERT INTO comparebasicclo (BasicValue, clo_basic_Id, clo_Id, course_Id) VALUES (?,?,?,?)`;

        db.query(mapBasicValue, [BasicValue, clo_basic_Id, clo_Id, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving to Database', err);
                return res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res
                .status(200)
                .json({ success: true, message: 'Compare CLO with CLO Basic Successful' });
        });
    } catch (error) {
        console.error('Error Handing Request', error);
        res
            .status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.get('/api/dataresultCLO', (req, res) => {
    const rClo = `
    SELECT 
        teaching_method.teaching_method_Name, resultclo.results_Name 
    FROM 
        teaching_method
    JOIN
        resultclo ON teaching_method.teaching_method_Id = resultclo.results_Id`;

    db.query(rClo, (error, results) => {
        if (error) {
            console.error('Error Fetching Data:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/Support', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { support_Name, support_Operation, support_NotOperation, support_Improvement, course_Id } = req.body;
        const sp = `INSERT INTO support_learning (support_Name, support_Operation, support_NotOperation, support_Improvement, course_Id) VALUES (?,?,?,?,?)`;

        db.query(sp, [support_Name, support_Operation, support_NotOperation, support_Improvement, course_Id], (error, results) => {
            if (error) {
                console.log('Error Fetching Data', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Support Learning Successful' });
        });
    } catch (error) {
        console.error('Error Handing Request:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
});

app.post(`/api/Plans`, (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { plan_Name, plan_Clo, lecture_Hours, pratice_Hours, plan_description, course_Id } = req.body;
        const Plans = `INSERT INTO teaching_plan (plan_Name, plan_Clo, lecture_Hours, pratice_Hours, plan_description, course_Id) VALUES (?,?,?,?,?,?)`;

        db.query(Plans, [plan_Name, plan_Clo, lecture_Hours, pratice_Hours, plan_description, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Teaching Plan', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Plan Successful' });
        });
    } catch (error) {
        console.error('Error Handing Request:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
});

app.post('/api/developEXP', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { experience_Name, measuring_Name, clo_Id, course_Id } = req.body;
        const exp = `INSERT INTO edudevelop (experience_Name, measuring_Name, clo_Id, course_Id) VALUES (?,?,?,?)`;

        db.query(exp, [experience_Name, measuring_Name, clo_Id, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Experience CLO', err);
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res
                .status(200)
                .json({ success: true, message: 'Saving Experience CLO Complete' });
        });
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/assessments', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { assessment_outCome, activity_Learning, assessment_Deadline, assessment_Proportion, course_Id } = req.body;
        const as = `INSERT INTO assessment (assessment_outCome,activity_Learning,assessment_Deadline,assessment_Proportion,course_Id) VALUES (?,?,?,?,?)`;

        db.query(as, [assessment_outCome, activity_Learning, assessment_Deadline, assessment_Proportion, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Data Assessments', err);
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res
                .status(200)
                .json({ success: true, message: 'Saving Data Assessments' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/textbook', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { textbook_Name, course_Id } = req.body;
        const doc = `INSERT INTO textbook_document (textbook_Name, course_Id) VALUES (?,?) `;

        db.query(doc, [textbook_Name, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Document Textbook', err);
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res
                .status(200)
                .json({ success: true, message: 'Saving Document Textbook Complete' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/conselling', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { conselling_Name, course_Id } = req.body;
        const courseTime = `INSERT INTO courseconselling (conselling_Name, course_Id) VALUES (?,?)`;

        db.query(courseTime, [conselling_Name, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Course Conselling Time Data', err);
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200)
                .json({ success: true, message: 'Saving Course Conselling Time Data Complete' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Outcome-Based Education 3 */

app.post('/api/obe3', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const {
            courseNamecode, university_Name, campusObe3, facultyObe3, departmentObe3, obe3_Credit, obe3_Curriculum, obe3_branch,
            obe3_csinstructor, obe3_rspTeacher, obe3_rspTeacher2, obe3_rspTeacher3, obe3_rspTeacher4, obe3_semster, obe3_yearstudy,
            obe3_prereq, obe3_coreq, obe3_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl, obe3_latestC,
            obe3_sumtime_theory, obe3_sumtime_practice, obe3_sumtime_selfEducation, obe_description_bl, obe_practice_bl, obe_A_F_bl, obe_S_U_bl,
            obe_P_bl, assess_course_bl, discuss_bl, suggestion_bl, reflection_bl, other6_1_bl, other6_1_description,
            teacher_Evalu_bl, exam_result_bl, verification_bl, ex_Evalu_comit_bl, observation_bl, other6_2_bl, other6_2_description,
            teach_Seminar_bl, researchInOut_bl, other6_3_bl, other6_3_description, commit_course_bl, check_depart_bl, check_teacher_bl,
            other6_4_bl, other6_4_description, improve_offer_bl, improve_By_stu_bl, other6_5_bl, other6_5_description, course_Id,
        } = req.body;

        const obe3Query = `
            INSERT INTO outcome_based_education3 (
            courseNamecode, university_Name, campusObe3, facultyObe3, departmentObe3, obe3_Credit, obe3_Curriculum, obe3_branch,
            obe3_csinstructor, obe3_rspTeacher, obe3_rspTeacher2, obe3_rspTeacher3, obe3_rspTeacher4, obe3_semster, obe3_yearstudy,
            obe3_prereq, obe3_coreq, obe3_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl, obe3_latestC,
            obe3_sumtime_theory, obe3_sumtime_practice, obe3_sumtime_selfEducation, obe_description_bl, obe_practice_bl, obe_A_F_bl, obe_S_U_bl,
            obe_P_bl, assess_course_bl, discuss_bl, suggestion_bl, reflection_bl, other6_1_bl, other6_1_description,
            teacher_Evalu_bl, exam_result_bl, verification_bl, ex_Evalu_comit_bl, observation_bl, other6_2_bl, other6_2_description,
            teach_Seminar_bl, researchInOut_bl, other6_3_bl, other6_3_description, commit_course_bl, check_depart_bl, check_teacher_bl,
            other6_4_bl, other6_4_description, improve_offer_bl, improve_By_stu_bl, other6_5_bl, other6_5_description, course_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        db.query(obe3Query, [courseNamecode, university_Name, campusObe3, facultyObe3, departmentObe3, obe3_Credit, obe3_Curriculum, obe3_branch,
            obe3_csinstructor, obe3_rspTeacher, obe3_rspTeacher2, obe3_rspTeacher3, obe3_rspTeacher4, obe3_semster, obe3_yearstudy,
            obe3_prereq, obe3_coreq, obe3_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl, obe3_latestC,
            obe3_sumtime_theory, obe3_sumtime_practice, obe3_sumtime_selfEducation, obe_description_bl, obe_practice_bl, obe_A_F_bl, obe_S_U_bl,
            obe_P_bl, assess_course_bl, discuss_bl, suggestion_bl, reflection_bl, other6_1_bl, other6_1_description,
            teacher_Evalu_bl, exam_result_bl, verification_bl, ex_Evalu_comit_bl, observation_bl, other6_2_bl, other6_2_description,
            teach_Seminar_bl, researchInOut_bl, other6_3_bl, other6_3_description, commit_course_bl, check_depart_bl, check_teacher_bl,
            other6_4_bl, other6_4_description, improve_offer_bl, improve_By_stu_bl, other6_5_bl, other6_5_description, course_Id], (err, results) => {
                if (err) {
                    console.error('Error Saving OBE3', err);
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res
                    .status(200)
                    .json({ success: true, message: 'Saving Data OBE3 Complete' });
            })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Outcome-Based Education 5 */

app.post('/api/ROL', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { effectOn_Student, experience_Name, teaching_Method_Set, measuring_Name, measurement_Method, improve_Clo, clo_Id, course_Id } = req.body;
        const effect = `INSERT INTO rol (effectOn_Student, experience_Name, teaching_Method_Set, measuring_Name, measurement_Method, improve_Clo, clo_Id, course_Id) VALUES (?,?,?,?,?,?,?,?)`;

        db.query(effect, [effectOn_Student, experience_Name, teaching_Method_Set, measuring_Name, measurement_Method,
            improve_Clo, clo_Id, course_Id], (err, results) => {
                if (err) {
                    console.error('Error Saving Results of Learning');
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res.status(200).json({ success: true, message: 'Saving Data Results of Learning Successful' });
            })
    } catch (error) {
        console.error('Error Handing Request Body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/formative', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { fmtive_assign, fmtive_Name, fmtive_setplan, fmtive_develop, course_Id } = req.body;
        const formative = `INSERT INTO formativeevl (fmtive_assign, fmtive_Name, fmtive_setplan, fmtive_develop, course_Id) VALUES (?,?,?,?,?)`;

        db.query(formative, [fmtive_assign, fmtive_Name, fmtive_setplan, fmtive_develop, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Results Formative Evaluation');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Results Formative Evaluation Successful' });
        })
    } catch (error) {
        console.error('Error Handing Request Body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/summative', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { smtive_Name, smtive_setplan, smtive_Develop, course_Id } = req.body;
        const summative = `INSERT INTO summativeevl (smtive_Name, smtive_setplan, smtive_Develop, course_Id) VALUES (?,?,?,?)`;

        db.query(summative, [smtive_Name, smtive_setplan, smtive_Develop, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Results Summative Evaluation');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Results Summative Evaluation Successful' });
        })
    } catch (error) {
        console.error('Error Handing Request Body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/upload', upload.single('results_Of_Teach'), (req, res) => {
    const imageName = req.file.originalname;
    const imageData = req.file.buffer;
    const rsteach = `INSERT INTO rsoteach (img_Name, img_Data) VALUES (?,?)`;

    db.query(rsteach, [imageName, imageData], (err, results) => {
        if (err) {
            console.error('Error Inserting Image:', err);
            res.status(500).json({ message: 'Failed to Upload Image' });
            return;
        }
        res.status(200).json({ message: 'Image Uploaded Successful', imageId: results.insertId });
    })
});

app.post('/api/evlplan', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { learning_outcome, planed_Evalution, actual_Evalution, planed_EvalutionWeek, actual_EvalutionWeek, planned_Assessment, actual_Assessment } = req.body;
        const evlover = `INSERT INTO evlplanover (learning_outcome,planed_Evalution,actual_Evalution,planed_EvalutionWeek, actual_EvalutionWeek, planned_Assessment, actual_Assessment) VALUES (?,?,?,?,?,?,?)`;

        db.query(evlover, [learning_outcome, planed_Evalution, actual_Evalution, planed_EvalutionWeek, actual_EvalutionWeek,
            planned_Assessment, actual_Assessment], (err, results) => {
                if (err) {
                    console.error('Error Saving Deviation from the Evaluation Plan This is Specified in the Course Details. Regarding Time and Methods Evaluate');
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res.status(200).json({ success: true, message: 'Saving Data Evaluation Plan This is Specified in the Course Details Successful' });
            })
    } catch (error) {
        console.error('Error Handing Request Body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/obe5', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { courseNamecode, university_Name, campusObe5, facultyObe5, departmentObe5, obe5_Credit, obe5_Curriculum, obe5_branch,
            obe5_courseCategory, obe5_csinstructor, obe5_rspTeacher, obe5_Teacher2, obe5_rspTeacher3, obe5_rspTeacher4, obe5_semster, obe5_yearstudy,
            obe5_prereq, obe5_coreq, obe5_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl, abnormal_Score,
            comit_course_bl, check_Depart_bl, check_Teacher_bl, other4_4_4_bl, other4_4_4_description, resourceIssue, administrativeIssue,
            evaluation_Student, evaluation_Teacher, evaluation_Other, comment_Teacher_6222, improveTeaching7_1, recomment7_2, user_Id, course_Id } = req.body;

        const obe5 = `INSERT INTO outcome_based_education5 (courseNamecode, university_Name, campusObe5, facultyObe5, departmentObe5, obe5_Credit, obe5_Curriculum, obe5_branch, 
            obe5_courseCategory, obe5_csinstructor, obe5_rspTeacher, obe5_Teacher2, obe5_rspTeacher3, obe5_rspTeacher4, obe5_semster, obe5_yearstudy,
            obe5_prereq, obe5_coreq, obe5_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl, abnormal_Score, 
            comit_course_bl, check_Depart_bl, check_Teacher_bl, other4_4_4_bl, other4_4_4_description, resourceIssue, administrativeIssue, 
            evaluation_Student, evaluation_Teacher, evaluation_Other, comment_Teacher_6222, improveTeaching7_1, recomment7_2, user_Id, course_Id) VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;

        db.query(obe5, [courseNamecode, university_Name, campusObe5, facultyObe5, departmentObe5, obe5_Credit, obe5_Curriculum, obe5_branch,
            obe5_courseCategory, obe5_csinstructor, obe5_rspTeacher, obe5_Teacher2, obe5_rspTeacher3, obe5_rspTeacher4, obe5_semster, obe5_yearstudy,
            obe5_prereq, obe5_coreq, obe5_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl, abnormal_Score,
            comit_course_bl, check_Depart_bl, check_Teacher_bl, other4_4_4_bl, other4_4_4_description, resourceIssue, administrativeIssue,
            evaluation_Student, evaluation_Teacher, evaluation_Other, comment_Teacher_6222, improveTeaching7_1, recomment7_2, user_Id, course_Id],
            (err, results) => {
                if (err) {
                    console.error('Error Saving OBE5', err);
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res
                    .json({ success: true, message: 'Saving Data OBE5 Complete' });
            })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Outcome-Based Education 7 */

app.get("/api/curriculumData", (req, res) => {
    const getCurriculum = `SELECT curriculum_Name, department_Name, campus, faculty, college, branch FROM curriculum ORDER BY curriculum_Id DESC LIMIT 1 `;

    db.query(getCurriculum, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    })
})

app.get('/api/courseInstructors', (req, res) => {
    const instructor = `
    SELECT
        user.user_FirstName, user.user_LastName, user.qualification 
    FROM
        user 
    JOIN
        role ON user.user_Id = role.user_Id
    WHERE
        role.role_Name = 'Course Instructor'`;

    db.query(instructor, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results From DB:', results);
        res
            .status(200)
            .json(results);
    })
})

app.get('/api/chooseCourse', (req, res) => {
    const cs = `
    SELECT
        course.course_Id, course.course_Code, course.course_Name
    FROM
        course`;

    db.query(cs, (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from DataBase:', results);
        res
            .status(200)
            .json(results);
    })
})

// app.get('/api/choosecompare', (req, res) => {
//     const csecm = `
//     SELECT
//         compare_teaching_clo_with_elo.clo_Id, compare_teaching_clo_with_elo.elo_Id, compare_teaching_clo_with_elo.course_Id, compare_teaching_clo_with_elo.valueCompareClowElo,
//         course_learning_outcome.clo_Name, course_learning_outcome.clo_code,
//         expected_learning_outcome.elo_code, expected_learning_outcome.elo_Name,
//         course.course_Name, course.course_Code
//     FROM
//         compare_teaching_clo_with_elo
//     INNER JOIN
//         course
//     ON
//         compare_teaching_clo_with_elo.course_Id = course.course_Id
//     INNER JOIN
//         course_learning_outcome
//     ON
//         compare_teaching_clo_with_elo.clo_Id = course_learning_outcome.clo_Id
//     INNER JOIN 
//         expected_learning_outcome
//     ON
//         compare_teaching_clo_with_elo.elo_Id = expected_learning_outcome.elo_Id
//     WHERE
//         compare_teaching_clo_with_elo.valueCompareClowElo = 1`;

//     db.query(csecm, (err, results) => {
//         if (err) {
//             console.error('Error exercuting MySQL query:', err);
//             res
//                 .status(500)
//                 .json({ message: 'Internal Server Error' });
//             return;
//         }
//         console.log('Results from Data base:', results);
//         res
//             .status(200)
//             .json(results);
//     })
// })

app.get('/api/chooseCms', (req, res) => {
    const { course_Id } = req.query;

    console.log(`Received Request for CLOs with course_Id: ${course_Id}`);

    const cs = `
    SELECT
        course_learning_outcome.clo_Id, course_learning_outcome.clo_Name, course_learning_outcome.clo_code
    FROM
        course_learning_outcome 
    WHERE
        course_learning_outcome.course_Id = ?`;

    db.query(cs, [course_Id], (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from DataBase:', results);
        res
            .status(200)
            .json(results);
    })
})

app.get('/api/chooseels', (req, res) => {
    const { clo_Id } = req.query;

    console.log(`Received Request for ELOs with clo_Id: ${clo_Id}`);

    const els = `
    SELECT 
        compare_teaching_clo_with_elo.clo_Id, compare_teaching_clo_with_elo.elo_Id, expected_learning_outcome.elo_code, expected_learning_outcome.elo_Name
    FROM 
        compare_teaching_clo_with_elo
    INNER JOIN 
        expected_learning_outcome 
    ON 
        compare_teaching_clo_with_elo.elo_Id = expected_learning_outcome.elo_Id
    WHERE 
        compare_teaching_clo_with_elo.clo_Id = ?`;

    db.query(els, [clo_Id], (err, results) => {
        if (err) {
            console.error('Error Execute MySQL Query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from DataBase:', results);
        res
            .status(200)
            .json(results);
    })
})

app.post('/api/img7', upload.single('obe7_img_analysis'), (req, res) => {
    const obe7_img_analysis = req.file;
    if (!obe7_img_analysis) {
        return res.status(400).send('No File Uploaded.');
    }

    const fileUrl = `http://localhost:8081/api/img7/${obe7_img_analysis.filename}`;
    const { obe_Dscript_7301 } = req.body
    const query = "INSERT INTO imgobe7 (imgAnalysisCourse,obe_Dscript_7301) VALUES (?,?)";

    db.query(query, [fileUrl, obe_Dscript_7301], (err, result) => {
        if (err) throw err;
        res.send({ fileUrl });
    });
})

app.post('/api/responsibleCurri', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { instructor, qualification, positions } = req.body;
        const rescurri = `INSERT INTO curriculum_responsible (instructor, qualification, positions) VALUES (?,?,?)`;

        db.query(rescurri, [instructor, qualification, positions], (err, results) => {
            if (err) {
                console.error('Error Saving Data Responsible Curriculum');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Responsible Curriculum Successful' });
        })
    } catch (error) {
        console.error('Error Handing Request Body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/obe7', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { user_Id, obe7_college, obe7_campus, obe7_faculty, obe7_department, obe7_curriculum, obe7_branch, obe7_years, qualification_Level,
            obe_reportDate, report_Academic_Year, analysisDataStudent, ELo_Archive_bl, obe_Dscript_74201, obe_Dscript_74301, obe_76201_Dscript,
            obe_77201_Dscript, obe_77202_Dscript, obe_77203_Dscript,
        } = req.body;

        const obe7 = `INSERT INTO outcome_based_education7 (user_Id, obe7_college, obe7_campus, obe7_faculty, obe7_department, obe7_curriculum, obe7_branch, obe7_years, qualification_Level,
            obe_reportDate, report_Academic_Year, analysisDataStudent, ELo_Archive_bl, obe_Dscript_74201, obe_Dscript_74301, obe_76201_Dscript,
            obe_77201_Dscript, obe_77202_Dscript, obe_77203_Dscript) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;

        db.query(obe7, [user_Id, obe7_college, obe7_campus, obe7_faculty, obe7_department, obe7_curriculum, obe7_branch, obe7_years, qualification_Level,
            obe_reportDate, report_Academic_Year, analysisDataStudent, ELo_Archive_bl, obe_Dscript_74201, obe_Dscript_74301, obe_76201_Dscript,
            obe_77201_Dscript, obe_77202_Dscript, obe_77203_Dscript],
            (err, results) => {
                if (err) {
                    console.error('Error Saving OBE7', err);
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res
                    .json({ success: true, message: 'Saving Data OBE7 Complete' });
            })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/ansCourse', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { course_Id, abnormalities, conducting, factoranalysis, guideimprovement } = req.body;
        const ansCourse = `INSERT INTO analysis_course (course_Id, abnormalities, conducting, factoranalysis, guideimprovement) VALUES (?,?,?,?,?)`;

        db.query(ansCourse, [course_Id, abnormalities, conducting, factoranalysis, guideimprovement], (err, results) => {
            if (err) {
                console.error('Error Saving Analysis Course');
                res
                    .status(500)
                    .json({ success: false, message: ' Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Analysis Course Complete' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/ansDidnot', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { course_Id, clo_Id, elo_Id, reasonclo_NotArchive, development_GuideStu } = req.body;
        const didnot = `INSERT INTO anlscoursedidnot (course_Id, clo_Id, elo_Id, reasonclo_NotArchive, development_GuideStu) VALUES (?,?,?,?,?)`;

        db.query(didnot, [course_Id, clo_Id, elo_Id, reasonclo_NotArchive, development_GuideStu], (err, results) => {
            if (err) {
                console.error('Error Saving Analysis did not Course');
                res
                    .status(500)
                    .json({ success: false, message: ' Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Analysis did not Course Complete' })
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/offered', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { course_Id, reason_notTeaching, alternative } = req.body;
        const off = `INSERT INTO course_not_offered (course_Id, reason_notTeaching, alternative) VALUES (?,?,?)`;

        db.query(off, [course_Id, reason_notTeaching, alternative], (err, results) => {
            if (err) {
                console.error('Error Saving Data Course not offered');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Course not offered' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/edTeaching', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { topic_Nottech, reason_Nottech, edit_Teaching, course_Id } = req.body;
        const edtch = `INSERT INTO edit_teaching (topic_Nottech, reason_Nottech, edit_Teaching, course_Id) VALUES (?,?,?,?)`;

        db.query(edtch, [topic_Nottech, reason_Nottech, edit_Teaching, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Data Edit Teaching Course');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Edit Teaching Course' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/notregister', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { course_Id, analyze_Factors_Affect, guideline_Improvement } = req.body;
        const ntg = `INSERT INTO notregiscourse (course_Id, analyze_Factors_Affect, guideline_Improvement) VALUES (?,?,?)`;

        db.query(ntg, [course_Id, analyze_Factors_Affect, guideline_Improvement], (err, results) => {
            if (err) {
                console.error('Error Saving not Register Course');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data not Register Course' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/manageCurri', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { problem_Name, effect_Name, protect_Name } = req.body;
        const manage = `INSERT INTO managecurriculum (problem_Name, effect_Name, protect_Name) VALUES (?,?,?)`;

        db.query(manage, [problem_Name, effect_Name, protect_Name], (err, results) => {
            if (err) {
                console.error('Error Saving Management Curriculum');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Management Curriculum' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/evlc', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { improtant_Cri, Propose_Chg } = req.body;
        const evl = `INSERT INTO course_evalution (improtant_Cri, Propose_Chg) VALUES (?,?)`;

        db.query(evl, [improtant_Cri, Propose_Chg], (err, results) => {
            if (err) {
                console.error('Error Saving Course Evaluation');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Course Evaluation' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/stakeHolder', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { people, criticism, Propose_Chg } = req.body;
        const stke = `INSERT INTO stakeholdersevl (people,criticism, Propose_Chg) VALUES (?,?,?)`;

        db.query(stke, [people, criticism, Propose_Chg], (err, results) => {
            if (err) {
                console.error('Error Saving StakeHolder Evaluation');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data StakeHolder Evaluation' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/eloComm', (req, res) => {
    try {
        console.log('Receive Request Body:', req.body);

        const { elo_Id, people_other, comment_Student_elo, improvement_elo } = req.body;
        const elc = `INSERT INTO elo_comment (elo_Id, people_other, comment_Student_elo, improvement_elo) VALUES (?,?,?,?)`;

        db.query(elc, [elo_Id, people_other, comment_Student_elo, improvement_elo], (err, results) => {
            if (err) {
                console.error('Error Saving ELO Comment');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving ELO Comment' });
        })
    } catch (error) {
        console.error('Error Handing Request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.listen(PORT, () => {
    console.log(`Server run is on http://localhost:${PORT}`);
});
