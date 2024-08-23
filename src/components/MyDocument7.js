import React, { useState } from 'react';
import { Document, Page, Text, Font, Image, View, StyleSheet } from '@react-pdf/renderer';

/* img */
import LogoDoc from '../img/Logo.png';
import tickIcon from '../img/tickIcon.png';

/* Font */
import THSarabun from '../font/THSarabun.ttf';
import THSarabun_Bold from '../font/THSarabun_Bold.ttf';

/* ลงทะเบียน Font เพื่อใช้งาน */
Font.register({ family: 'THSarabun', src: THSarabun });
Font.register({ family: 'THSarabun_Bold', src: THSarabun_Bold });

const styles = StyleSheet.create({
    font: {
        fontFamily: 'THSarabun', fontSize: 12,
    },
    logo: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logos: {
        width: 50, height: 50, display: 'block', marginTop: 20
    },
    header: {
        display: 'flex', flexDirection: 'row',
    },
    header1: {
        fontSize: 10, flex: 1, textAlign: 'left', marginLeft: 100,
    },
    header2: {
        fontSize: 10, flex: 1, textAlign: 'right', marginRight: 100,
    },
    header3: {
        fontSize: 10, flex: 1, textAlign: 'left', borderBottom: '1px solid black', marginBottom: 7, marginLeft: 100, paddingBottom: 5,
    },
    header4: {
        fontSize: 10, flex: 1, textAlign: 'right', borderBottom: '1px solid black', marginBottom: 7, marginRight: 100, paddingBottom: 5,
    },
    body: {
        fontFamily: 'THSarabun_Bold', textAlign: 'center', marginTop: 10,
    },
    body1: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 10, marginLeft: 100,
    },
    mode: {
        fontFamily: 'THSarabun_Bold', textAlign: 'center', marginTop: 10,
    },
    topic: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 10, marginLeft: 100, paddingBottom: 1,
    },
    topic1: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 10, marginLeft: 100, marginRight: 100,
    },
    topic2: {
        textAlign: 'left', marginLeft: 100, paddingRight: 100, marginBottom: 5,
    },
    topic3: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginLeft: 115, marginRight: 100,
    },
    topic4: {
        textAlign: 'left', marginLeft: 115, marginRight: 100,
    },
    topic5: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 10, marginLeft: 100, paddingRight: 30,
    },
    description: {
        textAlign: 'left', marginLeft: 115, marginRight: 100,
    },
    description1: {
        textAlign: 'left', marginLeft: 115, marginRight: 100,
    },
    description2: {
        flexDirection: 'row', textAlign: 'left', marginLeft: 115, paddingRight: 30,
    },
    description3: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 115, marginRight: 100, paddingRight: 30,
    },
    description4: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 115, marginRight: 100, paddingRight: 30,
    },
    description5: {
        marginBottom: 5, marginLeft: 115, marginRight: 100, flexWrap: 'wrap',
    },
    description6: {
        marginBottom: 5, marginLeft: 115, marginRight: 100, flexWrap: 'wrap',
    },
    box: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 3, marginLeft: 5,
    },
    checked: {
        width: 10, height: 10, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginRight: 5,
    },
    unchecked: {
        width: 10, height: 10,
    },
    icon: {
        width: 10, height: 10,
    },
    table: {
        textAlign: 'center', paddingLeft: 100, paddingRight: 100,
    },
    table1: {
        textAlign: 'center', marginBottom: 5, paddingLeft: 100, paddingRight: 100,
    },
    table2: {
        textAlign: 'center', paddingLeft: 100, paddingRight: 30,
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerCell: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 3,
    },
    headerCell1: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 3,
    },
    headerCell2: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 3,
    },
    headerCell3: {
        width: 65, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 9,
    },
    headerCell4: {
        width: 65, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 15,
    },
    headerCell5: {
        width: 65, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 8,
    },
    headerCell6: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell7: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell8: {
        width: 65, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 15,
    },
    headerCell9: {
        width: 65, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 22,
    },
    headerCell10: {
        width: 65, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 8,
    },
    headerCell11: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 22,
    },
    headerCell12: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 2,
    },
    headerCell13: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 10,
    },
    headerCell14: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 10,
    },
    headerCell15: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 3,
    },
    headerCell16: {
        width: 120, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 2,
    },
    headerCell17: {
        width: 120, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 2,
    },
    headerCell18: {
        width: 120, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell19: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 10,
    },
    headerCell20: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell21: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 10,
    },
    headerCell22: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 5,
    },
    headerCell23: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 5,
    },
    headerCell24: {
        width: 140, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 5,
    },
    headerCell25: {
        width: 200, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 5,
    },
    headerCell26: {
        width: 200, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 5,
    },
    headerCell27: {
        width: 200, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 12,
    },
    headerCell29: {
        width: 395, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell30: {
        width: 200, height: 30, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 7,
    },
    headerCell31: {
        width: 200, height: 30, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 7,
    },
    headerCell32: {
        width: 200, height: 40, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingTop: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
    },
    headerCell33: {
        width: 100, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 2,
    },
    headerCell34: {
        width: 100, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 2,
    },
    headerCell35: {
        width: 200, height: 60, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 15, paddingLeft: 1, paddingRight: 1,
    },
    headerCell36: {
        width: 200, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 5,
    },
    headerCell37: {
        width: 200, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 5,
    },
    headerCell38: {
        width: 200, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 5,
    },
    cell: {
        width: 140, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 2, paddingLeft: 2,
    },
    cell1: {
        width: 140, height: 'auto', backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingLeft: 3,
    },
    cell2: {
        width: 65, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    },
    cell3: {
        width: 65, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell4: {
        width: 100, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell5: {
        width: 100, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell6: {
        width: 140, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    },
    cell7: {
        width: 140, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell8: {
        width: 200, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell9: {
        width: 200, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell10: {
        width: 140, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell11: {
        width: 140, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingLeft: 3,
    },
    cell12: {
        width: 140, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell13: {
        width: 140, backgroundColor: '#fff', textAlign: 'center', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell14: {
        width: 140, height: 'auto', backgroundColor: '#fff', borderTopWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingLeft: 3,
    },
    cell16: {
        width: 100, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    },
    cell17: {
        width: 100, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    cell18: {
        width: 200, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all',
    },
    image: {
        width: 300, height: 350, marginTop: 5, marginBottom: 5, marginLeft: 120, paddingRight: 30,
    },
});

const Checkbox = ({ label, check }) => (
    <View style={styles.box}>
        <View style={styles.checked}>
            {check ? <Image src={tickIcon} style={styles.icon} /> : <View style={styles.unchecked} />}
        </View>
        <Text> {label} </Text>
    </View>
);

function MyDocument7({ curriculum, formData, curriculum_Teacher, imgFile, analysisCourse, chooseCourse, analysisdidnot,
    courseNtoffered, editTeaching, notregiscourse, manageCurriculum, courseEvalution, stakeholdersEvl, elo_comment,
    qualifications, suggestevalutor, progress, newEducations }) {

    return (
        <Document>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <Text style={styles.body}> รายงานผลการดำเนินการของหลักสูตร </Text>

                <Text style={styles.body1}>
                    ชื่อสถาบันอุดมศึกษา <Text style={styles.font}> {curriculum.college || 'N/A'} </Text>
                </Text>

                <Text style={styles.body1}>
                    วิทยาเขต <Text style={styles.font}> {curriculum.campus || 'N/A'} </Text>
                    คณะ <Text style={styles.font}> {curriculum.faculty || 'N/A'} </Text>
                    ภาควิชา <Text style={styles.font}> {curriculum.department_Name || 'N/A'} </Text>
                </Text>

                <Text style={styles.mode}> หมวดที่ 1 ข้อมูลทั่วไป </Text>

                <Text style={styles.body1}>
                    1.1 หลักสูตร <Text style={styles.font}> {curriculum.curriculum || 'N/A'} </Text>
                    สาขาวิชา <Text style={styles.font}> {curriculum.branch || 'N/A'} </Text>
                    พ.ศ. <Text style={styles.font}> {formData.years || 'N/A'} </Text>
                </Text>

                <Text style={styles.body1}>
                    1.2 ระดับคุณวุฒิ <Text style={styles.font}> {formData.qualification_Level || 'N/A'} </Text>
                </Text>

                <Text style={styles.topic}> 1.3 อาจารย์ผู้รับผิดชอบหลักสูตร </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}> ชื่อ-สกุล </Text>
                        <Text style={styles.headerCell1}> คุณวุฒิ </Text>
                        <Text style={styles.headerCell2}> ตำแหน่งวิชาการ </Text>
                    </View>
                    {curriculum_Teacher.map((teacher, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell}>{teacher.instructor || 'N/A'}</Text>
                            <Text style={styles.cell1}>{teacher.qualification || 'N/A'}</Text>
                            <Text style={styles.cell1}>{teacher.positions || 'N/A'}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.body1}>
                    1.4 วันที่รายงาน <Text style={styles.font}> {formData.obe_Report_Date || 'N/A'} </Text>
                </Text>

                <Text style={styles.body1}>
                    1.5 ปีการศึกษาที่รายงาน <Text style={styles.font}> {formData.report_Academic_Year || 'N/A'} </Text>
                </Text>

                <Text style={styles.mode}> หมวดที่ 2 ข้อมูลด้านนักศีกษา </Text>
                <Text style={styles.topic1}>วิเคราะห์ผลข้อมูลด้านนักศึกษา</Text>
                <Text style={styles.description}>{formData.analysis_DataStudent || 'N/A'}</Text>
            </Page>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <Text style={styles.mode}> หมวดที่ 3 ข้อมูลสรุปรายวิชาของหลักสูตร </Text>
                <Text style={styles.topic}> 3.1 สรุปผลรายวิชาที่เปิดสอนในภาคการศึกษา/ปีการศึกษา </Text>
                <Text style={styles.topic2}>ระบุรายวิชาที่เปิดสอนทั้งหมดพร้อมจำนวนนักศึกษาที่ลงทะเบียนเรียนจำนวนนักศึกษาที่สอบผ่านแต่ละรายวิชาและการกระจายของ ระดับคะแนน</Text>
                {imgFile.obe7_img_analysis && (
                    <Image style={styles.image} src={URL.createObjectURL(imgFile.obe7_img_analysis)} alt="Selected File" />
                )}

                <Text style={styles.topic}> 3.2 การวิเคราะห์รายวิชาที่มีผลการเรียนไม่ปกติ </Text>
                <Text style={styles.topic2}>ระบุรหัสและชื่อรายวิชาที่มีการแจกแจงระดับคะแนนไม่ปกติ เช่น ได้ระดับคะแนนสูงมากหรือต่ำเกินไปต่างจากเกณฑ์มาตรฐาน การให้ระดับคะแนนในแต่ละรายวิชาหรือนักศึกษาสอบตกมากเกินไปการสอนไม่ตรงกับเนื้อหาที่กำหนดของรายวิชา เป็นต้น นอกจากนี้ให้ระบุวิธีการตรวจสอบสาเหตุความผิดปกติที่ทำให้เกิดความไม่ปกติจากข้อกำหนดหรือเกณฑ์ที่ตั้งไว้และมาตรการแก้ไข ที่ดำเนินการไปแล้ว</Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell3}> รหัสและชื่อ รายวิชา </Text>
                        <Text style={styles.headerCell4}> ความไม่ปกติที่พบ </Text>
                        <Text style={styles.headerCell5}> การดำเนิน การตรวจสอบ </Text>
                        <Text style={styles.headerCell6}> เหตุผลที่ทำให้เกิด ความไม่ปกติจากข้อกำหนด หรือเกณฑ์ที่ตั้งไว้ </Text>
                        <Text style={styles.headerCell7}> มาตรการแก้ไข ที่ได้ดำเนินการแล้ว (หากจำเป็น) </Text>
                    </View>
                    {analysisCourse.map((alsc, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell2}>
                                {alsc.course_Code || ' '}
                                {alsc.course_Name || ' '}
                            </Text>
                            <Text style={styles.cell3}>{alsc.abnormalities}</Text>
                            <Text style={styles.cell3}>{alsc.conducting}</Text>
                            <Text style={styles.cell4}>{alsc.factoranalysis}</Text>
                            <Text style={styles.cell5}>{alsc.guideimprovement}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic1}>รายละเอียดเพิ่มเติม</Text>
                <Text style={styles.description}>{formData.obe_Dscript_7302 || ''}</Text>
            </Page>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <Text style={styles.topic}> 3.3 การวิเคราะห์รายวิชาที่ไม่บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) </Text>
                <Text style={styles.topic2}>ระบุรหัสและชื่อรายวิชาที่ดำเนินการแล้วไม่สามารถทำให้บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs)ได้นอกจากนี้ให้ ระบุ CLO ที่ไม่บรรลุ ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (ELO) ที่สอดคล้องกับ CLO ที่ไม่บรรลุ เหตุผลที่ทำให้ไม่สามารถ ทำให้บรรลุได้และแนวทางการพัฒนาปรับปรุงเพื่อให้นักศึกษาบรรลุตามแต่ละ CLO นั้นๆ</Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell8}> รหัสและ ชื่อรายวิชา </Text>
                        <Text style={styles.headerCell9}> CLOs ที่ไม่บรรลุ </Text>
                        <Text style={styles.headerCell10}> ELOs ที่สอดคล้องกับ CLOs ที่ไม่บรรลุ </Text>
                        <Text style={styles.headerCell11}> เหตุผลที่ทำให้ CLOs ไม่บรรลุ </Text>
                        <Text style={styles.headerCell12}> แนวทางการ พัฒนาปรับปรุงเพื่อ ให้นักศึกษาบรรลุ ตามแต่ละ CLO </Text>
                    </View>
                    {analysisdidnot.map((didnot, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell2}>
                                {didnot.course_Code || ''}
                                {didnot.course_Name || ''}
                            </Text>
                            <Text style={styles.cell3}>
                                {didnot.clo_code || ''}
                                {didnot.clo_Name || ''}
                            </Text>
                            <Text style={styles.cell3}>
                                {didnot.elo_code || ''}
                                {didnot.elo_Name || ''}
                            </Text>
                            <Text style={styles.cell4}> {didnot.reasonclo_NotArchive} </Text>
                            <Text style={styles.cell5}> {didnot.development_GuideStu} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 3.4 การวิเคราะห์ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (Expected Learning Outcomes: ELOs) </Text>
                <Text style={styles.topic2}>หากมีข้อมูลรายวิชาที่ดำเนินการแล้วไม่สามารถทำให้บรรลุผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา (CLOs) ในหัวข้อที่ 3.3 ให้วิเคราะห์ว่า CLO ที่ไม่บรรลุมีผลทำให้ ELOs ยังคงบรรลุอยู่ครบทุกตัวหรือไม่</Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="ELOs ยังคงบรรลุครบทุกตัว"
                        check={formData.elos_Achieved === 'ELOs ยังคงบรรลุครบทุกตัว'}
                    />
                </View>
                <View style={styles.description2}>
                    <Checkbox
                        label="ELOs ไม่บรรลุครบทุกตัว"
                        check={formData.elos_Achieved === 'ELOs ไม่บรรลุครบทุกตัว'}
                    /> && <Text>แต่มีมาตรการแก้ไขที่ดำเนินการเพื่อให้ ELOs บรรลุ คือ</Text>
                    {formData.elos_Achieved.includes("ELOs ไม่บรรลุครบทุกตัว") && (
                        <Text style={{ color: 'black' }}> {formData.elo_NtArchive_Dscript} </Text>
                    )}
                </View>

                <Text style={styles.topic}> 3.5 การเปิดรายวิชาในภาคหรือปีการศึกษา </Text>
                <Text style={styles.topic3}> 3.5.1 รายวิชาที่ไม่ได้เปิดสอนตามแผนการศึกษา และเหตุผลที่ไม่ได้เปิดสอน </Text>
                <Text style={styles.topic4}>ระบุรหัสและชื่อรายวิชาที่ไม่ได้เปิดสอนตามแผนการศึกษา พร้อมทั้งอธิบายเหตุผลที่ไม่ได้เปิดสอนและมาตรการทดแทนที่ได้</Text>
                <Text style={styles.topic2}>ดำเนินการเป็นรายวิชาแกนที่ต้องเปิดตามแผนการศึกษาแต่ขาดผู้สอนหรือจำนวนนักศึกษาที่ลงทะเบียนเรียนน้อยเกินไปและได้ดำเนิน การปรับแผนการเปิดรายวิชาเพื่อเป็นการประกันว่านักศึกษาสามารถลงทะเบียนเรียนตามแผนการศึกษาได้ในภาคการศึกษาต่อไป</Text>
                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell13}> รหัสและชื่อรายวิชา </Text>
                        <Text style={styles.headerCell14}> เหตุผลที่ไม่ได้เปิดสอน </Text>
                        <Text style={styles.headerCell15}> มาตรการทดแทน ที่ได้ดำเนินการ(ถ้ามี) </Text>
                    </View>
                    {courseNtoffered.map((ofred, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell6}>
                                {ofred.course_Code || ''}
                                {ofred.course_Name || ''}
                            </Text>
                            <Text style={styles.cell7}> {ofred.reason_notTeaching} </Text>
                            <Text style={styles.cell7}> {ofred.alternative} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic3}> 3.5.2 วิธีแก้ไขกรณีที่มีการสอนเนื้อหาในรายวิชาไม่ครบถ้วน </Text>
                <Text style={styles.topic4}>ระบุรหัสและชื่อรายวิชา สาระหรือหัวข้อที่ขาด สาเหตุที่ไม่ได้สอนสาระหรือหัวข้อดังกล่าว พร้อมวิธีแก้ไข (ถ้ามี) เช่น</Text>
                <Text style={styles.topic2}>สาระที่ขาดและจำเป็นต้องสอนเพื่อใช้เป็นพื้นฐานของรายวิชาอื่นได้เพิ่มหัวข้อหรือสาระที่ขาดในรายวิชาที่สูงขึ้น</Text>
                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell16}> รายวิชา </Text>
                        <Text style={styles.headerCell17}> สาระหรือหัวข้อที่ขาด </Text>
                        <Text style={styles.headerCell17}> สาเหตุที่ไม่ได้สอน </Text>
                        <Text style={styles.headerCell18}> การแก้ไขที่ได้ดำเนินการแล้ว </Text>
                    </View>
                    {editTeaching.map((edth, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell6}>
                                {edth.course_Code || ''}
                                {edth.course_Name || ''}
                            </Text>
                            <Text style={styles.cell7}> {edth.topic_Notteach} </Text>
                            <Text style={styles.cell7}> {edth.reason_Notteach} </Text>
                            <Text style={styles.cell7}> {edth.edit_Teaching} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic3}> 3.5.3 การวิเคราะห์รายวิชาที่เปิดสอน แต่ไม่มี นศ.ลงทะเบียนเรียน </Text>
                <Text style={styles.topic2}>ระบุรหัสและชื่อรายวิชาที่ไม่มี นศ.ลงทะเบียนเรียนตามที่กำหนดในแผนการศึกษา พร้อมทั้งอธิบาย/วิเคราะห์เหตุผล และแนวทางปรับปรุง/แก้ไข</Text>
                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell19}> รายวิชา </Text>
                        <Text style={styles.headerCell20}> วิเคราะห์ปัจจัยที่มีผลต่อ การดำเนินการของรายวิชา </Text>
                        <Text style={styles.headerCell21}> แนวทางการปรับปรุง/แก้ไข </Text>
                    </View>
                    {notregiscourse.map((ntc, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell6}>
                                {ntc.course_Code || ''}
                                {ntc.course_Name || ''}
                            </Text>
                            <Text style={styles.cell7}> {ntc.analyze_Factors_Affect} </Text>
                            <Text style={styles.cell7}> {ntc.guideline_Improvement} </Text>
                        </View>
                    ))}
                </View>
            </Page>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <Text style={styles.mode}> หมวดที่ 4 การบริหารหลักสูตร </Text>

                <Text style={styles.topic}> 4.1 การบริหารหลักสูตร </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell22}> ปัญหาอุปสรรคในการบริหารและ จัดการหลักสูตร </Text>
                        <Text style={styles.headerCell23}> ผลกระทบของปัญหาต่อผลสัมฤทธิ์ ตามวัตถุประสงค์ของหลักสูตร </Text>
                        <Text style={styles.headerCell24}> แนวทางการป้องกันและ แก้ไขปัญหาในอนาคต </Text>
                    </View>
                    {manageCurriculum.map((mc, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell6}> {mc.problem_Name || ''} </Text>
                            <Text style={styles.cell7}> {mc.effect_Name || ''} </Text>
                            <Text style={styles.cell7}> {mc.protect_Name || ''} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 4.2 การเปลี่ยนแปลงภายในสถาบัน (ถ้ามี) ที่มีผลกระทบต่อหลักสูตรในช่วง 1 ปีที่ผ่านมา </Text>
                <Text style={styles.description1}>{formData.obe_Dscript_74201 || ' '}</Text>

                <Text style={styles.topic}> 4.3 การเปลี่ยนแปลงภายนอกสถาบัน (ถ้ามี) ที่มีผลกระทบต่อหลักสูตรในช่วง 1 ปีที่ผ่านมา </Text>
                <Text style={styles.description1}>{formData.obe_Dscript_74301 || ' '}</Text>

                <Text style={styles.mode}> หมวดที่ 5 สรุปการประเมินหลักสูตรและคุณภาพการสอน </Text>

                <Text style={styles.topic}> 5.1 การประเมินหลักสูตรจากผู้ที่กำลังจะสำเร็จการศึกษา (รายงานตามปีที่สำรวจ) </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell25}> ข้อวิพากษ์ที่สำคัญจากผลการประเมิน </Text>
                        <Text style={styles.headerCell26}> ข้อเสนอการเปลี่ยนแปลงในหลักสูตรจากผลการประเมิน </Text>
                    </View>
                    {courseEvalution.map((Cevl, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell8}> {Cevl.improtant_Cri} </Text>
                            <Text style={styles.cell9}> {Cevl.Propose_Chg} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 5.2 การประเมินหลักสูตรจากผู้มีส่วนได้ส่วนเสียต่อหลักสูตร </Text>
                <View style={styles.description3}>
                    <Text>โดยประเมินจาก</Text>
                    <Checkbox
                        label="นักศึกษา"
                        check={formData.people === 'นักศึกษา'}
                    />
                    <Checkbox
                        label="ศิษย์เก่า"
                        check={formData.people === 'ศิษย์เก่า'}
                    />
                    <Checkbox
                        label="ผู้ใช้บัณฑิต"
                        check={formData.people === 'ผู้ใช้บัณฑิต'}
                    />
                    <Checkbox
                        label="อาจารย์และบุคลากรสายสนับสนุน"
                        check={formData.people === 'อาจารย์และบุคลากรสายสนับสนุน'}
                    />
                </View>

                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formData.people}
                        style={styles.checkbox}
                    />
                    {formData.people && (
                        <Text style={{ color: 'black' }}> {formData.obe_75201Other_Dscript || ''} </Text>
                    )}
                </View>

                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell25}> ข้อวิพากษ์ที่สำคัญจากผลการประเมิน </Text>
                        <Text style={styles.headerCell26}> ข้อเสนอการเปลี่ยนแปลงในหลักสูตรจากผลการประเมิน </Text>
                    </View>
                    {stakeholdersEvl.map((stk, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell8}> {stk.criticism} </Text>
                            <Text style={styles.cell9}> {stk.Propose_Chg} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 5.3 สรุปข้อคิดเห็นจากผู้มีส่วนได้ส่วนเสียต่อผลการเรียนรู้ที่คาดหวังของหลักสูตร (ELOs) </Text>
                <View style={styles.description3}>
                    <Text>โดยประเมินจาก</Text>
                    <Checkbox
                        label="นักศึกษา"
                        check={formData.people_other === 'นักศึกษา'}
                    />
                    <Checkbox
                        label="ศิษย์เก่า"
                        check={formData.people_other === 'ศิษย์เก่า'}
                    />
                    <Checkbox
                        label="ผู้ใช้บัณฑิต"
                        check={formData.people_other === 'ผู้ใช้บัณฑิต'}
                    />
                    <Checkbox
                        label="อาจารย์และบุคลากรสายสนับสนุน"
                        check={formData.people_other === 'อาจารย์และบุคลากรสายสนับสนุน'}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formData.people_other}
                        style={styles.checkbox}
                    />
                    {formData.people_other && (
                        <Text style={{ color: 'black' }}> {formData.obe_75301Other_Dscript || ''} </Text>
                    )}
                </View>

                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell25}> ผลลัพธ์การเรียนรู้ที่คาดหวัง ของหลักสูตร (Expected Learning Outcomes: ELO) </Text>
                        <Text style={styles.headerCell27}> ความเห็นของผู้มีส่วนได้ ส่วนเสียต่อนักศึกษาของหลักสูตร </Text>
                        <Text style={styles.headerCell27}> แผน/แนวทางการปรับปรุง เพื่อให้นักศึกษาบรรลุ ELOs </Text>
                    </View>
                    {elo_comment.map((cm, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell8}> {cm.elo_Id} </Text>
                            <Text style={styles.cell9}> {cm.comment_Student_elo} </Text>
                            <Text style={styles.cell9}> {cm.improvement_elo} </Text>
                        </View>
                    ))}
                </View>
            </Page>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <Text style={styles.topic}> 5.4 การประเมินคุณภาพหลักสูตรตามกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerCell29}> ผลการดำเนินงานตามกรอบมาตรฐานคุณวุฒิ </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell30}> ดัชนีบ่งชี้ผลการดำเนินงาน </Text>
                                <Text style={styles.headerCell31}> ผลการดำเนินงาน </Text>
                                <Text style={styles.headerCell31}> คำอธิบายหรือหลักฐานอ้างอิง </Text>
                            </View>
                        </View>
                    </View>
                    {qualifications.slice(0, 10).map((item, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell10}> {item.indicators} </Text>
                            <Text style={styles.cell11}> {item.performance} </Text>
                            <Text style={styles.cell11}> {item.explanation} </Text>
                        </View>
                    ))}
                </View>
            </Page>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <View style={styles.table}>
                    {qualifications.slice(10, 18).map((item, index) => (
                        <View style={[styles.headerRow, index === 7 ? { borderBottomWidth: 1 } : null]} key={index}>
                            <Text style={styles.cell13}> {item.indicators} </Text>
                            <Text style={styles.cell14}> {item.performance} </Text>
                            <Text style={styles.cell14}> {item.explanation} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.mode}> หมวดที่ 6 ข้อคิดเห็น และข้อเสนอแนะเกี่ยวกับคุณภาพหลักสูตรจากผู้ประเมินอิสระ </Text>

                <Text style={styles.topic}> 6.1 ข้อคิดเห็นหรือสาระที่ได้รับการเสนอแนะจากผู้ประเมิน และความเห็นของหลักสูตร/ผู้รับผิดชอบหลักสูตรต่อข้อคิดเห็น </Text>
                <View style={styles.table2}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerCell32}> ข้อคิดเห็นที่ได้รับการเสนอแนะจากผู้ประเมินอิสระ </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell33}>ผู้ประเมิน คือ</Text>
                                <Text style={styles.headerCell34}>ความคิดเห็น</Text>
                            </View>

                        </View>
                        <Text style={styles.headerCell35}> ความเห็น/ผู้รับผิดชอบหลักสูตร ต่อข้อคิดเห็นที่ได้รับการเสนอแนะ </Text>
                    </View>
                    {suggestevalutor.map((sg, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell16}> {sg.Assessor} </Text>
                            <Text style={styles.cell17}> {sg.idea} </Text>
                            <Text style={styles.cell18}> {sg.content} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 6.2 การนำไปดำเนินการเพื่อการวางแผนหรือปรับปรุงหลักสูตร </Text>
                <Text style={styles.description}>{formData.obe_76201_Dscript}</Text>
            </Page>

            <Page style={styles.font}>
                <View style={styles.logo}>
                    <Image src={LogoDoc} style={styles.logos} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.header1}> หลักสูตร วิทยาศาสตรบัณฑิต </Text>
                    <Text style={styles.header2}> ภาควิชา วิทยาการคอมพิวเตอร์และสารสนเทศ </Text>
                </View>

                <View style={styles.header}>
                    <Text style={styles.header3}> ระดับปริญญา ปริญญาตรี </Text>
                    <Text style={styles.header4}> คณะ วิทยาศาสตร์ประยุกต์ </Text>
                </View>

                <Text style={styles.mode}> หมวดที่ 7 ข้อคิดเห็น และข้อเสนอแนะเกี่ยวกับคุณภาพหลักสูตรจากผู้ประเมินอิสระ </Text>

                <Text style={styles.topic}> 7.1 ความก้าวหน้าของการดำเนินงานตามแผนที่เสนอในรายงานของปีที่ผ่านมา </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell8}> แผนดำเนินการ </Text>
                        <Text style={styles.headerCell9}> วันสิ้นสุดการ ดำเนินการตามแผน </Text>
                        <Text style={styles.headerCell10}> ผู้รับผิดชอบ </Text>
                        <Text style={styles.headerCell11}> ผลการดำเนิน การสำเร็จหรือไม่สำเร็จ </Text>
                        <Text style={styles.headerCell12}> เหตุผลที่ไม่สามารถ ดำเนินการให้สำเร็จ </Text>
                    </View>
                    {progress.map((ps, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell2}> {ps.action_plan} </Text>
                            <Text style={styles.cell3}> {ps.deadline} </Text>
                            <Text style={styles.cell3}> {ps.responsible} </Text>
                            <Text style={styles.cell4}> {ps.operationResult} </Text>
                            <Text style={styles.cell5}> {ps.unsuccess} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic5}> 7.2 ข้อเสนอในการพัฒนาหลักสูตร </Text>
                <View>
                    <Text style={styles.description5}> 7.2.1 ข้อเสนอในการปรับโครงสร้างหลักสูตร (จำนวนหน่วยกิต รายวิชาแกน รายวิชาเลือกฯ) </Text>
                    <Text style={styles.description6}>{formData.obe_77201_Dscript}</Text>
                    <Text style={styles.description5}> 7.2.2 ข้อเสนอในการเปลี่ยนแปลงรายวิชา (การเปลี่ยนแปลง เพิ่มหรือลดเนื้อหาในรายวิชา การเปลี่ยนแปลงวิธีการสอน และการประเมินผลสัมฤทธิ์รายวิชาฯ) </Text>
                    <Text style={styles.description6}>{formData.obe_77202_Dscript}</Text>
                    <Text style={styles.description5}> 7.2.2 ข้อเสนอในการเปลี่ยนแปลงรายวิชา (การเปลี่ยนแปลง เพิ่มหรือลดเนื้อหาในรายวิชา การเปลี่ยนแปลงวิธีการสอน และการประเมินผลสัมฤทธิ์รายวิชาฯ) </Text>
                    <Text style={styles.description6}>{formData.obe_77203_Dscript}</Text>
                </View>

                <Text style={styles.topic5}> 7.3 แผนปฏิบัติการใหม่สำหรับปี {formData.plan_next_year} (ระบุแผนสำหรับปีการศึกษาถัดไป) </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell36}> แผนปฏิบัติการ </Text>
                        <Text style={styles.headerCell37}> วันที่คาดว่าจะสิ้นสุดแผน </Text>
                        <Text style={styles.headerCell38}> ผู้รับผิดชอบ </Text>
                    </View>
                    {newEducations.map((edu, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell8}> {edu.actionPlanName} </Text>
                            <Text style={styles.cell9}> {edu.deadlinePlan} </Text>
                            <Text style={styles.cell9}> {edu.Responsible} </Text>
                        </View>
                    ))}
                </View>
            </Page>

        </Document >
    );
}

export default MyDocument7;