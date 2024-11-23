import React, { useState } from 'react';
import { Document, Page, Text, Font, Image, View, StyleSheet } from '@react-pdf/renderer';

/* img */
import LogoDoc from '../img/LogoDoc.jpg';
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
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 2, marginBottom: 2, marginLeft: 100, paddingRight: 30,
    },
    topic1: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 10, marginLeft: 100, paddingRight: 30,
    },
    description: {
        textAlign: 'left', marginLeft: 120, paddingRight: 30,
    },
    description1: {
        textAlign: 'left', marginLeft: 105, paddingRight: 30,
    },
    description2: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 120,
    },
    description3: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 120, marginRight: 100, paddingRight: 30,
    },
    description4: {
        flexDirection: 'row', textAlign: 'left', color: 'red', marginLeft: 105, paddingRight: 30,
    },
    description5: {
        textAlign: 'left', marginBottom: 2, marginLeft: 135, paddingRight: 30,
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
        textAlign: 'center', paddingLeft: 100, paddingRight: 30,
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerCell: {
        width: 150, height: 50, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingTop: 20,
    },
    headerCell1: {
        width: 250, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell2: {
        width: 82, height: 30, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 7,
    },
    headerCell3: {
        width: 84, height: 30, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 7,
    },
    headerCell4: {
        width: 60, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 5,
    },
    headerCell5: {
        width: 60, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 12,
    },
    headerCell6: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 12,
    },
    headerCell7: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 10,
    },
    headerCell8: {
        width: 100, height: 50, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingTop: 18,
    },
    headerCell9: {
        width: 100, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell10: {
        width: 100, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell11: {
        width: 50, height: 30, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 7,
    },
    headerCell12: {
        width: 50, height: 30, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 7,
    },
    headerCell13: {
        width: 80, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3, paddingLeft: 1, paddingRight: 1,
    },
    headerCell14: {
        width: 40, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 2,
    },
    headerCell15: {
        width: 40, height: 20, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 2,
    },
    headerCell16: {
        width: 200, height: 40, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, paddingTop: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
    },
    headerCell17: {
        width: 120, height: 40, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 13,
    },
    cell: {
        width: 150, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 2, paddingLeft: 2,
    },
    cell1: {
        width: 82, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, padding: 3,
    },
    cell2: {
        width: 60, height: 'auto', backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    },
    cell3: {
        width: 60, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1,
    },
    cell4: {
        width: 100, height: 'auto', backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', wordBreak: 'break-all', paddingLeft: 13,
    },
    cell5: {
        width: 100, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 2, paddingLeft: 2,
    },
    cell6: {
        width: 50, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1,
    },
    cell7: {
        width: 200, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 2, paddingLeft: 3,
    },
    cell8: {
        width: 40, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1,
    },
    cell9: {
        width: 120, height: 'auto', backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderRightWidth: 1,
    },
    cell10: {
        width: 84, height: 'auto', backgroundColor: '#fff', borderBottomWidth: 1, borderRightWidth: 1, padding: 3,
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

function MyDocument5({ formData, DataBoxValue, selectedInstructorNames, Support, CLOs, effectives, assignfmtive, formatives, summatives, addsmtives, showOtherInput, imgFile, discrepancy }) {

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

                <Text style={styles.body}> รายงานผลการดำเนินการของรายวิชา </Text>

                <Text style={styles.body1}>
                    ชื่อสถาบันอุดมศึกษา <Text style={styles.font}> {formData.college || 'N/A'} </Text>
                </Text>

                <Text style={styles.body1}>
                    วิทยาเขต <Text style={styles.font}> {formData.campus || 'N/A'} </Text>
                    คณะ <Text style={styles.font}> {formData.faculty || 'N/A'} </Text>
                    ภาควิชา <Text style={styles.font}> {formData.department_Name || 'N/A'} </Text>
                </Text>

                <Text style={styles.mode}> หมวดที่ 1 ข้อมูลทั่วไป </Text>

                <Text style={styles.topic1}> 1. รหัสและชื่อรายวิชา </Text>
                <Text style={styles.description}> {formData.courseNamecode || 'N/A'} </Text>

                <Text style={styles.topic}> 2. จำนวนหน่วยกิต </Text>
                <Text style={styles.description}> {formData.course_Credit || 'N/A'} </Text>

                <Text style={styles.topic}> 3. หลักสูตรและประเภทของรายวิชา </Text>
                <Text style={styles.description}>
                    หลักสูตร <Text style={styles.font}> {formData.curriculum_Name || 'N/A'} </Text> บัณฑิต
                    สาขาวิชา <Text style={styles.font}> {formData.branch || 'N/A'} </Text>
                </Text>
                <Text style={styles.description}>
                    เป็นรายวิชา {formData.course_Category || 'N/A'}
                </Text>

                <Text style={styles.topic}> 4. อาจารย์ผู้รับผิดชอบรายวิชาและอาจารย์ผู้สอน </Text>
                <View style={styles.description2}>
                    <Text style={styles.font}> อาจารย์ผู้รับผิดชอบรายวิชา </Text>
                    <Text style={{ marginLeft: 30 }}> {formData.responsible_Teacher || 'N/A'} </Text>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: 123 }}>
                    <Text style={styles.font}>อาจารย์ผู้สอน</Text>
                    <Text style={{ marginLeft: 78 }}>
                        {selectedInstructorNames.length > 0 ? (
                            <>
                                <Text>{selectedInstructorNames[0]}</Text>
                                {selectedInstructorNames.slice(1).map((name, index) => (
                                    <Text key={index + 1} style={{ marginLeft: 244 }}>{'\n'}{name}</Text>
                                ))}
                            </>
                        ) : (
                            <Text>ไม่มีอาจารย์ผู้สอน</Text>
                        )}
                    </Text>
                </View>

                <Text style={styles.topic}> 5. ภาคการศึกษา/ชั้นปีที่เรียน </Text>
                <Text style={styles.description}>
                    ภาคการศึกษา <Text style={styles.font}> {formData.semster_term || 'N/A'} </Text>
                    ของชั้นปีที่ <Text style={styles.font}> {formData.year_of_study || 'N/A'} </Text>
                </Text>

                <Text style={styles.topic}> 6. รายวิชาบังคับก่อน (Pre-requisite) (ถ้ามี) </Text>
                <Text style={styles.description}> {formData.prerequisites || 'N/A'} </Text>

                <Text style={styles.topic}> 7. รายวิชาที่ต้องเรียนพร้อมกัน (Co-requisites) (ถ้ามี) </Text>
                <Text style={styles.description}> {formData.corequisites || 'N/A'} </Text>

                <Text style={styles.topic}> 8. สถานที่เรียน </Text>
                <Text style={styles.description}> คณะ/วิทยาลัย {formData.study_Area || 'N/A'} มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ </Text>

                <Text style={styles.topic}> 9. ข้อมูลประกอบการประกันคุณภาพการศึกษา </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="การเรียนการสอนในรายวิชานี้มีส่วนที่ได้รับการพัฒนาขึ้นใหม่หรือปรับปรุงจากที่สอนเมื่อครั้งก่อน"
                        check={DataBoxValue.compare_teach_bl}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการให้ผู้มีประสบการณ์ทางวิชาการหรือวิชาชีพจากหน่วยงานภายนอกเข้ามามีส่วนร่วมในกระบวนการเรียนการสอน"
                        check={DataBoxValue.outsider_teach_bl}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการบูรณาการกระบวนการวิจัยกับการจัดการเรียนการสอน หรือการจัดการเรียนรู้ที่พัฒนาจากการวิจัย"
                        check={DataBoxValue.reseach_bl}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการบูรณาการงานบริการทางวิชาการแก่สังคมกับการเรียนการสอน"
                        check={DataBoxValue.society_bl}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการบูรณาการงานด้านทำนุบำรุงศิลปะและวัฒนธรรมกับการจัดการเรียนการสอนและกิจกรรมนักศึกษา"
                        check={DataBoxValue.culture_bl}
                    />
                </View>

                <Text style={styles.topic}> 10. วันที่จัดทำหรือปรับปรุงรายละเอียดของรายวิชาครั้งล่าสุด </Text>
                <Text style={styles.description}> {formData.obe_latestC || 'N/A'} </Text>
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

                <Text style={styles.mode}> หมวดที่ 2 การจัดการเรียนการสอนที่เปรียบเทียบกับแผนการสอน </Text>

                <Text style={styles.topic1}> 1. รายงานชั่วโมงการสอนจริงที่คลาดเคลื่อนจากแผนการสอน (ถ้ามี) </Text>
                <Text style={styles.description}> {formData.report_Overtime || 'N/A'} </Text>

                <Text style={styles.topic}> 2. หัวข้อที่สอนไม่ครอบคลุมตามแผน (ถ้ามี) </Text>
                <Text style={styles.description}> {formData.topic_Overtime || 'N/A'} </Text>

                <Text style={styles.topic}> 3. จัดสิ่งสนับสนุนเพื่อประสิทธิผลในการเรียนรู้ของนักศึกษา </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}> สิ่งสนับสนุน </Text>
                        <View>
                            <Text style={styles.headerCell1}> ผลการดำเนินการ </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell2}> มีการดำเนินการ </Text>
                                <Text style={styles.headerCell3}> ไม่ได้ดำเนินการ </Text>
                                <Text style={styles.headerCell3}> แผนการปรับปรุง </Text>
                            </View>
                        </View>
                    </View>
                    {Support.map((sp, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell}> {`${sp.support_Name || ''}`} </Text>
                            <Text style={styles.cell1}>{`${sp.support_Operation || ''}`}</Text>
                            <Text style={styles.cell10}>{`${sp.support_NotOperation || ''}`}</Text>
                            <Text style={styles.cell10}>{`${sp.support_Improvement || ''}`}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 4. ผลลัพธ์การเรียนรู้ของรายวิชา (Course Learning Outcomes: CLOs) : นักศึกษาสามารถ </Text>
                {CLOs.map((clos, CLOindex) => (
                    <Text key={CLOindex} style={styles.description}> {clos.clo_code || 'N/A'} {clos.clo_Name || 'N/A'} </Text>
                ))}
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

                <Text style={styles.topic}> 5. ประสิทธิผลของวิธีการจัดการเรียนรู้และวิธีการประเมินผลที่ดำเนินการเพื่อทำให้เกิดผลลัพธ์การเรียนรู้ตามที่ระบุในรายละเอียดรายวิชา </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell4}> ผลลัพธ์ การเรียนรู้ ที่คาดหวัง ของรายวิชา CLOs </Text>
                        <Text style={styles.headerCell5}> ผลที่เกิดกับ นักศึกษาตาม CLOs (บรรลุ/ ไม่บรรลุ) </Text>
                        <Text style={styles.headerCell6}> วิธีการจัดการ สอน/ประสบ การณ์การเรียนรู้ตาม CLOs </Text>
                        <Text style={styles.headerCell5}> วิธีการจัด การสอน (เหมาะสม/ ไม่เหมาะสม) </Text>
                        <Text style={styles.headerCell6}> วิธีการวัดผลลัพธ์ การเรียนรู้ตาม CLOs </Text>
                        <Text style={styles.headerCell5}> วิธีการวัดผล (เหมาะสม/ ไม่เหมาะสม) </Text>
                        <Text style={styles.headerCell7}> แนวทางการ พัฒนาปรับปรุง เพื่อให้นักศึกษา บรรลุตามแต่ละ CLOs </Text>
                    </View>
                    {CLOs.map((clo, CLOindex) => (
                        <View style={styles.headerRow} key={CLOindex}>
                            <Text style={styles.cell2}> {clo.clo_code || 'N/A'} </Text>
                            <Text style={styles.cell3}>{effectives[CLOindex]?.effectOn_Student ? (<Image src={tickIcon} style={styles.icon} />) : null}</Text>
                            <Text style={styles.cell4}>{effectives[CLOindex]?.experience_Name || 'N/A'}</Text>
                            <Text style={styles.cell3}>{effectives[CLOindex]?.teaching_Method_Set || 'N/A'}</Text>
                            <Text style={styles.cell4}>{effectives[CLOindex]?.measuring_Name || 'N/A'} </Text>
                            <Text style={styles.cell3}>{effectives[CLOindex]?.measurement_Method || 'N/A'}</Text>
                            <Text style={styles.cell4}>{effectives[CLOindex]?.improve_Clo}</Text>
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

                <Text style={styles.mode}> หมวดที่ 3 ระบบการวัดและการประเมินผลการเรียนรู้ </Text>

                <Text style={styles.topic1}> 1. การประเมินผลแบบ Formative Evaluation : </Text>
                <View style={styles.description3}>
                    <Checkbox
                        label="มีการประเมิน"
                        check={assignfmtive.fmtive_assign === 'มีการประเมิน'}
                    />
                    <Checkbox
                        label="ไม่มีการประเมิน"
                        check={assignfmtive.fmtive_assign === 'ไม่มีการประเมิน'}
                    />
                </View>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell16}> วิธีจัดการประเมินผล แบบ Formative Evaluation </Text>
                        <View>
                            <Text style={styles.headerCell13}> แผนที่กำหนดไว้ </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell14}>มี</Text>
                                <Text style={styles.headerCell15}>ไม่มี</Text>
                            </View>
                        </View>
                        <Text style={styles.headerCell17}> แนวทางการปรับปรุงพัฒนา </Text>
                    </View>
                    {formatives.map((fmt, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell7}> {`${fmt.fmtive_Name || ''}`} {index === 1 || index === 2 ? fmt.append_fmtive_Name : ''} </Text>
                            <Text style={styles.cell8}> {fmt.fmtive_setplan === 1 ? <Image src={tickIcon} style={styles.icon} /> : ''} </Text>
                            <Text style={styles.cell8}> {fmt.fmtive_setplan === 0 ? <Image src={tickIcon} style={styles.icon} /> : ''} </Text>
                            <Text style={styles.cell9}> {fmt.fmtive_develop} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 2. การประเมินผลแบบ Summative Evaluation </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell16}> กระบวนการวัดและประเมินผลลัพธ์การเรียนรู้ </Text>
                        <View>
                            <Text style={styles.headerCell13}> การดำเนินการ </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell14}>มี</Text>
                                <Text style={styles.headerCell15}>ไม่มี</Text>
                            </View>
                        </View>
                        <Text style={styles.headerCell17}> แนวทางการพัฒนาคุณภาพ </Text>
                    </View>
                    {summatives.map((smt, index) => (
                        <View style={styles.headerRow} key={index}>
                            <View style={styles.cell7}>
                                <Text> {`${smt.smtive_Name || ''}`} </Text>
                                {index === 7 && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox
                                            label="อิงเกณฑ์"
                                            check={addsmtives.smtiverule || false}
                                        />
                                        <Checkbox
                                            label="อิงกลุ่ม"
                                            check={addsmtives.smtivegroup || false}
                                        />
                                        <Checkbox
                                            label="อื่นๆ"
                                            check={showOtherInput}
                                        />
                                        {showOtherInput && (
                                            <Text> {addsmtives.smtiveother} </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                            <Text style={styles.cell8}>{smt.smtive_setplan === 1 ? <Image src={tickIcon} style={styles.icon} /> : ''}</Text>
                            <Text style={styles.cell8}>{smt.smtive_setplan === 0 ? <Image src={tickIcon} style={styles.icon} /> : ''}</Text>
                            <Text style={styles.cell9}>{smt.smtive_Develop}</Text>
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

                <Text style={styles.mode}> หมวดที่ 4 สรุปผลการจัดการเรียนการสอนของรายวิชา </Text>

                <Text style={styles.topic1}> 1. ผลการจัดการเรียนการสอนของรายวิชา </Text>
                {imgFile.result_of_Teach && (
                    <Image style={styles.image} src={URL.createObjectURL(imgFile.result_of_Teach)} alt="Selected File" />
                )}

                <Text style={styles.topic}> 2. ปัจจัยที่ทำให้ระดับคะแนนผิดปกติ (ถ้ามี) </Text>
                <Text style={styles.description}>{formData.abnormal_Score || 'N/A'}</Text>

                <Text style={styles.topic}> 3. ความคลาดเคลื่อนจากแผนการประเมินที่กำหนดไว้ในรายละเอียดรายวิชาทั้งด้านกำหนดเวลาและวิธีการประเมินผล (ถ้ามี) </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell8}> ผลการเรียนรู้ </Text>
                        <View>
                            <Text style={styles.headerCell9}> วิธีการประเมิน </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell11}>ตามแผน</Text>
                                <Text style={styles.headerCell12}>ตามจริง</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.headerCell10}> สัปดาห์ที่ประเมิน </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell11}>ตามแผน</Text>
                                <Text style={styles.headerCell12}>ตามจริง</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.headerCell10}> สัดส่วนของการประเมิน </Text>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerCell11}>ตามแผน</Text>
                                <Text style={styles.headerCell12}>ตามจริง</Text>
                            </View>
                        </View>
                    </View>
                    {discrepancy.map((dsp, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell5}> {dsp.learning_outcome} </Text>
                            <Text style={styles.cell6}> {dsp.planed_Evalution} </Text>
                            <Text style={styles.cell6}> {dsp.actual_Evalution} </Text>
                            <Text style={styles.cell6}> {dsp.planed_EvalutionWeek} </Text>
                            <Text style={styles.cell6}> {dsp.actual_EvalutionWeek} </Text>
                            <Text style={styles.cell6}> {dsp.planned_Assessment} </Text>
                            <Text style={styles.cell6}> {dsp.actual_Assessment} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 4. การทวนสอบผลสัมฤทธิ์ของนักศึกษา </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินผลลัพธ์การเรียนรู้ของนักศึกษา โดยวิธีการให้คะแนนสอบคะแนนพฤติกรรม"
                        check={DataBoxValue.comit_course_bl}
                    />
                    <Checkbox
                        label="การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ"
                        check={DataBoxValue.check_Depart_bl}
                    />
                    <Checkbox
                        label="การทวนสอบการให้คะแนนจากการสุ่มตรวจผลงานของนักศึกษาโดยอาจารย์ หรือผู้ทรงคุณวุฒิอื่นๆที่ไม่ใช่อาจารย์ประจำหลักสูตร"
                        check={DataBoxValue.check_Teacher_bl}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={DataBoxValue.other4_4_4_bl}
                        style={styles.checkbox}
                    />
                    {DataBoxValue.other4_4_4_bl && (
                        <Text style={{ color: 'black' }}> {formData.other4_4_4_Description || 'N/A'} </Text>
                    )}
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

                <Text style={styles.mode}> หมวดที่ 5 ปัญหาและผลกระทบต่อการดำเนินการ </Text>

                <Text style={styles.topic1}> 1. ประเด็นด้านทรัพยากรประกอบการเรียนและสิ่งอำนวยความสะดวก (ถ้ามี) </Text>
                <Text style={styles.description}>{formData.resourceIssue || 'N/A'}</Text>

                <Text style={styles.topic}> 2. ประเด็นด้านการบริหารจัดการ (ถ้ามี) </Text>
                <Text style={styles.description}>{formData.administrativeIssues || 'N/A'}</Text>

                <Text style={styles.mode}> หมวดที่ 6 การประเมินรายวิชา </Text>

                <Text style={styles.topic1}> 1. ผลการประเมินรายวิชาโดยนักศึกษา (แนบเอกสาร) </Text>
                <Text style={styles.description}> 1.1 ข้อวิพากษ์ที่สำคัญจากผลการประเมินโดยนักศึกษา </Text>
                <Text style={styles.description5}>{formData.evaluation_Students || 'N/A'}</Text>
                <Text style={styles.description}> 1.2 ความเห็นของอาจารย์ผู้สอนต่อข้อวิพากษ์ตามข้อ 1.1 </Text>
                <Text style={styles.description5}>{formData.evaluation_Teacher || 'N/A'}</Text>

                <Text style={styles.topic}> 2. ผลการประเมินรายวิชาโดยวิธีอื่น </Text>
                <Text style={styles.description}> 2.1 ข้อวิพากษ์ที่สำคัญจากผลการประเมินโดยวิธีอื่น </Text>
                <Text style={styles.description5}>{formData.evaluation_Other || 'N/A'}</Text>
                <Text style={styles.description}> 2.2 ความเห็นของอาจารย์ผู้สอนต่อข้อวิพากษ์ตามข้อ 2.1 </Text>
                <Text style={styles.description5}>{formData.comment_Teacher_6222 || 'N/A'}</Text>

                <Text style={styles.mode}> หมวดที่ 7 แผนการปรับปรุง </Text>

                <Text style={styles.topic1}> 1. การดำเนินการเพื่อการปรับปรุงการเรียนการสอน/รายวิชา (นอกเหนือจากที่ระบุไว้ในหมวดที่ 2) </Text>
                <Text style={styles.description}>{formData.improveTeaching7_1 || 'N/A'}</Text>

                <Text style={styles.topic}> 2. ข้อเสนอแนะของอาจารย์ผู้รับผิดชอบรายวิชาต่ออาจารย์ผู้รับผิดชอบหลักสูตร </Text>
                <Text style={styles.description}>{formData.recomment7_2 || 'N/A'}</Text>
            </Page>

        </Document >
    );
}

export default MyDocument5;