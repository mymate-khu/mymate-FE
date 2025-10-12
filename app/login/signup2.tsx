
import { Text, TextInput, View, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Image } from "react-native"
import { router } from "expo-router"
import { useState } from "react";
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import {TokenReq} from "@/components/apis/axiosInstance"

import CalendarIcon from '@/assets/image/Calendar.png';
import Profileimg from "@/assets/image/signupcheckimg/profileuploadimg.png"

type User = {
  userId: String,
  passwordEncrypted: String,
  email: String,
  name: String,
  phone: String,
  agreeService: true,
  agreePrivacy: true,
  agreeAgeOver14: true,
  agreeThirdParty: true,
  agreeMarketing: true,
  token: String
}


export default function Signup2() {

    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    const [calendaron, setcalendaron] = useState(false)


    const { width, height } = useWindowDimensions();

    const [selected, setselected] = useState(true)

    const [curdate, setcurdate] = useState(todayISO)

    const [authorization,setauthorization] = useState(false)

    const [passwordmsg,setpasswordmsg] = useState(false)

    const [formname , setformname] = useState("")
    const [formgender , setformgender] = useState("")
    const [formphonenumber , setformphonenumber] = useState("")


    const handlephonenumber = (e : any)=>{
        setformphonenumber(e.target.value)
        console.log(formphonenumber)
    }

    const sendphonenumber = async()=>{
        try{
            const res =  await TokenReq.post("/api/auth/phone/request-code",{
            phone : formphonenumber
        })
        console.log(res.data)
        }
        catch{
            console.error("에러")
        }
    }



    return <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={{ fontSize: 16, fontWeight: 500, }}>회원가입</Text>
            <Text style={styles.arrow} onPress={() => { router.back() }}>{"<"}</Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", height: 200 }}>
            <TouchableOpacity>
                <Image source={Profileimg}></Image>
            </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: width * 0.07 }}>
            <View style={styles.bar1}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 600, left: 12 }}>이름</Text>
            </View>
            <TextInput placeholder="이름" placeholderTextColor={"#797979"} style={styles.bar2}></TextInput>

            <View style={[{ marginTop: 20 }, styles.bar1]}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 600, left: 12 }}>성별</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 20, height: 50, justifyContent: "center" }}>
                <TouchableOpacity
                    onPress={() => { setselected(true) }}
                    style={[styles.btn1, { backgroundColor: selected ? "rgba(255, 230, 0, 1)" : "rgba(153, 153, 153, 0.1)" }]}><Text>여</Text></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setselected(false) }}
                    style={[styles.btn1, { backgroundColor: !selected ? "rgba(255, 230, 0, 1)" : "rgba(153, 153, 153, 0.1)", marginLeft: "3%" }]}>
                        <Text>남</Text>
                    </TouchableOpacity>
            </View>

            <View style={[{ marginTop: 20 }, styles.bar1]}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 600, left: 12 }}>생년월일</Text>
            </View>
            <View
                style={[styles.bar2, { marginTop: 10 }]}>
                {curdate}
                <TouchableOpacity style={styles.calendaricon} onPress={() => { setcalendaron(!calendaron) }}>
                    <Image source={CalendarIcon} ></Image>
                </TouchableOpacity>
            </View>

            {/*캘린더 컴포넌트*/}
            {calendaron && <View>
                <View
                    style={{ marginHorizontal: width * 0.07, marginTop: 20 }}
                >
                    <Calendar
                        current={curdate}
                        markedDates={{
                            [curdate]: { selected: true, selectedColor: 'black' }, // 원 + selectedDotColor 로 점 보이게
                        }}
                        onDayPress={(day) => {
                            setcurdate(day.dateString)
                        }}
                    ></Calendar>
                </View>


            </View>}


            <View style={[{ marginTop: 20 }, styles.bar1]}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 600, left: 12 }}>전화번호</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <TextInput value={formphonenumber } onChange={handlephonenumber} style={styles.bar2_short} placeholder="전화번호" placeholderTextColor={"#797979"}></TextInput>
                <TouchableOpacity onPress={() => {sendphonenumber()}} style={styles.bar2_short_btn}>발송</TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row" }}>
                <TextInput style={styles.bar2_short} placeholder="인증번호" placeholderTextColor={"#797979"}></TextInput>
                <TouchableOpacity onPress={() => { }} style={styles.bar2_short_btn}>확인</TouchableOpacity>
            </View>
            {/*인증 메세지*/}
            {authorization && <View style={{height:20}}><Text style={{fontSize:12,color:"red"}}>남은 인증시간</Text></View>}

            <View style={[styles.bar1, { marginTop: 20 }]}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 600, left: 12 }}>아이디</Text>
            </View>
            <TextInput placeholder="아이디" placeholderTextColor={"#797979"} style={styles.bar2}></TextInput>

            <View style={[styles.bar1, { marginTop: 20 }]}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 600, left: 12 }}>비밀번호</Text>
            </View>
            <TextInput placeholder="비밀번호" placeholderTextColor={"#797979"} style={styles.bar2}></TextInput>
            <TextInput placeholder="비밀번호 확인" placeholderTextColor={"#797979"} style={styles.bar2}></TextInput>
            {/*인증 메세지*/}
            {passwordmsg && <View style={{height:20}}><Text style={{fontSize:12,color:"red"}}>비밀번호가 일치하지 않습니다</Text></View>}

            <TouchableOpacity style={styles.btn2} onPress={()=>{router.push("/login/addmate")}}>회원가입</TouchableOpacity>
        </View>
        <View style={{height:50}}></View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 50
    },
    arrow: {
        position: "absolute",
        fontSize: 20,
        fontFamily: "PretendardSemiBold",
        left: 10
    },
    bar1: {
        height: 20,
        justifyContent: "center",
    },
    bar2: {
        height: 50,
        justifyContent: "center",
        backgroundColor: "rgba(153, 153, 153, 0.1)",
        borderRadius: 10,
        padding: 12,
        marginTop: 10

    },
    btn1: {
        width: "40%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    calendaricon: {
        position: "absolute",
        right: 10

    },
    bar2_short: {
        height: 50,
        justifyContent: "center",
        backgroundColor: "rgba(153, 153, 153, 0.1)",
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        width: "80%"
    },
    bar2_short_btn: {
        height: 50,
        justifyContent: "center",
        backgroundColor: "rgba(255, 230, 0, 1)",
        borderRadius: 10,
        marginTop: 10,
        marginLeft: "5%",
        alignItems: "center",
        width: "15%",
        fontWeight: 500
    },
    btn2: {
        height: 50,
        backgroundColor: "rgba(255, 230, 0, 1)",
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    }
})