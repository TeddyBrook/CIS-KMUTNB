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
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 2, marginBottom: 2, marginLeft: 100, marginRight: 100,
    },
    topic1: {
        fontFamily: 'THSarabun_Bold', textAlign: 'left', marginTop: 10, marginBottom: 2, marginLeft: 100, marginRight: 100,
    },
    topic2: {
        fontFamily: 'THSarabun_Bold', display: 'flex', flexDirection: 'row', marginTop: 2, marginLeft: 100,
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
        flexDirection: 'row', alignItems: 'center', marginLeft: 120, marginRight: 100,
    },
    description4: {
        flexDirection: 'row', textAlign: 'left', color: 'red', marginLeft: 105, paddingRight: 30,
    },
    box: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 3, marginLeft: 5,
    },
    checkboxContainer: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 30,
    },
    checkboxContainer1: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 11,
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
        width: 133, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 2,
    },
    headerCell4: {
        width: 133, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 2,
    },
    headerCell5: {
        width: 133, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 10,
    },
    headerCell6: {
        width: 40, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, paddingTop: 10,
    },
    headerCell7: {
        width: 120, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, paddingTop: 10,
    },
    headerCell8: {
        width: 60, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 10,
    },
    headerCell9: {
        width: 55, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell10: {
        width: 70, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, padding: 3,
    },
    headerCell11: {
        width: 95, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingTop: 3,
    },
    headerCell12: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell13: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 3,
    },
    headerCell14: {
        width: 100, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 10,
    },
    headerCell15: {
        width: 150, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 2,
    },
    headerCell16: {
        width: 40, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell: {
        width: 140, height: 'auto', backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingLeft: 2,
    },
    cell1: {
        width: 140, height: 'auto', backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, paddingLeft: 3,
    },
    cell2: {
        width: 133, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell3: {
        width: 133, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderRightWidth: 1, padding: 5,
    },
    cell4: {
        width: 40, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 1, padding: 2,
    },
    cell5: {
        width: 120, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderLeftWidth: 1, padding: 5,
    },
    cell6: {
        width: 60, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 5,
    },
    cell7: {
        width: 55, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, padding: 5,
    },
    cell8: {
        width: 70, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderRightWidth: 1, padding: 5,
    },
    cell9: {
        width: 95, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, padding: 5,
    },
    cell10: {
        width: 100, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderRightWidth: 1, padding: 5,
    },
    cell11: {
        width: 35, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell12: {
        width: 150, backgroundColor: '#fff', textAlign: 'left', borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingLeft: 5,
    },
    cell13: {
        width: 35, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, padding: 2,
    },
    cell14: {
        width: 35, fontFamily: 'THSarabun_Bold', backgroundColor: '#ccc', textAlign: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, paddingTop: 10,
    },
    cell15: {
        width: 100, backgroundColor: '#fff', textAlign: 'center', borderBottomWidth: 1, borderRightWidth: 1, padding: 5,
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

function MyDocument3({ showData, selectedInstructorNames, fromQualityAssurance, formDataOBE3, courseTimeData, CloFromData, selectedTable, ELOs, valueCompareClowElo, attribute, ValueCompareCLOwAttribute, experience, measuring, Plans, assessments, Treatises }) {

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

                <Text style={styles.body}>
                    รายชื่อวิชา 0{showData.course_Code || 'N/A'} {showData.course_Name || 'N/A'} {showData.course_NameEng || 'N/A'}
                </Text>

                <Text style={styles.body1}>
                    ชื่อสถาบันอุดมศึกษา <Text style={styles.font}> {showData.college || 'N/A'} </Text>
                </Text>

                <Text style={styles.body1}>
                    วิทยาเขต <Text style={styles.font}> {showData.campus || 'N/A'} </Text>
                    คณะ <Text style={styles.font}> {showData.faculty || 'N/A'} </Text>
                    ภาควิชา <Text style={styles.font}> {showData.department_Name || 'N/A'} </Text>
                </Text>

                <Text style={styles.mode}> หมวดที่ 1 ข้อมูลทั่วไป </Text>

                <Text style={styles.topic1}> 1. รหัสและชื่อรายวิชา </Text>
                <Text style={styles.description}> 0{showData.course_Code || 'N/A'} {showData.course_Name || 'N/A'} {showData.course_NameEng || 'N/A'} </Text>

                <Text style={styles.topic}> 2. จำนวนหน่วยกิต </Text>
                <Text style={styles.description}> {showData.course_Credit || 'N/A'} </Text>

                <Text style={styles.topic}> 3. หลักสูตรและประเภทของรายวิชา </Text>
                <Text style={styles.description}>
                    หลักสูตร <Text style={styles.font}> {showData.curriculum_Name || 'N/A'} </Text> บัณฑิต
                    สาขาวิชา <Text style={styles.font}> {showData.branch || 'N/A'} </Text>
                </Text>
                <Text style={styles.description}>
                    เป็นรายวิชา {showData.course_Category || 'N/A'}
                </Text>

                <Text style={styles.topic}> 4. อาจารย์ผู้รับผิดชอบรายวิชาและอาจารย์ผู้สอน </Text>
                <View style={styles.description2}>
                    <Text style={styles.font}> อาจารย์ผู้รับผิดชอบรายวิชา </Text>
                    <Text style={{ marginLeft: 30 }}> {showData.responsible_Teacher} </Text>
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
                    ภาคการศึกษา <Text style={styles.font}> {showData.semster_term || 'N/A'} </Text>
                    ของชั้นปีที่ <Text style={styles.font}> {showData.year_of_study || 'N/A'} </Text>
                </Text>

                <Text style={styles.topic}> 6. รายวิชาบังคับก่อน (Pre-requisite) (ถ้ามี) </Text>
                <Text style={styles.description}> {showData.prerequisites || 'N/A'} </Text>

                <Text style={styles.topic}> 7. รายวิชาที่ต้องเรียนพร้อมกัน (Co-requisites) (ถ้ามี) </Text>
                <Text style={styles.description}> {showData.corequisites || 'N/A'} </Text>

                <Text style={styles.topic}> 8. สถานที่เรียน </Text>
                <Text style={styles.description}> คณะ/วิทยาลัย {showData.study_Area || 'N/A'} มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ </Text>

                <Text style={styles.topic}> 9. ข้อมูลประกอบการประกันคุณภาพการศึกษา </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="การเรียนการสอนในรายวิชานี้มีส่วนที่ได้รับการพัฒนาขึ้นใหม่หรือปรับปรุงจากที่สอนเมื่อครั้งก่อน"
                        check={fromQualityAssurance.compare_teach_bl || false}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการให้ผู้มีประสบการณ์ทางวิชาการหรือวิชาชีพจากหน่วยงานภายนอกเข้ามามีส่วนร่วมในกระบวนการเรียนการสอน"
                        check={fromQualityAssurance.outsider_teach_bl || false}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการบูรณาการกระบวนการวิจัยกับการจัดการเรียนการสอน หรือการจัดการเรียนรู้ที่พัฒนาจากการวิจัย"
                        check={fromQualityAssurance.research_bl || false}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการบูรณาการงานบริการทางวิชาการแก่สังคมกับการเรียนการสอน"
                        check={fromQualityAssurance.society_bl || false}
                    />
                    <Checkbox
                        label="รายวิชานี้มีการบูรณาการงานด้านทำนุบำรุงศิลปะและวัฒนธรรมกับการจัดการเรียนการสอนและกิจกรรมนักศึกษา"
                        check={fromQualityAssurance.culture_bl || false}
                    />
                </View>

                <Text style={styles.topic}> 10. วันที่จัดทำหรือปรับปรุงรายละเอียดของรายวิชาครั้งล่าสุด </Text>
                <Text style={styles.description3}> {formDataOBE3.obe_latestC || 'N/A'} </Text>
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

                <Text style={styles.mode}> หมวดที่ 2 ลักษณะและการดำเนินการ </Text>

                <Text style={styles.topic1}> 1. คำอธิบายรายวิชา </Text>
                <Text style={styles.description}>{showData.course_Description || 'N/A'}</Text>
                <Text style={styles.description}>{showData.course_DescriptionEng || 'N/A'}</Text>

                <Text style={styles.topic}> 2. จำนวนชั่วโมงที่ใช้ต่อสัปดาห์ </Text>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}> ทฤษฎี (ชั่วโมง) </Text>
                        <Text style={styles.headerCell1}> ฝึกปฏิบัติ (ชั่วโมง) </Text>
                        <Text style={styles.headerCell2}> การศึกษาด้วยตนเอง (ชั่วโมง) </Text>
                    </View>
                    <View style={styles.headerRow}>
                        <Text style={styles.cell}> {formDataOBE3.obe_Sumtime_Theory || 'N/A'} </Text>
                        <Text style={styles.cell1}> {formDataOBE3.obe_Sumtime_Practice || 'N/A'} </Text>
                        <Text style={styles.cell1}> {formDataOBE3.obe_Sumtime_Selfeducation || 'N/A'} </Text>
                    </View>
                </View>
                <View style={styles.topic2}>
                    <Text> ลักษณะรายวิชา </Text>
                    <View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                label="บรรยาย"
                                check={fromQualityAssurance.obe_description_bl || false}
                            />
                            <Checkbox
                                label="ปฏิบัติการ"
                                check={fromQualityAssurance.obe_practice_bl || false}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.topic2}>
                    <Text> การวัดและประเมินผล </Text>
                    <View>
                        <View style={styles.checkboxContainer1}>
                            <Checkbox
                                label="A-F"
                                check={fromQualityAssurance.obe_A_F_bl || false}
                            />
                            <Checkbox
                                label="S/U"
                                check={fromQualityAssurance.obe_S_U_bl || false}
                            />
                            <Checkbox
                                label="P"
                                check={fromQualityAssurance.obe_P_bl || false}
                            />
                        </View>
                    </View>
                </View>

                <Text style={styles.topic}> 3. จำนวนชั่วโมงต่อสัปดาห์ที่จะให้คำปรึกษาและแนะนำทางวิชาการแก่นักศึกษา </Text>
                {courseTimeData.map((ctd, index) => (
                    <Text key={index + 1} style={styles.description}> {ctd.conselling_Name || 'N/A'} </Text>
                ))}

                <Text style={styles.topic}> 4. ผลลัพธ์การเรียนรู้ของรายวิชา (Course Learning Outcomes: CLOs) : นักศึกษาสามารถ </Text>
                {CloFromData.map((clos, CLOindex) => (
                    <Text key={CLOindex} style={styles.description}> {clos.clo_code || 'N/A'} {clos.clo_Name || 'N/A'} </Text>
                ))}

                <Text style={styles.topic}> 5. ความสอดคล้องของผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (Expected Learning Outcomes: ELOs) และผลลัพธ์ การเรียนรู้ของรายวิชา (Course Learning Outcomes: CLOs) </Text>
                <View>
                    {selectedTable === 'Table5_1' && (
                        <>
                            <Text style={styles.topic}> ตารางที่ 5.1 ความสอดคล้องของ ELOs และ CLOs </Text>
                            <View style={styles.table1}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCell15}> ELOs/CLOs </Text>
                                    {CloFromData.map((clos, CLOindex) => (
                                        <Text key={CLOindex} style={styles.cell11}> {clos.clo_code || 'N/A'} </Text>
                                    ))}
                                </View>
                                {ELOs.map((elo, ELOindex) => (
                                    <View key={ELOindex} style={styles.headerRow}>
                                        <Text style={styles.cell12}>{elo.elo_code || 'N/A'} {elo.elo_Name || 'N/A'} </Text>
                                        {CloFromData.map((clo, CLOindex) => (
                                            <Text key={CLOindex} style={styles.cell13}>
                                                {valueCompareClowElo[ELOindex][CLOindex] ? <Image src={tickIcon} style={styles.icon} /> : ''}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                    {selectedTable === 'Table5_2' && (
                        <>
                            <Text style={styles.topic}> ตารางที่ 5.2 ความสอดคล้องของคุณลักษณะพื้นฐานร่วมกันของบัณฑิตที่พึงประสงค์ มจพ.และCLOs </Text>
                            <View style={styles.table1}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCell15}> คุณลักษณะพื้นฐานร่วมกันของบัณฑิต ที่พึงประสงค์ มจพ./CLOs </Text>
                                    {CloFromData.map((clos, CLOindex) => (
                                        <Text key={CLOindex} style={styles.cell14}> {clos.clo_code || 'N/A'} </Text>
                                    ))}
                                </View>
                                {attribute.map((attr, Atrindex) => (
                                    <View key={Atrindex} style={styles.headerRow}>
                                        <Text style={styles.cell12}> {attr.clo_basic_Name || 'N/A'} </Text>
                                        {CloFromData.map((clo, CLOindex) => (
                                            <Text key={CLOindex} style={styles.cell13}>
                                                {ValueCompareCLOwAttribute[Atrindex][CLOindex] ? <Image src={tickIcon} style={styles.icon} /> : ''}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </>
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

                <Text style={styles.mode}> หมวดที่ 3 การพัฒนานักศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง </Text>

                <Text style={styles.topic1}>วิธีการจัดประสบการณ์การเรียนรู้เพื่อพัฒนาความรู้หรือทักษะและการวัดผลลัพธ์การเรียนรู้ของรายวิชาที่สอดคล้องกับผลลัพธ์ การเรียนรู้ ที่คาดหวังของ รายวิชา (CLOs) ในหมวดที่ 2 ข้อ 4 </Text>
                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell3}> ผลลัพธ์การเรียนรู้ที่คาดหวัง ของรายวิชา CLOs </Text>
                        <Text style={styles.headerCell4}> วิธีการจัดการสอน/ ประสบการณ์การเรียนรู้ตาม CLOs </Text>
                        <Text style={styles.headerCell5}> วิธีการวัดผลลัพธ์การเรียนรู้ตาม CLOs </Text>
                    </View>
                    {CloFromData.map((clos, CLOindex) => (
                        <View style={styles.headerRow}>
                            <Text key={CLOindex} style={styles.cell2}> {clos.clo_code || 'N/A'} </Text>
                            <Text style={styles.cell3}>{experience[CLOindex]?.experience_Name || 'N/A'}</Text>
                            <Text style={styles.cell3}>{measuring[CLOindex]?.measuring_Name || 'N/A'}</Text>
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

                <Text style={styles.mode}> หมวดที่ 4 แผนการสอนและการประเมินผล </Text>

                <Text style={styles.topic1}> 1. แผนการสอน </Text>
                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell6}> สัปดาห์ที่ </Text>
                        <Text style={styles.headerCell7}> หัวข้อ/ รายละเอียด </Text>
                        <Text style={styles.headerCell8}> CLOs </Text>
                        <Text style={styles.headerCell9}> จำนวนชั่วโมง บรรยาย </Text>
                        <Text style={styles.headerCell9}> จำนวนชั่วโมง ปฎิบัติการ </Text>
                        <Text style={styles.headerCell10}> กิจกรรม การเรียนการสอน </Text>
                    </View>
                    {Plans.slice(0, 12).map((plan, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell4}>{index + 1}</Text>
                            <Text style={styles.cell5}>{plan.plan_Name}</Text>
                            <Text style={styles.cell6}>{plan.plan_Clo}</Text>
                            <Text style={styles.cell7}>{plan.lecture_Hours}</Text>
                            <Text style={styles.cell7}>{plan.pratice_Hours}</Text>
                            <Text style={styles.cell8}>{plan.plan_description}</Text>
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

                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell6}> สัปดาห์ที่ </Text>
                        <Text style={styles.headerCell7}> หัวข้อ/ รายละเอียด </Text>
                        <Text style={styles.headerCell8}> CLOs </Text>
                        <Text style={styles.headerCell9}> จำนวนชั่วโมง บรรยาย </Text>
                        <Text style={styles.headerCell9}> จำนวนชั่วโมง ปฎิบัติการ </Text>
                        <Text style={styles.headerCell10}> กิจกรรม การเรียนการสอน </Text>
                    </View>
                    {Plans.slice(12).map((plan, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell4}>{index + 13}</Text>
                            <Text style={styles.cell5}> {plan.plan_Name} </Text>
                            <Text style={styles.cell6}> {plan.plan_Clo} </Text>
                            <Text style={styles.cell7}> {plan.lecture_Hours} </Text>
                            <Text style={styles.cell7}> {plan.pratice_Hours} </Text>
                            <Text style={styles.cell8}> {plan.plan_description} </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.topic}> 2. แผนการประเมินตามผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชา </Text>
                <View style={styles.table1}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell11}> ผลลัพธ์การเรียนรู้ ที่คาดหวังของรายวิชา </Text>
                        <Text style={styles.headerCell12}> กิจกรรมการประเมิน ผลการเรียนรู้ของผู้เรียน </Text>
                        <Text style={styles.headerCell13}> กำหนดการประเมิน (สัปดาห์ที่) </Text>
                        <Text style={styles.headerCell14}> สัดส่วนของการประเมินผล </Text>
                    </View>
                    {assessments.map((assessment, index) => (
                        <View style={styles.headerRow} key={index}>
                            <Text style={styles.cell9}>{assessments[index]?.assessment_outCome || 'N/A'}</Text>
                            <Text style={styles.cell10}>{assessments[index]?.activity_Learning || 'N/A'}</Text>
                            <Text style={styles.cell15}>{assessments[index]?.assessment_Deadline || 'N/A'}</Text>
                            <Text style={styles.cell15}>{assessments[index]?.assessment_Proportion || 'N/A'}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.mode}> หมวดที่ 5 ทรัพยากรประกอบการเรียนการสอน </Text>

                <Text style={styles.topic1}> ตำราและเอกสารที่ใช้ประกอบการเรียนการสอน </Text>
                {Treatises.map((treatise, index) => (
                    <Text key={index + 1} style={styles.description}> {treatise.textbook_Name || 'N/A'} </Text>
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

                <Text style={styles.mode}> หมวดที่ 6 การประเมินและปรับปรุงการดำเนินการของรายวิชา </Text>

                <Text style={styles.topic1}> 1. กลยุทธ์การประเมินประสิทธิผลของรายวิชาโดยนักศึกษา </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="แบบประเมินรายวิชา"
                        check={formDataOBE3.assess_course_bl}
                    />
                    <Checkbox
                        label="การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน"
                        check={formDataOBE3.discuss_bl}
                    />
                    <Checkbox
                        label="การสะท้อนคิด จากพฤติกรรมของผู้เรียน"
                        check={formDataOBE3.reflection_bl}
                    />
                    <Checkbox
                        label="ข้อเสนอแนะผ่านช่องทางออนไลน์ ที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา"
                        check={formDataOBE3.suggestion_bl}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formDataOBE3.other6_1_bl}
                        style={styles.checkbox}
                    />
                    {formDataOBE3.other6_1_bl && (
                        <Text style={{ color: 'black' }}> {formDataOBE3.other6_1_description} </Text>
                    )}
                </View>

                <Text style={styles.topic}> 2. กลยุทธ์การประเมินการจัดการเรียนรู้ </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="แบบประเมินผู้สอน"
                        check={formDataOBE3.teacher_Evalu_bl}
                    />
                    <Checkbox
                        label="ผลการสอบ"
                        check={formDataOBE3.exam_result_bl}
                    />
                    <Checkbox
                        label="การทวนสอบผลประเมินผลลัพธ์การเรียนรู้"
                        check={formDataOBE3.verification_bl}
                    />
                    <Checkbox
                        label="การประเมินโดยคณะกรรมการประเมินข้อสอบ"
                        check={formDataOBE3.ex_Evalu_comit_bl}
                    />
                    <Checkbox
                        label="การสังเกตการณ์สอนของผู้ร่วมทีมการสอน"
                        check={formDataOBE3.observation_bl}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formDataOBE3.other6_2_bl}
                        style={styles.checkbox}
                    />
                    {formDataOBE3.other6_2_bl && (
                        <Text style={{ color: 'black' }}> {formDataOBE3.other6_2_description} </Text>
                    )}
                </View>

                <Text style={styles.topic}> 3. กลไกการปรับปรุงการจัดการเรียนรู้ </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="สัมมนาการจัดการเรียนการสอน"
                        check={formDataOBE3.teach_Seminar_bl}
                    />
                    <Checkbox
                        label="การวิจัยในและนอกชั้นเรียน"
                        check={formDataOBE3.researchInOut_bl}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formDataOBE3.other6_3_bl}
                        style={styles.checkbox}
                    />
                    {formDataOBE3.other6_3_bl && (
                        <Text style={{ color: 'black' }}> {formDataOBE3.other6_3_description} </Text>
                    )}
                </View>

                <Text style={styles.topic}> 4. กระบวนการทวนสอบผลลัพธ์การเรียนรู้ของรายวิชาของนักศึกษา </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินผลลัพธ์การเรียนรู้ของนักศึกษา วิธีการให้คะแนนสอบ และการให้คะแนนพฤติกรรม"
                        check={formDataOBE3.commit_course_bl}
                    />
                    <Checkbox
                        label="การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ"
                        check={formDataOBE3.check_depart_bl}
                    />
                    <Checkbox
                        label="การทวนสอบการให้คะแนนจากการสุ่มตรวจผลงานของนักศึกษาโดยอาจารย์ หรือผู้ทรงคุณวุฒิอื่นๆ ที่ไม่ใช่อาจารย์ประจำหลักสูตร"
                        check={formDataOBE3.check_teacher_bl}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formDataOBE3.other6_4_bl}
                        style={styles.checkbox}
                    />
                    {formDataOBE3.other6_4_bl && (
                        <Text style={{ color: 'black' }}> {formDataOBE3.other6_4_description} </Text>
                    )}
                </View>

                <Text style={styles.topic}> 5. การดำเนินการทบทวนและการวางแผนปรับปรุงประสิทธิผลของรายวิชา </Text>
                <View style={styles.description1}>
                    <Checkbox
                        label="ปรับปรุงรายวิชาในแต่ละปี ตามข้อเสนอแนะและผลการทวนสอบตามข้อ 4"
                        check={formDataOBE3.improve_offer_bl}
                    />
                    <Checkbox
                        label="ปรับปรุงรายวิชาในแต่ละปี ตามผลการประเมินผู้สอนโดยนักศึกษา"
                        check={formDataOBE3.improve_By_stu_bl}
                    />
                </View>
                <View style={styles.description4}>
                    <Checkbox
                        label="อื่นๆ(ระบุ)"
                        check={formDataOBE3.other6_5_bl}
                        style={styles.checkbox}
                    />
                    {formDataOBE3.other6_5_bl && (
                        <Text style={{ color: 'black' }}> {formDataOBE3.other6_5_description} </Text>
                    )}
                </View>
            </Page>

        </Document >
    );
}

export default MyDocument3;