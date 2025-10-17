// app/home/home_header/Signup2.tsx
import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
  Alert
} from "react-native";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { TokenReq } from "@/components/apis/axiosInstance";

import CalendarIcon from "@/assets/image/Calendar.png";
import Profileimg from "@/assets/image/signupcheckimg/profileuploadimg.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  userId: string;
  passwordEncrypted: string;
  email: string;
  name: string;
  phone: string;
  agreeService: boolean;
  agreePrivacy: boolean;
  agreeAgeOver14: boolean;
  agreeThirdParty: boolean;
  agreeMarketing: boolean;
  token: string | null;
};

export default function Signup2() {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const [calendaron, setcalendaron] = useState(false);
  const { width } = useWindowDimensions();

  const [selected, setselected] = useState(true); // true=여, false=남
  const [curdate, setcurdate] = useState(todayISO);

  const [authorization, setauthorization] = useState(true);
  const [passwordmsg, setpasswordmsg] = useState(false);

  const [formname, setformname] = useState("");
  const [formgender, setformgender] = useState<"여" | "남" | "">("");
  const [formphonenumber, setformphonenumber] = useState("");
  const [formauthorizenumber, setformauthorizenumber] = useState("");
  const [authorizecomplete, setauthorizecomplete] = useState(false);
  const [formid, setformid] = useState("");
  const [formpassword, setformpassword] = useState("");
  const [formpassword2, setformpassword2] = useState("");
  const [phoneAuthToken, setPhoneAuthToken] = useState<string | null>(null);

  const sendphonenumber = async () => {
  try {
    setauthorization(false);
    const res = await TokenReq.post("/api/auth/phone/request-code", {
      phone: formphonenumber,
    });
    console.log('[sendphonenumber] res',res.data);
    setformauthorizenumber(String(res.data?.data ?? ""));
    Alert.alert('인증번호 전송', '문자로 인증번호를 보냈습니다.');
  } catch (e: any) {
    console.log('[sendphonenumber] error', e?.message, e?.response?.status, e?.response?.data);
    Alert.alert('전송 실패', String(e?.response?.data?.message ?? e?.message ?? '요청 실패'));
    setauthorization(true);
  }
};


  const sendauthorizenumber = async () => {
    try {
      const res = await TokenReq.post("/api/auth/phone/verify-code", {
        phone: formphonenumber,
        code: formauthorizenumber,
      });
      console.log(res)
      setPhoneAuthToken(res.data.code)
      setauthorization(true);
      setauthorizecomplete(true);
    } catch {
      Alert.alert("요청 실패");
    }
  };

  const signup = async () => {
  try {
    // 비밀번호 확인
    if (formpassword !== formpassword2) {
      setpasswordmsg(true);
      return;
    }
    setpasswordmsg(false);

    if (!phoneAuthToken) {
      Alert.alert("안내", "휴대폰 인증을 먼저 완료해주세요.");
      return;
    }

    router.replace({
      pathname: "/home/home_mate_overview/MateManage/MateAddScreen",
      params: { token:"wdwdwddw" },
    });

    const payload: User = {
      userId: formid,
      passwordEncrypted: formpassword,
      email: "user123@naver.com",
      name: formname,
      phone: formphonenumber,
      agreeService: true,
      agreePrivacy: true,
      agreeAgeOver14: true,
      agreeThirdParty: false,
      agreeMarketing: false,
      token: phoneAuthToken,
    };

    const res = await TokenReq.post("/api/auth/signup", payload)
      

    // 서버가 아래처럼 준다고 가정
    // { accessToken: "eyJhbGciOi...", refreshToken: "...", ... }
    const accessToken = res.data?.accessToken;
    const refreshToken = res.data?.refreshToken;
    console.log(accessToken)
    if (!accessToken) {
      console.warn("회원가입 성공 응답에 accessToken이 없습니다.");
      return;
    }

    // ✅ 로컬스토리지나 AsyncStorage에 저장
    await AsyncStorage.setItem("accessToken", accessToken);
    if (refreshToken) await AsyncStorage.setItem("refreshToken", refreshToken);
    // ✅ 페이지 이동 시 파라미터로도 넘길 수 있음
    router.replace({
      pathname: "/home/home_mate_overview/MateManage/MateAddScreen",
      params: { token:"wdwdwddw" },
    });

  } catch (e: any) {
    console.error("회원가입 실패:", e?.response?.data ?? e.message);
    Alert.alert("회원가입 실패", String(e?.response?.data?.message ?? "서버 오류"));
  }
};


  // 성별 토글 시 formgender도 동기화
  const selectGender = (isFemale: boolean) => {
    setselected(isFemale);
    setformgender(isFemale ? "여" : "남");
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>회원가입</Text>
        <Text style={styles.arrow} onPress={() => router.back()}>
          {"<"}
        </Text>
      </View>

      {/* 프로필 이미지 업로드 */}
      <View style={{ alignItems: "center", justifyContent: "center", height: 200 }}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={Profileimg} style={{ width: 100, height: 100, borderRadius: 50 }} />
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: width * 0.07 }}>
        {/* 이름 */}
        <View style={styles.bar1}>
          <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: "600", left: 12 }}>이름</Text>
        </View>
        <TextInput
          placeholder="이름"
          placeholderTextColor="#797979"
          style={styles.bar2}
          value={formname}
          onChangeText={setformname}
        />

        {/* 성별 */}
        <View style={[{ marginTop: 20 }, styles.bar1]}>
          <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: "600", left: 12 }}>성별</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, height: 50, justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => selectGender(true)}
            style={[
              styles.btn1,
              { backgroundColor: selected ? "rgba(255, 230, 0, 1)" : "rgba(153, 153, 153, 0.1)" },
            ]}
            activeOpacity={0.8}
          >
            <Text>여</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectGender(false)}
            style={[
              styles.btn1,
              {
                backgroundColor: !selected ? "rgba(255, 230, 0, 1)" : "rgba(153, 153, 153, 0.1)",
                marginLeft: "3%",
              },
            ]}
            activeOpacity={0.8}
          >
            <Text>남</Text>
          </TouchableOpacity>
        </View>

        {/* 생년월일 */}
        <View style={[{ marginTop: 20 }, styles.bar1]}>
          <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: "600", left: 12 }}>생년월일</Text>
        </View>
        <View style={[styles.bar2, { marginTop: 10 }]}>
          <Text>{curdate}</Text>
          <TouchableOpacity
            style={styles.calendaricon}
            onPress={() => setcalendaron(!calendaron)}
            activeOpacity={0.8}
          >
            <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>

        {/* 캘린더 컴포넌트 */}
        {calendaron && (
          <View style={{ marginHorizontal: width * 0.07, marginTop: 20 }}>
            <Calendar
              current={curdate}
              markedDates={{
                [curdate]: { selected: true, selectedColor: "black" },
              }}
              onDayPress={(day) => setcurdate(day.dateString)}
            />
          </View>
        )}

        {/* 전화번호 */}
        <View style={[{ marginTop: 20 }, styles.bar1]}>
          <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: "600", left: 12 }}>전화번호</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            value={formphonenumber}
            onChangeText={setformphonenumber}
            style={styles.bar2_short}
            placeholder="전화번호"
            placeholderTextColor="#797979"
            keyboardType="phone-pad"
          />
          <TouchableOpacity onPress={sendphonenumber} style={styles.bar2_short_btn} activeOpacity={0.8}>
            <Text>발송</Text>
          </TouchableOpacity>
        </View>

        {/* 인증번호 */}
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.bar2_short}
            placeholder="인증번호"
            placeholderTextColor="#797979"
            value={String(formauthorizenumber ?? "")}
            onChangeText={setformauthorizenumber}
            editable={!authorizecomplete}
            keyboardType="number-pad"
          />
          {authorization && authorizecomplete ? (
            <TouchableOpacity disabled style={styles.bar2_short_btn2} onPress={sendauthorizenumber}>
              <Text>완료</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={sendauthorizenumber} style={styles.bar2_short_btn} activeOpacity={0.8}>
              <Text>확인</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 인증 메시지 */}
        {!authorization && (
          <View style={{ height: 20 }}>
            <Text style={{ fontSize: 12, color: "red" }}>남은 인증시간</Text>
          </View>
        )}

        {/* 아이디 */}
        <View style={[styles.bar1, { marginTop: 20 }]}>
          <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: "600", left: 12 }}>아이디</Text>
        </View>
        <TextInput
          placeholder="아이디"
          placeholderTextColor="#797979"
          style={styles.bar2}
          value={formid}
          onChangeText={setformid}
          autoCapitalize="none"
        />

        {/* 비밀번호 */}
        <View style={[styles.bar1, { marginTop: 20 }]}>
          <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: "600", left: 12 }}>비밀번호</Text>
        </View>
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor="#797979"
          style={styles.bar2}
          value={formpassword}
          onChangeText={setformpassword}
          secureTextEntry
        />
        <TextInput
          placeholder="비밀번호 확인"
          placeholderTextColor="#797979"
          style={styles.bar2}
          value={formpassword2}
          onChangeText={setformpassword2}
          secureTextEntry
        />
        {/* 비번 불일치 메시지 */}
        {passwordmsg && (
          <View style={{ height: 20 }}>
            <Text style={{ fontSize: 12, color: "red" }}>비밀번호가 일치하지 않습니다</Text>
          </View>
        )}

        {/* 회원가입 */}
        <TouchableOpacity style={styles.btn2} onPress={signup} activeOpacity={0.85}>
          <Text>회원가입</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  arrow: {
    position: "absolute",
    fontSize: 20,
    fontFamily: "PretendardSemiBold",
    left: 10,
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
    marginTop: 10,
  },
  btn1: {
    width: "40%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  calendaricon: {
    position: "absolute",
    right: 10,
  },
  bar2_short: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "rgba(153, 153, 153, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    width: "80%",
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
  },
  bar2_short_btn2: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "grey",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: "5%",
    alignItems: "center",
    width: "15%",
  },
  btn2: {
    height: 50,
    backgroundColor: "rgba(255, 230, 0, 1)",
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
