const cors = require('cors');
const multer = require('multer');
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = require('./Middleware');

const apiNlp = require('./api_nlp');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 8081;
const secretKey = process.env.ACCESS_TOKEN_SECRET;

app.use(cors());
app.use(express.json({ limit: '5GB' }));
app.use(express.urlencoded({ limit: '5GB', extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../NLP')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error Connecting to the Database:', err);
        return;
    }
    console.log('Connected to the Database');

    app.use('/api', apiNlp(db));

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

/* ใช้สำหรับจัดเก็บไฟล์ PDF */
const Pdfstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/PDF/');
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        req.savedFilename = filename;
        cb(null, filename);
    }
});

const uploadPDF = multer({ storage: Pdfstorage });

/* ใช้สำหรับจัดเก็บรุปภาพ */
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const uploadImage = multer({ storage: imageStorage });

/* Register */
app.post("/api/register", async (req, res) => {

    const { user_FirstName, user_LastName, user_Name, passwords, email, qualification, positions, role_Id } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(passwords, 10);
        const sqlInsertUser = `INSERT INTO user (user_FirstName, user_LastName, user_Name, passwords, email, qualification, positions) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(sqlInsertUser, [user_FirstName, user_LastName, user_Name, hashedPassword, email, qualification, positions],
            (userError, userResult) => {
                if (userError) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                const user_Id = userResult.insertId;

                /* สร้าง Array สำหรับการเชื่อมโยง role */
                const userRoleValues = role_Id.map(role_Id => [user_Id, role_Id]);
                const sqlInsertUserRole = `INSERT INTO user_role (user_Id, role_Id) VALUES ?`;

                /* บันทึกข้อมูลการเชื่อมโยง role ลงในฐานข้อมูล */
                db.query(sqlInsertUserRole, [userRoleValues], (userRoleError, userRoleResult) => {
                    if (userRoleError) {
                        return res.status(500).json({ error: 'Failed to Associate roles with user' });
                    }
                    res.json({ user_Id });
                });
            }
        );
    } catch (error) {
        console.error('Error Hashing Password', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Role */
app.post("/api/role", (req, res) => {

    const { role_Name } = req.body;
    const sqlInsertRole = `INSERT INTO role (role_Name) VALUES (?)`;

    db.query(sqlInsertRole, [role_Name], (roleError, roleResult) => {
        if (roleError) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            const insertedRoleIds = roleResult.insertId;
            res.json({ message: 'Role Added Successful', insertedRoleIds });
        }
    });
});

app.get('/api/user/roles', authenticateToken, (req, res) => {

    const userId = req.user.user_Id;

    db.query(`SELECT role.role_Id, role.role_Name 
        FROM role JOIN user_role ON role.role_Id = user_role.role_Id WHERE user_role.user_Id = ?`, [userId], (err, results) => {
        if (err) {
            console.error('Error querying Database', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ roles: results });
    });
});

app.get('/api/availableRoles', authenticateToken, (req, res) => {

    const userIds = req.user.user_Id;

    db.query(`SELECT role_Id, role_Name FROM role`, (err, allRoles) => {
        if (err) {
            console.error('Error querying all roles', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        db.query(`SELECT role.role_Name FROM user 
            JOIN user_role ON user.user_Id = user_role.user_Id 
            JOIN role ON user_role.role_Id = role.role_Id 
            WHERE user.user_Id = ?`, [userIds], (err, userRoles) => {

            if (err) {
                console.error('Error querying user roles', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            const existingRoles = new Set(userRoles.map(role => role.role_Name));
            const availableRoles = allRoles.filter(role => !existingRoles.has(role.role_Name));
            const uniqueAvailableRoles = Array.from(new Set(availableRoles.map(role => role.role_Name)))
                .map(roleName => availableRoles.find(role => role.role_Name === roleName));

            res.status(200).json({ roles: uniqueAvailableRoles });
        });
    });
});

/* LogIn */
app.post("/api/login", async (req, res) => {

    const { user_Name, passwords } = req.body;

    db.query(`SELECT user.*, role.role_Name FROM user 
        JOIN user_role ON user.user_Id = user_role.user_Id
        JOIN role ON user_role.role_Id = role.role_Id 
        WHERE user.user_Name = ? `, [user_Name], async (err, results) => {

        if (err) {
            console.error('Error querying Database', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length > 0) {

            const user = results[0]
            const isMatch = await bcrypt.compare(passwords, user.passwords);

            if (isMatch) {

                const token = jwt.sign({ user_Id: user.user_Id }, secretKey, { expiresIn: '5h' });

                res.status(200).json({
                    message: 'Login Successful',
                    user: {
                        user_Id: user.user_Id,
                        user_Name: user.user_Name,
                        role_Name: user.role_Name,
                    },
                    token
                });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

/* Profile */
app.get('/api/profile', authenticateToken, (req, res) => {

    const userIds = req.user.user_Id;
    console.log('User ID from token:', userIds);

    db.query(`SELECT * FROM user WHERE user_Id = ?`, [userIds], (err, results) => {
        if (err) {
            console.error('Error querying Database', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length > 0) {
            const user = {
                user_Id: results[0].user_Id,
                user_Name: results[0].user_Name,
                user_FirstName: results[0].user_FirstName,
                user_LastName: results[0].user_LastName,
                email: results[0].email,
                qualification: results[0].qualification,
                positions: results[0].positions,
            };
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: 'User Not Found' });
        }
    });
});

app.put('/api/profile', authenticateToken, async (req, res) => {

    const userId = req.user.user_Id;
    const { user_Name, user_FirstName, user_LastName, passwords, email, qualification, positions, roleId, newRoleName } = req.body;

    try {

        let updatePassword = passwords;

        if (passwords) {
            const salt = await bcrypt.genSalt(10);
            updatePassword = await bcrypt.hash(passwords, salt);
        } else {

            const [existingUser] = await db.promise().query('SELECT passwords FROM user WHERE user_Id = ?', [userId]);

            if (existingUser.length > 0) {
                updatePassword = existingUser[0].passwords;
            }
        }

        await db.promise().query(`UPDATE user 
            SET 
            user_Name = ?,
            user_FirstName = ?,
            user_LastName = ?,
            passwords = ?,
            email = ?,
            qualification = ?,
            positions = ? 
            WHERE 
            user_Id = ?`, [user_Name, user_FirstName, user_LastName, updatePassword, email, qualification, positions, userId]);

        if (roleId && newRoleName) {

            const [userRoleCheck] = await db.promise().query(`SELECT * FROM user_role WHERE user_Id = ? AND role_Id = ?`, [userId, roleId]);

            if (userRoleCheck.length > 0) {
                await db.promise().query(`UPDATE role SET role_Name = ? WHERE role_Id = ?`, [newRoleName, roleId]);
                console.log("Role updated successfully");
                return res.status(200).json({ message: 'Profile and Role updated Successful' });
            } else {
                console.log("User does not have the specified role ID");
                return res.status(404).json({ message: 'User does not have the specified role ID' });
            }
        }
        console.log("Updating user:", { user_Name, user_FirstName, user_LastName, email, qualification, positions, userId });
        res.status(200).json({ message: 'Profile updated Successful' });

    } catch (error) {
        console.error('Error During profile update', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/* Subject */
app.post("/api/subject", (req, res) => {
    const { course_Code, course_Name, course_NameEng, course_Credit, course_Description, course_DescriptionEng, course_Category,
        semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area, curriculum_Id } = req.body;

    const insertSubject = `INSERT INTO course (course_Code, course_Name, course_NameEng, course_Credit, course_Description, course_DescriptionEng, 
    course_Category, semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area,curriculum_Id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(insertSubject, [course_Code, course_Name, course_NameEng, course_Credit, course_Description, course_DescriptionEng, course_Category,
        semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area, curriculum_Id], (error, results) => {
            if (error) {
                console.error('Error Saving Subject', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            else {
                const course_Id = results.insertId;
                console.log('Saving Subject Complete');
                res.status(200)
                    .json({ success: true, message: 'Subject Saved Successful with Pull course_Id', course_Id: course_Id });
            }
        });
});

app.put('/api/updateSubject', (req, res) => {
    const { course_Id, course_Code, course_Name, course_NameEng, course_Description, course_DescriptionEng, course_Credit, course_Category,
        semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area, curriculum_Id } = req.body;

    const updatesubject = `UPDATE course SET 
    course_Code = ?, 
    course_Name = ?, 
    course_NameEng = ?, 
    course_Credit = ?, 
    course_Description = ?, 
    course_DescriptionEng = ?, 
    course_Category = ?, 
    semster_term = ?, 
    year_of_study = ?, 
    responsible_Teacher = ?, 
    prerequisites = ?, 
    corequisites = ?, 
    study_Area = ?, 
    curriculum_Id = ? 
    WHERE 
    course_Id = ?`;

    db.query(updatesubject, [course_Code, course_Name, course_NameEng, course_Credit, course_Description, course_DescriptionEng, course_Category,
        semster_term, year_of_study, responsible_Teacher, prerequisites, corequisites, study_Area, curriculum_Id, course_Id], (error, results) => {
            if (error) {
                console.error('Error Updating subject', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            } else {
                res.status(200).json({ success: true, message: 'Subject updated Successful' });
            }
        });
});

/* Instructors */
app.get('/api/instructors', (req, res) => {
    const instructor = ` SELECT user.user_Id, user.user_FirstName, user.user_LastName
    FROM user user
    JOIN user_role ur ON user.user_Id = ur.user_Id
    JOIN role r ON ur.role_Id = r.role_Id
    WHERE r.role_Name = 'Subject Instructor'`;

    db.query(instructor, (err, results) => {
        if (err) {
            console.error('Error fetching Instructors:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        res.status(200).json({ success: true, instructors: results });
    })
});

/* Update User Course & Course Instructors */
app.post('/api/updateUserCourse', (req, res) => {

    try {
        console.log('Received request body:', req.body);

        const { user_Id, course_Id } = req.body;
        const userCourse = `INSERT INTO user_course (user_Id, course_Id) VALUES (?, ?)`;

        db.query(userCourse, [user_Id, course_Id], (err, results) => {
            if (err) {
                console.error('Error Saving User Course', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            console.log('Saving User Course Complete');
            res.status(200).json({ success: true, message: 'User Course Saved Successful' });
        });
    } catch (error) {
        console.error('Error handling request', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.put('/api/updateCourseInstructors', (req, res) => {

    const { course_Id, instructors } = req.body;
    const deleteQuery = 'DELETE FROM user_course WHERE course_Id = ?';

    db.query(deleteQuery, [course_Id], (error, results) => {
        if (error) {
            console.error('Error deleting existing Instructors:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }

        const insertQuery = 'INSERT INTO user_course (user_Id, course_Id) VALUES ?';
        const values = instructors.map(instructor => [instructor, course_Id]);

        db.query(insertQuery, [values], (error, results) => {
            if (error) {
                console.error('Error updating Instructors:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            } else {
                res.status(200).json({ success: true, message: 'Instructors updated Successful' });
            }
        });
    });
});

/* Course */
app.get('/api/course', (req, res) => {
    const query = `SELECT course.course_Id, course.course_Code,  course.course_Name,  course.course_NameEng, course.course_Credit, 
    course.course_Description, course.course_DescriptionEng,  course.course_Category,  course.semster_term,  course.year_of_study, 
    course.responsible_Teacher, course.prerequisites,  course.corequisites,  course.study_Area, curriculum.curriculum_Id, curriculum.curriculum_Name, 
    curriculum.branch, curriculum.college, curriculum.faculty, curriculum.campus, curriculum.department_Name, 
    GROUP_CONCAT(CONCAT(user.user_FirstName, ' ', user.user_LastName) SEPARATOR ', ') AS instructors 
    FROM course
    LEFT JOIN curriculum ON course.curriculum_Id = curriculum.curriculum_Id
    LEFT JOIN user_course ON course.course_Id = user_course.course_Id
    LEFT JOIN user ON user_course.user_Id = user.user_Id 
    GROUP BY course.course_Id`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error Executing MySQL query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

// app.get('/api/course/years', (req, res) => {
//     const years = `
//     SELECT DISTINCT SUBSTRING_INDEX(semster_term, '/', -1) AS year_of_curriculum 
//     FROM course 
//     ORDER BY year_of_curriculum DESC;`;

//     db.query(years, (err, results) => {
//         if (err) {
//             console.error('Error executing MySQL query:', err);
//             res.status(500).json({ message: 'Internal Server Error' });
//             return;
//         }
//         res.status(200).json(results);
//     });
// });

app.get('/api/course/users/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const query = `
      SELECT user.user_FirstName, user.user_LastName
      FROM user_course
      LEFT JOIN user ON user_course.user_Id = user.user_Id
      WHERE user_course.course_Id = ?`;

    db.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/api/resCourse', authenticateToken, (req, res) => {

    const userIds = req.user.user_Id;
    console.log('User ID from token:', userIds);

    db.query(`SELECT c.course_Id, c.course_Code, c.course_Name 
        FROM user_course uc 
        JOIN course c ON uc.course_Id = c.course_Id 
        WHERE uc.user_Id = ?`, [userIds], (err, results) => {
        if (err) {
            console.error('Error querying Database', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            return res.status(200).json({ courses: results });
        } else {
            return res.status(400).json({ message: 'No Courses found for this user' });
        }
    });
});

/* Curriculum */
app.post("/api/curriculum", (req, res) => {

    const { curriculum_Name, branch, college, campus, faculty, department_Name } = req.body;
    const curriculum = `INSERT INTO curriculum (curriculum_Name, branch, college, campus, faculty, department_Name) VALUES (?,?,?,?,?,?)`;

    db.query(curriculum, [curriculum_Name, branch, college, campus, faculty, department_Name,], (error, results) => {
        if (error) {
            console.error('Error saving curriculum', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            const newCurriculumId = results.insertId;
            res.status(200).json({ success: true, message: 'Curriculum Save Successful', newCurriculumId });
        }
    });
});

app.put('/api/updatecurriculumId', (req, res) => {

    const { course_Id, curriculum_Id } = req.body;

    const updateQuery = 'UPDATE course INNER JOIN curriculum ON course.curriculum_Id = curriculum.curriculum_Id SET course.curriculum_Id = ? WHERE course.course_Id = ?';

    db.query(updateQuery, [curriculum_Id, course_Id], (error, results) => {
        if (error) {
            console.error('Error updating curriculum_Id in course table', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Curriculum_Id updated Successful in course table' });
        }
    });
});

const getCurriculum = async (curriculum_Id) => {

    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM curriculum WHERE curriculum_Id = ?';

        db.query(query, [curriculum_Id], (error, results) => {
            if (error) reject(error);
            else resolve(results[0]);
        });
    });
};

app.put('/api/updatecurriculum', async (req, res) => {

    const { curriculum_Id, curriculum_Name, branch, college, campus, faculty, department_Name } = req.body;

    try {

        const existingData = await getCurriculum(curriculum_Id);

        if (JSON.stringify(existingData) === JSON.stringify(req.body)) {
            console.log('No Change detected');
            return res.status(200).json({ success: true, message: 'No Changes detected' });
        }

        const updateCurriculum = `UPDATE curriculum 
        SET curriculum_Name = ?, branch = ?, college = ?, campus = ?, faculty = ?, department_Name = ? 
        WHERE curriculum_Id = ?`;

        db.query(updateCurriculum, [curriculum_Name, branch, college, campus, faculty, department_Name, curriculum_Id], (error, results) => {
            if (error) {
                console.error('Error updating curriculum', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            } else {
                console.log('Update Curriculum Complete');
                res.status(200).json({ success: true, message: 'Curriculum updated Successful' });
            }
        });
    } catch (error) {
        console.error('Error processing request', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* ELO */
app.post("/api/elo", (req, res) => {

    const { elo_code, elo_Name, elo_description, years_elo } = req.body;
    const sqlELO = `INSERT INTO expected_learning_outcome (elo_code,elo_Name,elo_description,years_elo) VALUES (?,?,?,?)`;

    db.query(sqlELO, [elo_code, elo_Name, elo_description, years_elo], (error, results) => {
        if (error) {
            console.error('Error saving ELO:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'ELO Saved successful' });
        }
    });
});

app.get('/api/eloYears', (req, res) => {

    const getYears = 'SELECT DISTINCT years_elo FROM expected_learning_outcome';

    db.query(getYears, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
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
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

/* CLO */
app.post('/api/clos', (req, res) => {

    const cloData = req.body;
    const inputClo = `INSERT INTO course_learning_outcome (clo_code, clo_Name, course_Id, user_Id) VALUES ?`;

    db.query(inputClo, [cloData.map(clos => [clos.clo_code, clos.clo_Name, clos.course_Id, clos.user_Id])], (err, result) => {
        if (err) {
            console.error('Error Execute SQL Query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Saving to clo complete');
            res.status(200).send('Saving data to complete');
        }
    });
});

app.get('/api/cloIds', (req, res) => {
    const CloIds = `SELECT clo_Id, clo_code, clo_Name, course_Id FROM course_learning_outcome WHERE created_at = (SELECT MAX(created_at) FROM course_learning_outcome)`;

    db.query(CloIds, (err, results) => {
        if (err) {
            console.error('Error exercuting MySQL query', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    })
})

app.get('/api/clos/:courseId/:userId', (req, res) => {

    const { courseId, userId } = req.params;

    db.query(`SELECT * FROM course_learning_outcome WHERE course_Id = ? AND user_Id = ? ORDER BY created_at DESC`, [courseId, userId], (error, results) => {
        if (error) {
            console.error('Error fetching course learning outcome:', error);
            return res.status(500).json({ error: 'An error occurred while fetching data' });
        }
        res.status(200).json({ message: 'data course learning outcome:', results });
    })
});

/* Basic CLO */
app.post('/api/basicCLO', (req, res) => {
    const { clo_basic_Name, basicClo_year } = req.body;
    const BasicClo = `INSERT INTO clo_basic_feature (clo_basic_Name, basicClo_year) VALUES (?,?)`;

    db.query(BasicClo, [clo_basic_Name, basicClo_year], (error, results) => {
        if (error) {
            console.error('Error saving Basic CLO', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Basic CLO saved successfully' });
        }
    });
});

app.get('/api/basicYear', (req, res) => {
    const basicyear = 'SELECT DISTINCT basicClo_year FROM clo_basic_feature';

    db.query(basicyear, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
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
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

/* Teaching */
app.get('/api/teaching', (req, res) => {

    const getteaching = 'SELECT teaching_method_Name FROM teaching_method';

    db.query(getteaching, (err, results) => {
        if (err) {
            console.error('Error exercuting MySQL query:', err);
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
            console.error('Error saving Teaching Method', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'Teaching Method saved successfully' });
        }
    })
})

/* Result */
app.post('/api/addresults', (req, res) => {

    const { results_Name, } = req.body;
    const rs = `INSERT INTO resultclo (results_Name) VALUES (?)`;

    db.query(rs, [results_Name], (err, results) => {
        if (err) {
            console.error('Error saving Teaching Method', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'results CLO saved successfully' });
        }
    })
})

app.get('/api/dataresultCLO', (req, res) => {
    const rClo = `SELECT teaching_method.teaching_method_Name, resultclo.results_Name 
    FROM teaching_method 
    JOIN resultclo ON teaching_method.teaching_method_Id = resultclo.results_Id`;

    db.query(rClo, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});

/* Education */
app.post('/api/educations', (req, res) => {

    const { exp_Name, rst_Name, clo_Id, course_Id } = req.body;
    const edu = `INSERT INTO edudevelop (exp_Name,rst_Name,clo_Id,course_Id) VALUES (?,?,?,?)`;

    db.query(edu, [exp_Name, rst_Name, clo_Id, course_Id], (err, resuls) => {
        if (err) {
            console.error('Error saving education department', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.status(200).json({ success: true, message: 'education department successfully' })
        }
    })
})

/* CLO Compare ELO */
app.post('/api/compareClowElo', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { valueCompareClowElo, elo_Id, clo_Id, course_Id, user_Id } = req.body;

        if (typeof valueCompareClowElo !== 'number' || typeof elo_Id !== 'number' || typeof clo_Id !== 'number' || typeof course_Id !== 'number') {
            return res.status(400).json({ success: false, message: 'invalid data format. Expected integers.' });
        }

        const mapCloElo = `INSERT INTO compare_teaching_clo_with_elo (valueCompareClowElo, elo_Id, clo_Id, course_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(mapCloElo, [valueCompareClowElo, elo_Id, clo_Id, course_Id, user_Id], (err, results) => {
            if (err) {
                console.error('Error saving data to database:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Compare CLO with ELO successfully' });
        });
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* CLO Compare Basic CLO */
app.post('/api/comparebasicclo', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { BasicValue, clo_basic_Id, clo_Id, course_Id, user_Id } = req.body;

        if (typeof BasicValue !== 'number' || typeof clo_basic_Id !== 'number' || typeof clo_Id !== 'number' || typeof course_Id !== 'number') {
            return res.status(400).json({ success: false, message: 'Invalid data format. Expected integer' });
        }

        const mapBasicValue = `INSERT INTO comparebasicclo (BasicValue, clo_basic_Id, clo_Id, course_Id) VALUES (?,?,?,?)`;

        db.query(mapBasicValue, [BasicValue, clo_basic_Id, clo_Id, course_Id, user_Id], (err, results) => {
            if (err) {
                console.error('Error saving to database', err);
                return res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res
                .status(200)
                .json({ success: true, message: 'Compare CLO with CLO Basic Successfully' });
        });
    } catch (error) {
        console.error('Error handing request', error);
        res
            .status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Plan */
app.post(`/api/Plans`, (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { plan_Name, plan_Clo, lecture_Hours, pratice_Hours, plan_description, course_Id, obe3_Id } = req.body;
        const Plans = `INSERT INTO teaching_plan (plan_Name, plan_Clo, lecture_Hours, pratice_Hours, plan_description, course_Id, obe3_Id) VALUES (?,?,?,?,?,?,?)`;

        db.query(Plans, [plan_Name, plan_Clo, lecture_Hours, pratice_Hours, plan_description, course_Id, obe3_Id], (err, results) => {
            if (err) {
                console.error('Error saving teaching plan', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving paln successfully' });
        });
    } catch (error) {
        console.error('Error handing request:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
});

/* Support */
app.post('/api/Support', (req, res) => {

    try {
        console.log('receive request body:', req.body);

        const { support_Name, support_Operation, support_NotOperation, support_Improvement, course_Id, obe5_Id } = req.body;
        const sp = `INSERT INTO support_learning (support_Name, support_Operation, support_NotOperation, support_Improvement, course_Id, obe5_Id) VALUES (?,?,?,?,?,?)`;

        db.query(sp, [support_Name, support_Operation, support_NotOperation, support_Improvement, course_Id, obe5_Id], (error, results) => {
            if (error) {
                console.log('Error fetching data', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving support learning successfully' });
        });
    } catch (error) {
        console.error('Error handing request:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
});

/* Experience */
app.post('/api/developEXP', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { experience_Name, measuring_Name, clo_Id, course_Id, obe3_Id } = req.body;
        const exp = `INSERT INTO edudevelop (experience_Name, measuring_Name, clo_Id, course_Id, obe3_Id) VALUES (?,?,?,?,?)`;

        db.query(exp, [experience_Name, measuring_Name, clo_Id, course_Id, obe3_Id], (err, results) => {
            if (err) {
                console.error('Error saving experience CLO', err);
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res
                .status(200)
                .json({ success: true, message: 'Saving Experience CLO Complete' });
        });
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Assessment */
app.post('/api/assessments', (req, res) => {
    try {

        console.log('receive request body:', req.body);

        const { assessment_outCome, activity_Learning, assessment_Deadline, assessment_Proportion, course_Id, obe3_Id } = req.body;
        const as = `INSERT INTO assessment (assessment_outCome,activity_Learning,assessment_Deadline,assessment_Proportion,course_Id, obe3_Id) VALUES (?,?,?,?,?,?)`;

        db.query(as, [assessment_outCome, activity_Learning, assessment_Deadline, assessment_Proportion, course_Id, obe3_Id], (err, results) => {
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
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* TextBook */
app.post('/api/textbook', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { textbook_Name, course_Id, obe3_Id } = req.body;
        const doc = `INSERT INTO textbook_document (textbook_Name, course_Id, obe3_Id) VALUES (?,?,?) `;

        db.query(doc, [textbook_Name, course_Id, obe3_Id], (err, results) => {
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
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Counselling */
app.post('/api/conselling', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { conselling_Name, course_Id, obe3_Id } = req.body;
        const courseTime = `INSERT INTO courseconselling (conselling_Name, course_Id, obe3_Id) VALUES (?,?,?)`;

        db.query(courseTime, [conselling_Name, course_Id, obe3_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Course conselling time Data', err);
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200)
                .json({ success: true, message: 'Saving course conselling time data complete' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Select Course */
app.get('/api/selectcourse', (req, res) => {
    db.query('SELECT course_Id, course_Name, course_Code, course_NameEng FROM course', (error, results) => {
        if (error) {
            console.error("Database Error: ", error);
            res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายวิชา' });
        } else {
            res.status(200).json({ course: results });
        }
    });
});

/* Course User */
app.get('/api/getCourseUserIds/:courseId', (req, res) => {
    const { courseId } = req.params;

    db.query(`SELECT uc.user_Id, u.user_FirstName, u.user_LastName 
        FROM user_course AS uc 
        JOIN user AS u ON uc.user_Id = u.user_Id 
        WHERE uc.course_Id = ?`, [courseId], (error, results) => {
        if (error) {
            console.error("Database Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No user IDs found for this course' });
        }

        res.status(200).json({ users: results });
    });
});

/* Save Outcome-Based Education 3 */
app.post('/api/obe3', (req, res) => {
    try {
        console.log('receive request body:', req.body);
        const {
            courseNamecode, university_Name, campusObe3, facultyObe3, departmentObe3, obe3_Credit, obe3_Curriculum, obe3_branch, obe3_courseCategory,
            obe3_semster, obe3_yearstudy, obe3_prereq, obe3_coreq, obe3_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl,
            culture_bl, obe3_latestC, obe3_sumtime_theory, obe3_sumtime_practice, obe3_sumtime_selfEducation, obe_description_bl, obe_practice_bl,
            obe_A_F_bl, obe_S_U_bl, obe_P_bl, assess_course_bl, discuss_bl, suggestion_bl, reflection_bl, other6_1_bl, other6_1_description,
            teacher_Evalu_bl, exam_result_bl, verification_bl, ex_Evalu_comit_bl, observation_bl, other6_2_bl, other6_2_description,
            teach_Seminar_bl, researchInOut_bl, other6_3_bl, other6_3_description, commit_course_bl, check_depart_bl, check_teacher_bl,
            other6_4_bl, other6_4_description, improve_offer_bl, improve_By_stu_bl, other6_5_bl, other6_5_description, course_Id, user_Id
        } = req.body;

        const obe3Query = `
        INSERT INTO outcome_based_education3 (
            courseNamecode, university_Name, campusObe3, facultyObe3, departmentObe3, obe3_Credit, obe3_Curriculum, obe3_branch,obe3_courseCategory,
            obe3_semster, obe3_yearstudy, obe3_prereq, obe3_coreq, obe3_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, 
            culture_bl, obe3_latestC, obe3_sumtime_theory, obe3_sumtime_practice, obe3_sumtime_selfEducation, obe_description_bl, obe_practice_bl, 
            obe_A_F_bl, obe_S_U_bl, obe_P_bl, assess_course_bl, discuss_bl, suggestion_bl, reflection_bl, other6_1_bl, other6_1_description,
            teacher_Evalu_bl, exam_result_bl, verification_bl, ex_Evalu_comit_bl, observation_bl, other6_2_bl, other6_2_description,
            teach_Seminar_bl, researchInOut_bl, other6_3_bl, other6_3_description, commit_course_bl, check_depart_bl, check_teacher_bl,
            other6_4_bl, other6_4_description, improve_offer_bl, improve_By_stu_bl, other6_5_bl, other6_5_description, course_Id, user_Id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(obe3Query, [courseNamecode, university_Name, campusObe3, facultyObe3, departmentObe3, obe3_Credit, obe3_Curriculum, obe3_branch, obe3_courseCategory,
            obe3_semster, obe3_yearstudy, obe3_prereq, obe3_coreq, obe3_studyArea, compare_teach_bl, outsider_teach_bl, research_bl, society_bl, culture_bl,
            obe3_latestC, obe3_sumtime_theory, obe3_sumtime_practice, obe3_sumtime_selfEducation, obe_description_bl, obe_practice_bl, obe_A_F_bl, obe_S_U_bl,
            obe_P_bl, assess_course_bl, discuss_bl, suggestion_bl, reflection_bl, other6_1_bl, other6_1_description, teacher_Evalu_bl, exam_result_bl,
            verification_bl, ex_Evalu_comit_bl, observation_bl, other6_2_bl, other6_2_description, teach_Seminar_bl, researchInOut_bl, other6_3_bl,
            other6_3_description, commit_course_bl, check_depart_bl, check_teacher_bl, other6_4_bl, other6_4_description, improve_offer_bl, improve_By_stu_bl,
            other6_5_bl, other6_5_description, course_Id, user_Id], (err, results) => {
                if (err) {
                    console.error('Error Saving OBE3', err);
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                } else {
                    const insertedId = results.insertId;
                    res
                        .json({ success: true, message: 'Saving Data OBE3 Complete', obe3_Id: insertedId });
                }
            })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// app.get('/api/selectcourse', (req, res) => {
//     db.query('SELECT course_Id, course_Name, course_Code, course_NameEng FROM course', (error, results) => {
//         if (error) {
//             console.error("Database Error: ", error);
//             res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิชา' });
//         } else {
//             res.status(200).json({ course: results });
//         }
//     });
// });

// app.get('/api/getCourseUserIds/:courseId', (req, res) => {
//     const { courseId } = req.params;

//     db.query(`SELECT uc.user_Id, u.user_FirstName, u.user_LastName 
//     FROM user_course AS uc 
//     JOIN user AS u ON uc.user_Id = u.user_Id 
//     WHERE uc.course_Id = ?`, [courseId], (error, results) => {
//         if (error) {
//             console.error("Database Error:", error);
//             return res.status(500).json({ error: "Internal Server Error" });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ message: 'No user IDs found for this course' });
//         }
//         res.status(200).json({ users: results });
//     });
// });

app.get('/api/obe3/:courseId/:userId', (req, res) => {
    const { courseId, userId } = req.params;

    db.query(`
    SELECT obe.courseNameCode, obe.university_Name, obe.campusObe3, obe.facultyObe3, obe.departmentObe3, obe.obe3_Credit, obe.obe3_Curriculum, 
    obe.obe3_branch, obe.obe3_courseCategory, obe.obe3_semster, obe.obe3_yearstudy, obe.obe3_prereq, obe.obe3_coreq, obe.obe3_studyArea, 
    obe.compare_teach_bl, obe.outsider_teach_bl, obe.research_bl, obe.society_bl, obe.culture_bl, obe.obe3_latestC, course.responsible_Teacher 
    FROM outcome_based_education3 AS obe 
    JOIN course ON obe.course_Id = course.course_Id 
    WHERE obe.course_Id = ? AND obe.user_Id = ?`, [courseId, userId], (error, obe3DataResults) => {

        if (error) {
            console.error("Database Error:", error);
            return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล OBE" });
        }

        if (obe3DataResults.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลสำหรับผู้ใช้งานในวิชานี้' });
        }

        db.query(`SELECT u.user_Id, u.user_FirstName, u.user_LastName FROM user_course AS uc JOIN user AS u ON uc.user_Id = u.user_Id WHERE uc.course_Id = ?`, [courseId], (error, instructorsResults) => {
            if (error) {
                console.error("Database Error:", error);
                return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลอาจารย์ผู้สอน" });
            }

            const response = {
                obe3Data: obe3DataResults[0],
                instructors: instructorsResults
            };

            res.json(response);
        });
    });
});

/* Pull Outcome-Based Education 3 Old */


app.get('/api/dataobe3', async (req, res) => {

    const { user_Id, course_Id, year } = req.query;

    const obe3Query = `SELECT obe3.obe3_Id, obe3.user_Id, obe3.course_Id, obe3.obe3_semster,
    obe3.compare_teach_bl, obe3.outsider_teach_bl, obe3.research_bl obe3.society_bl, 
    obe3.culture_bl, obe3.obe3_latestC, obe3.obe3_sumtime_practice, obe3.obe3_sumtime_selfEducation, 
    obe3.obe3_sumtime_theory, obe3.obe_description_bl, obe3.obe_A_F_bl, obe3.obe_P_bl, obe3.obe_S_U_bl, 
    obe3.obe_practice_bl, obe3.assess_course_bl, obe3.discuss_bl, obe3.reflection_bl, obe3.suggestion_bl, 
    obe3.other6_1_bl, obe3.other6_1_description, obe3.teacher_Evalu_bl, obe3.exam_result_bl, obe3.verification_bl, 
    obe3.ex_Evalu_comit_bl, obe3.observation_bl, obe3.other6_2_bl, obe3.other6_2_description, obe3.teach_Seminar_bl, 
    obe3.researchInOut_bl, obe3.other6_3_bl, obe3.other6_3_description, obe3.commit_course_bl, obe3.check_depart_bl, 
    obe3.check_teacher_bl, obe3.other6_4_bl, obe3.other6_4_description, obe3.improve_offer_bl, obe3.improve_By_stu_bl, 
    obe3.other6_5_bl, obe3.other6_5_description
    FROM outcome_based_education3 AS obe3  
    WHERE obe3.user_Id = ? AND obe3.course_Id = ? AND SUBSTRING_INDEX(obe3.obe3_semster, '/', -1) = ?`;

    try {
        const [results] = await db.promise().query(obe3Query, [user_Id, course_Id, year]);
        res.status(200).json({ message: 'Old data outcome based education3:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/dataAssessments', async (req, res) => {

    const { obe3_Id } = req.query;
    const assessmentQuery = `SELECT asm.assessment_outCome, asm.activity_Learning, asm.assessment_Deadline, asm.assessment_Proportion 
    FROM assessment AS asm WHERE asm.obe3_Id = ?`;

    try {
        const [results] = await db.promise().query(assessmentQuery, [obe3_Id]);
        res.status(200).json({ message: 'Old data Assessments of outcome based education3:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/dataPlans', async (req, res) => {

    const { obe3_Id } = req.query;
    const PlansQuery = `SELECT tp.plan_Name, tp.plan_Clo, tp.lecture_Hours, tp.pratice_Hours, tp.plan_description 
    FROM teaching_plan AS tp WHERE tp.obe3_Id = ?`;

    try {
        const [results] = await db.promise().query(PlansQuery, [obe3_Id]);
        res.status(200).json({ message: 'Old data Plan of outcome based education3:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/datatextbooks', async (req, res) => {

    const { obe3_Id } = req.query;
    const textbooksQuery = `SELECT tb.textbook_Name FROM textbook_document AS tb WHERE tb.obe3_Id = ?`;

    try {
        const [results] = await db.promise().query(textbooksQuery, [obe3_Id]);
        res.status(200).json({ message: 'Old data textbook document of outcome based education3:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
})

app.get('/api/dataconsellings', async (req, res) => {

    const { obe3_Id } = req.query;
    const consellingQuery = `SELECT cc.conselling_Name FROM courseconselling AS cc WHERE cc.obe3_Id = ?`;

    try {
        const [results] = await db.promise().query(consellingQuery, [obe3_Id]);
        res.status(200).json({ message: 'Old data course conselling of outcome based education3:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
})

app.get('/api/oldclo', async (req, res) => {

    const { course_Id, user_Id } = req.query;
    const cloQuery = `SELECT clo.clo_code, clo.clo_Name, clo.created_at FROM course_learning_outcome AS clo 
    WHERE clo.course_Id = ? AND clo.user_Id = ? ORDER BY clo.created_at DESC`;

    try {
        const [results] = await db.promise().query(cloQuery, [course_Id, user_Id]);
        res.status(200).json({ message: 'Latest CLO data fetched successfully', results });
    } catch (error) {
        console.error('Error fetching latest CLO data:', err);
        res.status(500).send('Failed to fetch latest CLO data');
    }
})

app.get('/api/edulatest', async (req, res) => {

    const { obe3_Id } = req.query;
    const eduQuery = `SELECT edu.experience_Name, edu.measuring_Name FROM edudevelop AS edu WHERE edu.obe3_Id = ?`;

    try {
        const [results] = await db.promise().query(eduQuery, [obe3_Id]);
        res.status(200).json({ message: 'Latest edudevelop data fetch successfully', results });
    } catch (error) {
        console.error('Error fetching data edudevelop:', err);
        res.status(500).send('Failed to fetch latest edudevelop data:');
    }
});

app.get('/api/yearobe3', (req, res) => {

    const yearobe3 = `SELECT DISTINCT RIGHT(obe3_semster, 4) AS year FROM outcome_based_education3 ORDER BY year`;

    db.query(yearobe3, (err, results) => {
        if (err) {
            console.error('Error fetching year outcome based education3:', err);
            return res.status(500).json({ error: 'Error fetching year data' });
        }
        res.status(200).json({ message: 'data year outcome based education3:', results });
    })
});

/* Outcome-Based Education 3 PDF */
app.post('/api/pdf3', uploadPDF.single('pdfFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('no files were uploaded.');
    }

    const { size } = req.file;
    const fileName = req.body.fileName;
    const path = req.file.path;
    const obe3_Id = req.body.obe3Id;

    const pdf3 = `INSERT INTO pdf_obe3 (fileName, path, size, obe3_Id) VALUES (?,?,?,?)`;
    const values = [fileName, path, size, obe3_Id];

    db.query(pdf3, values, (err, results) => {
        if (err) {
            console.error('Error inserting PDF data', err);
            return res.status(500).send('Failed to store PDF data');
        }
        console.log('PDF data stored successfully');
        res.status(200).send('PDF uploaded and data stored successfully');
    });
});

app.get('/api/pdfobe3', (req, res) => {

    const pdf_obe3 = `SELECT pdf_Id, fileName, path FROM pdf_obe3`;

    db.query(pdf_obe3, (err, results) => {
        if (err) {
            console.error('Error fetching PDF outcome based education 3 data:', err);
            return res.status(500).send('Failed to fetch PDF data');
        }
        res.status(200).json(results);
    });
});

/* ROL OBE 5 */
app.post('/api/ROL', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { effectOn_Student, experience_Name, teaching_Method_Set, measuring_Name, measurement_Method, improve_Clo, clo_Id, course_Id, obe5_Id } = req.body;
        const effect = `INSERT INTO rol (effectOn_Student, experience_Name, teaching_Method_Set, measuring_Name, 
        measurement_Method, improve_Clo, clo_Id, course_Id, obe5_Id) VALUES (?,?,?,?,?,?,?,?,?)`;

        db.query(effect, [effectOn_Student, experience_Name, teaching_Method_Set, measuring_Name, measurement_Method,
            improve_Clo, clo_Id, course_Id, obe5_Id], (err, results) => {
                if (err) {
                    console.error('Error Saving results of learning');
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res.status(200).json({ success: true, message: 'Saving Data Results of learning successfully' });
            })
    } catch (error) {
        console.error('Error handing request body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Formative & Summative */
app.post('/api/formative', (req, res) => {
    try {
        console.log('recieve request body:', req.body);

        const { fmtive_assign, fmtive_Name, fmtive_setplan, fmtive_develop, course_Id, obe5_Id } = req.body;
        const formative = `INSERT INTO formativeevl (fmtive_assign, fmtive_Name, fmtive_setplan, fmtive_develop, course_Id, obe5_Id) VALUES (?,?,?,?,?,?)`;

        db.query(formative, [fmtive_assign, fmtive_Name, fmtive_setplan, fmtive_develop, course_Id, obe5_Id], (err, results) => {
            if (err) {
                console.error('Error Saving results formative evalution');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Results Formative Evalution successfully' });
        })
    } catch (error) {
        console.error('Error handing request body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

app.post('/api/summative', (req, res) => {
    try {
        console.log('recevie request body:', req.body);

        const { smtive_Name, smtive_setplan, smtive_Develop, course_Id, obe5_Id } = req.body;
        const summative = `INSERT INTO summativeevl (smtive_Name, smtive_setplan, smtive_Develop, course_Id, obe5_Id) VALUES (?,?,?,?,?)`;

        db.query(summative, [smtive_Name, smtive_setplan, smtive_Develop, course_Id, obe5_Id], (err, results) => {
            if (err) {
                console.error('Error Saving results Summative Evalution');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Results Summative Evalution successfully' });
        })
    } catch (error) {
        console.error('Error handing request body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Upload File OBE 5 */
app.post('/api/roltech', uploadImage.single('results_Of_Teach'), (req, res) => {
    console.log('Uploaded File:', req.file);

    const result_of_Teach = req.file;
    const path = result_of_Teach ? req.file.path : "";
    const { obe5_Id } = req.body;

    console.log('File uploaded:', result_of_Teach);
    console.log('obe5_Id:', obe5_Id);

    const rsteach = `INSERT INTO rsoteach (img_Name, obe5_Id) VALUES (?,?)`;

    db.query(rsteach, [path, obe5_Id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred.' });
        }
        res.status(201).json({ message: 'Image uploaded and data stored successfully', path });
    });
});

/* Evaluation Plan */
app.post('/api/evlplan', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { learning_outcome, planed_Evalution, actual_Evalution, planed_EvalutionWeek, actual_EvalutionWeek, planned_Assessment, actual_Assessment, obe5_Id } = req.body;
        const evlover = `INSERT INTO evlplanover (learning_outcome,planed_Evalution,actual_Evalution,planed_EvalutionWeek, actual_EvalutionWeek, 
        planned_Assessment, actual_Assessment, obe5_Id) VALUES (?,?,?,?,?,?,?,?)`;

        db.query(evlover, [learning_outcome, planed_Evalution, actual_Evalution, planed_EvalutionWeek, actual_EvalutionWeek,
            planned_Assessment, actual_Assessment, obe5_Id], (err, results) => {
                if (err) {
                    console.error('Error Saving Deviation from the evaluation plan This is specified in the course details. regarding timing and methodsEvaluate');
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                }
                res.status(200).json({ success: true, message: 'Saving Data evaluation plan This is specified in the course details successfully' });
            })
    } catch (error) {
        console.error('Error handing request body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Save Outcome-Based Education 5 */
app.post('/api/obe5', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { courseNamecode, university_Name, campusObe5, facultyObe5, departmentObe5, obe5_Credit, obe5_Curriculum, obe5_branch,
            obe5_courseCategory, obe5_semster, obe5_yearstudy, obe5_prereq, obe5_coreq, obe5_studyArea, compare_teach_bl, outsider_teach_bl,
            research_bl, society_bl, culture_bl, report_Overtime, topic_Overtime, abnormal_Score, comit_course_bl, check_Depart_bl, check_Teacher_bl, other4_4_4_bl,
            other4_4_4_description, resourceIssue, administrativeIssues, evaluation_Student, evaluation_Teacher, evaluation_Other,
            comment_Teacher_6222, improveTeaching7_1, recomment7_2, user_Id, course_Id } = req.body;

        const obe5 = `INSERT INTO outcome_based_education5 (courseNamecode, university_Name, campusObe5, facultyObe5, departmentObe5, obe5_Credit, obe5_Curriculum, obe5_branch, 
        obe5_courseCategory, obe5_semster, obe5_yearstudy, obe5_prereq, obe5_coreq, obe5_studyArea, compare_teach_bl, outsider_teach_bl, 
        research_bl, society_bl, culture_bl, report_Overtime, topic_Overtime, abnormal_Score, comit_course_bl, check_Depart_bl, check_Teacher_bl, other4_4_4_bl, 
        other4_4_4_description, resourceIssue, administrativeIssues, evaluation_Student, evaluation_Teacher, evaluation_Other, comment_Teacher_6222, 
        improveTeaching7_1, recomment7_2, user_Id, course_Id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        db.query(obe5, [courseNamecode, university_Name, campusObe5, facultyObe5, departmentObe5, obe5_Credit, obe5_Curriculum, obe5_branch,
            obe5_courseCategory, obe5_semster, obe5_yearstudy, obe5_prereq, obe5_coreq, obe5_studyArea, compare_teach_bl, outsider_teach_bl,
            research_bl, society_bl, culture_bl, report_Overtime, topic_Overtime, abnormal_Score, comit_course_bl, check_Depart_bl, check_Teacher_bl, other4_4_4_bl,
            other4_4_4_description, resourceIssue, administrativeIssues, evaluation_Student, evaluation_Teacher, evaluation_Other,
            comment_Teacher_6222, improveTeaching7_1, recomment7_2, user_Id, course_Id],
            (err, results) => {
                if (err) {
                    console.error('Error Saving OBE5', err);
                    res
                        .status(500)
                        .json({ success: false, message: 'Internal Server Error' });
                } else {
                    const insertedId = results.insertId;
                    res
                        .json({ success: true, message: 'Saving Data OBE5 Complete', obe5_Id: insertedId });
                }
            })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Pull Outcome-Based Education 5 Old */

app.get('/api/yearobe5', (req, res) => {

    const yearobe5 = `SELECT DISTINCT RIGHT(obe5_semster, 4) AS year FROM outcome_based_education5 ORDER BY year`;

    db.query(yearobe5, (err, results) => {
        if (err) {
            console.error('Error fetching year outcome based education5:', err);
            return res.status(500).json({ error: 'Error fetching year data' });
        }
        res.status(200).json({ message: 'data year outcome based education5:', results });
    })
});

app.get('/api/dataobe5', async (req, res) => {

    const { user_Id, course_Id, year } = req.query;

    const obe5Query = `SELECT obe5.obe5_Id, obe5.obe5_semster, obe5.report_Overtime, obe5.topic_Overtime, 
    obe5.abnormal_Score, obe5.comit_course_bl, obe5.check_Depart_bl, obe5.check_Teacher_bl, 
    obe5.other4_4_4_bl, obe5.other4_4_4_description, obe5.resourceIssue, obe5.administrativeIssues, 
    obe5.evaluation_Student, obe5.evaluation_Teacher, obe5.evaluation_Other, obe5.comment_Teacher_6222, 
    obe5.improveTeaching7_1, obe5.recomment7_2 FROM outcome_based_education5 AS obe5
    WHERE obe5.user_Id = ? AND  obe5.course_Id = ? AND  SUBSTRING_INDEX(obe5.obe5_semster, '/', -1) = ?`;

    try {
        const [results] = await db.promise().query(obe5Query, [user_Id, course_Id, year]);
        res.status(200).json({ message: 'Old data outcome based education5:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/datafmtive', async (req, res) => {

    const { obe5_Id } = req.query;
    const fmtiveQuery = `SELECT fm.fmtive_assign, fm.fmtive_Name, fm.fmtive_setplan, fm.fmtive_develop 
    FROM formativeevl AS fm WHERE fm.obe5_Id = ?`;

    try {
        const [results] = await db.promise().query(fmtiveQuery, [obe5_Id]);
        res.status(200).json({ message: 'Old data formative of outcome based education5:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/datasummative', async (req, res) => {

    const { obe5_Id } = req.query;
    const summativeQuery = `SELECT sm.smtive_Name, sm.smtive_setplan, sm.smtive_Develop 
    FROM summativeevl AS sm WHERE  sm.obe5_Id = ?`;

    try {
        const [results] = await db.promise().query(summativeQuery, [obe5_Id]);
        res.status(200).json({ message: 'Old data formative of outcome based education5:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/dataevlplan', async (req, res) => {

    const { obe5_Id } = req.query;
    const planoverQuery = `SELECT evl.learning_outcome, evl.planed_Evalution, evl.actual_Evalution, evl.planed_EvalutionWeek, evl.actual_EvalutionWeek, evl.planned_Assessment, evl.actual_Assessment 
    FROM evlplanover AS evl WHERE evl.obe5_Id = ?`;

    try {
        const [results] = await db.promise().query(planoverQuery, [obe5_Id]);
        res.status(200).json({ message: 'Old data planover of outcome based education5:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/api/datasupport', async (req, res) => {

    const { obe5_Id } = req.query;
    const supportQuery = `SELECT sp.support_Name, sp.support_Operation, sp.support_NotOperation, sp.support_Improvement 
    FROM support_learning AS sp WHERE sp.obe5_Id = ?`;

    try {
        const [results] = await db.promise().query(supportQuery, [obe5_Id]);
        res.status(200).json({ message: 'Old data support learning of outcome based education5:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
})

/* Outcome-Based Education 5 PDF */
app.post('/api/pdf5', uploadPDF.single('pdfFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('no files were uploaded.');
    }

    const { size } = req.file;
    const fileName = req.body.fileName;
    const path = req.file.path;
    const obe5_Id = req.body.obe5Id

    const pdf5 = `INSERT INTO pdf_obe5 (fileName, path, size, obe5_Id) VALUES (?,?,?,?)`;
    const values = [fileName, path, size, obe5_Id];

    db.query(pdf5, values, (err, results) => {
        if (err) {
            console.error('Error inserting PDF5 data', err);
            return res.status(500).send('Failed to store PDF5 data');
        }
        console.log('PDF5 data stored successfully');
        res.status(200).send('PDF5 uploaded and data stored successfully');
    });
});

app.get('/api/pdfobe5', (req, res) => {

    const pdf_obe5 = `SELECT obe5document_Id, fileName, path FROM pdf_obe5`;

    db.query(pdf_obe5, (err, results) => {
        if (err) {
            console.error('Error fetching PDF outcome based education 5 data:', err);
            return res.status(500).send('Failed to fetch PDF data');
        }
        res.status(200).json(results);
    });
});

/* Curriculum OBE 7 */
// app.get("/api/curriculumData", (req, res) => {

//     const getCurriculum = `SELECT curriculum_Name, department_Name, campus, 
//     faculty, college, branch FROM curriculum ORDER BY curriculum_Id DESC LIMIT 1 `;

//     db.query(getCurriculum, (err, results) => {
//         if (err) {
//             console.error('Error exercuting MySQL query:', err);
//             res.status(500).json({ message: 'Internal Server Error' });
//             return;
//         }
//         res.status(200).json(results);
//     })
// })

app.get('/api/courseInstructors', (req, res) => {

    const instructor = `SELECT DISTINCT user.user_FirstName, user.user_LastName, user.qualification, user.positions 
    FROM user JOIN user_role ON user.user_Id = user_role.user_Id JOIN role ON user_role.role_Id = role.role_Id WHERE role.role_Name = 'Course Instructor' OR role.role_Name = 'Subject Instructor'`;

    db.query(instructor, (err, results) => {
        if (err) {
            console.error('Error exercuting MySQL query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from DB:', results);
        res
            .status(200)
            .json(results);
    })
})

app.get('/api/chooseCourse', (req, res) => {

    const cs = `SELECT course.course_Id, course.course_Code, course.course_Name FROM course`;

    db.query(cs, (err, results) => {
        if (err) {
            console.error('Error exercuting MySQL query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from Data base:', results);
        res
            .status(200)
            .json(results);
    })
})

app.get('/api/chooseCms', (req, res) => {

    const { course_Id } = req.query;

    console.log(`Received request for CLOs with course_Id: ${course_Id}`);

    const cs = `SELECT course_learning_outcome.clo_Id, course_learning_outcome.clo_Name, course_learning_outcome.clo_code 
    FROM course_learning_outcome  WHERE course_learning_outcome.course_Id = ?`;

    db.query(cs, [course_Id], (err, results) => {
        if (err) {
            console.error('Error exercuting MySQL query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from Data base:', results);
        res
            .status(200)
            .json(results);
    })
})

app.get('/api/chooseels', (req, res) => {

    const { clo_Id } = req.query;

    console.log(`Received request for ELOs with clo_Id: ${clo_Id}`);

    const els = `SELECT compare_teaching_clo_with_elo.clo_Id, compare_teaching_clo_with_elo.elo_Id, expected_learning_outcome.elo_code, expected_learning_outcome.elo_Name 
    FROM compare_teaching_clo_with_elo INNER JOIN  expected_learning_outcome 
    ON compare_teaching_clo_with_elo.elo_Id = expected_learning_outcome.elo_Id 
    WHERE compare_teaching_clo_with_elo.clo_Id = ?`;

    db.query(els, [clo_Id], (err, results) => {
        if (err) {
            console.error('Error exercuting MySQL query:', err);
            res
                .status(500)
                .json({ message: 'Internal Server Error' });
            return;
        }
        console.log('Results from Data base:', results);
        res
            .status(200)
            .json(results);
    })
});

/* Select ELO OBE 7 */
app.get('/api/selectedELO', async (req, res) => {

    const elodata = `SELECT elo_Id, elo_code, elo_Name FROM expected_learning_outcome`;

    try {
        const [results] = await db.promise().query(elodata);
        res.status(200).json({ message: 'expected_learning_outcome data:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

/* Upload File OBE 7 */
app.post('/api/img7', uploadImage.single('obe7_img_analysis'), (req, res) => {

    console.log('Uploaded File:', req.file);

    const obe7_img_analysis = req.file;
    if (!obe7_img_analysis) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('Request Body:', req.body);

    const { obe_Dscript_7301, obe7_Id } = req.body;
    const obe_Dscript_7301_Value = obe_Dscript_7301 || null;

    if (!obe7_Id || !obe_Dscript_7301) {
        return res.status(400).json({ error: 'Required data not provided' });
    }

    const path = obe7_img_analysis ? req.file.path : "";
    const query = `INSERT INTO imgobe7 (imgAnalysisCourse, obe_Dscript_7301, obe7_Id) VALUES (?,?,?)`;

    db.query(query, [path, obe_Dscript_7301_Value, obe7_Id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error occurred.' });
        }
        res.status(201).json({ message: 'Image uploaded and data stored successfully', path });
    });
})

/* Responsible OBE 7 */
app.post('/api/responsibleCurri', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { instructor, qualification, positions, obe7_Id } = req.body;
        const rescurri = `INSERT INTO curriculum_responsible (instructor, qualification, positions, obe7_Id) VALUES (?,?,?,?)`;

        db.query(rescurri, [instructor, qualification, positions, obe7_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Data Responsible Curriculum');
                res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Responsible Curriculum successfully', data: results });
        })
    } catch (error) {
        console.error('Error handing request body:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Analysis Course & Analysis Did Not */
app.post('/api/ansCourse', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { course_Id, abnormalities, conducting, factor_Analysis, guide_improvement, obe7_Id } = req.body;
        const ansCourse = `INSERT INTO analysis_course (course_Id, abnormalities, conducting, factor_Analysis, guide_improvement, obe7_Id) VALUES (?,?,?,?,?,?)`;

        db.query(ansCourse, [course_Id || null, abnormalities || null, conducting || null, factor_Analysis || null, guide_improvement || null, obe7_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Analysis Course', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.status(200).json({ success: true, message: 'Saving Data Analysis Course Complete' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/ansDidnot', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { course_Id, clo_Id, elo_Id, reasonclo_NotArchive, development_GuideStu, obe7_Id, user_Id } = req.body;
        const didnot = `INSERT INTO anlscoursedidnot (course_Id, clo_Id, elo_Id, reasonclo_NotArchive, development_GuideStu, obe7_Id, user_Id) VALUES (?,?,?,?,?,?,?)`;

        db.query(didnot, [course_Id || null, clo_Id || null, elo_Id || null, reasonclo_NotArchive || null, development_GuideStu || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Analysis Didnot Course', err);
                res.status(500).json({ success: false, message: ' Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Analysis Did not Course Complete' })
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Offer */
app.post('/api/offered', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { course_Id, reason_notTeaching, alternative, obe7_Id, user_Id } = req.body;
        const off = `INSERT INTO course_not_offered (course_Id, reason_notTeaching, alternative, obe7_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(off, [course_Id || null, reason_notTeaching || null, alternative || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Data Course not offered', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Course not offered' });
        });
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Edit Teaching */
app.post('/api/edTeaching', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { topic_Notteach, reason_Notteach, edit_Teaching, course_Id, obe7_Id, user_Id } = req.body;
        const edtch = `INSERT INTO edit_teaching (topic_Notteach, reason_Notteach, edit_Teaching, course_Id, obe7_Id, user_Id) VALUES (?,?,?,?,?,?)`;

        db.query(edtch, [topic_Notteach || null, reason_Notteach || null, edit_Teaching || null, course_Id || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Data Edit Teaching Course', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Edit Teaching Course' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Not Register */
app.post('/api/notregister', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { course_Id, analyze_Factors_Affect, guideline_Improvement, obe7_Id, user_Id } = req.body;
        const ntg = `INSERT INTO notregiscourse (course_Id, analyze_Factors_Affect, guideline_Improvement, obe7_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(ntg, [course_Id || null, analyze_Factors_Affect || null, guideline_Improvement || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving not register course', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data not register course' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Manage Curriculum */
app.post('/api/manageCurri', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { problem_Name, effect_Name, protect_Name, obe7_Id, user_Id } = req.body;
        const manage = `INSERT INTO managecurriculum (problem_Name, effect_Name, protect_Name, obe7_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(manage, [problem_Name || null, effect_Name || null, protect_Name || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Management Curriculum', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Management Curriculum' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Eval */
app.post('/api/evlc', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { improtant_Cri, Propose_Chg, obe7_Id, user_Id } = req.body;
        const evl = `INSERT INTO course_evalution (improtant_Cri, Propose_Chg, obe7_Id, user_Id) VALUES (?,?,?,user_Id)`;

        db.query(evl, [improtant_Cri || null, Propose_Chg || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Course Evalution', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Course Evalution' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Stake Holder */
app.post('/api/stakeHolder', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { people, criticism, Propose_Chg, obe7_Id, user_Id } = req.body;
        const stke = `INSERT INTO stakeholdersevl (people, criticism, Propose_Chg, obe7_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(stke, [people || null, criticism || null, Propose_Chg || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving StakeHolder Evaluation', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data StakeHolder Evaluation' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* ELO Comment */
app.post('/api/eloComm', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { elo_Id, people_other, comment_Student_elo, improvement_elo, obe7_Id, user_Id } = req.body;
        const elc = `INSERT INTO elo_comment (elo_Id, people_other, comment_Student_elo, improvement_elo, obe7_Id, user_Id) VALUES (?,?,?,?,?,?)`;

        db.query(elc, [elo_Id || null, people_other || null, comment_Student_elo || null, improvement_elo || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving ELO Comment');
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data ELO Comment' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Suggest Evalutor */
app.post('/api/sgevalutor', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { Assessor, idea, content, obe7_Id, user_Id } = req.body;
        const sgg = `INSERT INTO suggestevalutor (Assessor, idea, content, obe7_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(sgg, [Assessor || null, idea || null, content || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Suggest Evalutor');
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Suggest Evalutor' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Progress */
app.post('/api/progress', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { action_plan, deadline, responsible, operationResult, unsuccess, obe7_Id, user_Id } = req.body;
        const pgss = `INSERT INTO progress (action_plan, deadline, responsible, operationResult, unsuccess, obe7_Id, user_Id) VALUES (?,?,?,?,?,?,?)`;

        db.query(pgss, [action_plan || null, deadline || null, responsible || null, operationResult || null, unsuccess || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving Progress of implementation report');
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data Progress of implementation report' });
        })

    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* Qualification OBE 7 */
app.post('/api/quailifications', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { indicators, performance, explanation, obe7_Id, user_Id } = req.body;
        const qualification = `INSERT INTO qualifications (indicators, performance, explanation, obe7_Id, user_Id) VALUES (?,?,?,?,?)`;

        db.query(qualification, [indicators || "", performance || "", explanation || "", obe7_Id || "", user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving data qualifications');
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data qualifications' });
        })
    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/* New Educations OBE 7 */
app.post('/api/newEducations', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { plan_next_year, actionPlanName, deadlinePlan, Responsible, obe7_Id, user_Id } = req.body;
        const newEdus = `INSERT INTO neweducationplan (plan_next_year, actionPlanName, deadlinePlan, Responsible, obe7_Id, user_Id) VALUES (?,?,?,?,?,?)`;

        db.query(newEdus, [plan_next_year || null, actionPlanName || null, deadlinePlan || null, Responsible || null, obe7_Id || null, user_Id], (err, results) => {
            if (err) {
                console.error('Error Saving New action plan for next year');
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: 'Saving Data New action plan for next year' });
        })

    } catch (error) {
        console.error('Error handing request:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})

/* Save Outcome-Based Education 7 */
app.post('/api/obe7', (req, res) => {
    try {
        console.log('receive request body:', req.body);

        const { user_Id, obe7_college, obe7_campus, obe7_faculty, obe7_department, obe7_curriculum, obe7_branch, obe7_years, qualification_Level, obe_reportDate,
            report_Academic_Year, analysisDataStudent, ELo_Archive_bl, obe_description74201, obe_description74301, obe_76201_description,
            obe_77201_description, obe_77202_description, obe_77203_description, } = req.body;

        const obe7 = `INSERT INTO outcome_based_education7 (user_Id, obe7_college, obe7_campus, obe7_faculty, obe7_department, obe7_curriculum, obe7_branch, obe7_years, qualification_Level, 
        obe_reportDate, report_Academic_Year, analysisDataStudent, ELo_Archive_bl, obe_description74201, obe_description74301, obe_76201_description, 
        obe_77201_description, obe_77202_description, obe_77203_description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        db.query(obe7, [user_Id, obe7_college, obe7_campus, obe7_faculty, obe7_department, obe7_curriculum, obe7_branch, obe7_years, qualification_Level,
            obe_reportDate, report_Academic_Year, analysisDataStudent, ELo_Archive_bl, obe_description74201, obe_description74301, obe_76201_description,
            obe_77201_description, obe_77202_description, obe_77203_description],
            (err, results) => {
                if (err) {
                    console.error('Error Saving OBE7', err);
                    if (!res.headersSent) {
                        res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }
                    return;
                } else {
                    const insertedId = results.insertId;
                    if (!res.headersSent) {
                        res.json({ success: true, message: 'Saving Data OBE7 Complete', obe7_Id: insertedId });
                    }
                }
            })
    } catch (error) {
        console.error('Error handing request:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
});

/* Pull Outcome-Based Education 7 Old */

app.get('/api/university', (req, res) => {

    const university = `SELECT DISTINCT curriculum_Name, department_Name, campus, faculty, college, branch FROM curriculum`;

    db.query(university, (err, results) => {
        if (err) {
            console.error('Error fetching Data university:', err);
            return res.status(500).send('Failed to fetch university data');
        }
        res.status(200).json(results);
    })
});

app.get('/api/yearobe7', (req, res) => {

    const yearobe7 = `SELECT DISTINCT RIGHT(report_Academic_Year, 4) AS year FROM outcome_based_education7 ORDER BY year`;

    db.query(yearobe7, (err, results) => {
        if (err) {
            console.error('Error fetching year outcome based education7:', err);
            return res.status(500).json({ error: 'Error fetching year data' });
        }
        res.status(200).json({ message: 'data year outcome based education7:', results });
    })
});

app.get('/api/usersInObe7', (req, res) => {
    const userObe7 = `SELECT DISTINCT obe7.user_Id, user.user_FirstName, user.user_LastName
    FROM outcome_based_education7 AS obe7
    JOIN user ON obe7.user_Id = user.user_Id
    ORDER BY user.user_FirstName, user.user_LastName`;

    db.query(userObe7, (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Error fetching user data' });
        }
        res.status(200).json({ message: 'Users data fetched successfully', results });
    });
});

app.get('/api/dataobe7', async (req, res) => {

    const { user_Id, year } = req.query;
    const obe7Query = `SELECT obe7.obe7_Id, 
    obe7.report_Academic_Year,
    obe7.analysisDataStudent,
    obe7.ELo_Archive_bl,
    obe7.obe_description74201,
    obe7.obe_description74301,
    obe7.obe_76201_description,
    obe7.obe_77201_description,
    obe7.obe_77202_description,
    obe7.obe_77203_description 
    FROM outcome_based_education7 AS obe7 
    WHERE obe7.report_Academic_Year = ? AND obe7.user_Id = ? 
    ORDER BY obe7.created_at DESC`;

    try {
        const [results] = await db.promise().query(obe7Query, [year, user_Id]);
        res.status(200).json({ message: 'Old data outcome based education7:', results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
});

/* Outcome-Based Education 7 PDF */
app.post('/api/pdf7', uploadPDF.single('pdfFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('no files were uploaded.');
    }

    const { size } = req.file;
    const fileName = req.body.fileName;
    const path = req.file.path;
    const obe7_Id = req.body.obe7Id;

    const pdf7 = `INSERT INTO pdf_obe7 (fileName, path, size, obe7_Id) VALUES (?,?,?,?)`;
    const values = [fileName, path, size, obe7_Id];

    db.query(pdf7, values, (err, results) => {
        if (err) {
            console.error('Error inserting PDF document Outcome based Education7', err);
            return res.status(500).send('Failed to store PDF data');
        }
        console.log('PDF data stored successfully');
        res.status(200).send('PDF uploaded and data stored successfully');
    });
});

app.get('/api/pdfobe7', (req, res) => {

    const pdf_obe7 = `SELECT documentpdf_Id, fileName, path FROM pdf_obe7`;

    db.query(pdf_obe7, (err, results) => {
        if (err) {
            console.error('Error fetching PDF outcome based education 3 data:', err);
            return res.status(500).send('Failed to fetch PDF data');
        }
        res.status(200).json(results);
    });
});

module.exports = db.promise();