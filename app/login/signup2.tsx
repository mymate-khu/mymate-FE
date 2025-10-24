import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import { TokenReq } from "@/components/apis/axiosInstance";

import CalendarIcon from "@/assets/image/Calendar.png";
import Profileimg from "@/assets/image/signupcheckimg/profileuploadimg.png";

export default function Signup2() {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const [calendaron, setcalendaron] = useState(false);
  const { width } = useWindowDimensions();

  const [selected, setselected] = useState(true); // 여=true, 남=false
  const [curdate, setcurdate] = useState(todayISO);

  const [authorization, setauthorization] = useState(true);
  const [passwordmsg, setpasswordmsg] = useState(false);

  // ✅ 입력값 state
  const [formname, setformname] = useState("");
  const [formgender, setformgender] = useState<"F" | "M" | "">("");
  const [formphonenumber, setformphonenumber] = useState("");
  const [formauthorizenumber, setformauthorizenumber] = useState("");
  const [authorizecomplete, setauthorizecomplete] = useState(false);
  const [formid, setformid] = useState("");
  const [formpassword, setformpassword] = useState("");
  const [formpassword2, setformpassword2] = useState("");

  // ✅ React Native에선 onChangeText 사용!
  const handlename = (text: string) => setformname(text);
  const handleid = (text: string) => setformid(text);
  const handlepassword = (text: string) => setformpassword(text);
  const handlepassword2 = (text: string) => setformpassword2(text);
  const handlephonenumber = (text: string) => setformphonenumber(text);
  const handleauthorizenumber = (text: string) => setformauthorizenumber(text);

  const sendphonenumber = async () => {
    try {
      setauthorization(false);
      const res = await TokenReq.post("/api/auth/phone/request-code", {
        phone: formphonenumber,
      });
      // 서버가 code를 돌려주는지 형태 확인 필요
      setformauthorizenumber(res?.data?.data ?? "");
    } catch (e) {
      console.error("request-code 에러", e);
      Alert.alert("오류", "인증번호 발송에 실패했습니다.");
    }
  };

  const sendauthorizenumber = async () => {
    try {
      const res = await TokenReq.post("/api/auth/phone/verify-code", {
        phone: formphonenumber,
        code: formauthorizenumber,
      });
      console.log(res.data);
      setauthorization(true);
      setauthorizecomplete(true);
    } catch (e) {
      console.error("verify-code 에러", e);
      Alert.alert("오류", "인증번호 확인에 실패했습니다.");
    }
  };

  const signup = async () => {
    if (formpassword !== formpassword2) {
      setpasswordmsg(true);
      Alert.alert("확인", "비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!authorizecomplete) {
      Alert.alert("확인", "휴대폰 인증을 완료해주세요.");
      return;
    }
    try {
      const payload = {
        userId: formid,
        passwordEncrypted: formpassword,
        email: "user123@naver.com", // TODO: 실제 입력값으로 바꾸고 싶으면 state 추가
        name: formname,             // ✅ 이제 바인딩됨!
        phone: formphonenumber,
        agreeService: true,
        agreePrivacy: true,
        agreeAgeOver14: true,
        agreeThirdParty: false,
        agreeMarketing: false,
        token: null,
      };

      console.log("[signup] payload:", payload); // ✅ 네트워크 탭과 대조

      const res = await TokenReq.post("/api/auth/signup", payload);
      console.log("[signup] response:", res.data);

      router.replace("/login/loginpage");
    } catch (e: any) {
      console.error("signup 에러", e?.response?.data || e?.message || e);
      // 409 Conflict 등 처리
      Alert.alert("회원가입 실패", e?.response?.data?.message || "다시 시도해주세요.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>회원가입</Text>
        <Text style={styles.arrow} onPress={() => router.back()}>
          {"<"}
        </Text>
      </View>

      <View style={{ alignItems: "center", justifyContent: "center", height: 200 }}>
        <TouchableOpacity>
          <Image source={Profileimg} />
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: width * 0.07 }}>
        {/* 이름 */}
        <View style={styles.bar1}>
          <Text style={{ fontWeight: "600", left: 12 }}>이름</Text>
        </View>
        <TextInput
          placeholder="이름"
          placeholderTextColor={"#797979"}
          style={styles.bar2}
          value={formname}
          onChangeText={handlename}   // ✅ 연결
        />

        {/* 성별 */}
        <View style={[{ marginTop: 20 }, styles.bar1]}>
          <Text style={{ fontWeight: "600", left: 12 }}>성별</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, height: 50, justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => {
              setselected(true);
              setformgender("F");
            }}
            style={[
              styles.btn1,
              { backgroundColor: selected ? "rgba(255, 230, 0, 1)" : "rgba(153, 153, 153, 0.1)" },
            ]}
          >
            <Text>여</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setselected(false);
              setformgender("M");
            }}
            style={[
              styles.btn1,
              { backgroundColor: !selected ? "rgba(255, 230, 0, 1)" : "rgba(153, 153, 153, 0.1)", marginLeft: "3%" },
            ]}
          >
            <Text>남</Text>
          </TouchableOpacity>
        </View>

        {/* 생년월일 */}
        <View style={[{ marginTop: 20 }, styles.bar1]}>
          <Text style={{ fontWeight: "600", left: 12 }}>생년월일</Text>
        </View>
        <View style={[styles.bar2, { marginTop: 10 }]}>
          <Text>{curdate}</Text>
          <TouchableOpacity style={styles.calendaricon} onPress={() => setcalendaron(!calendaron)}>
            <Image source={CalendarIcon} />
          </TouchableOpacity>
        </View>

        {calendaron && (
          <View style={{ marginHorizontal: width * 0.07, marginTop: 20 }}>
            <Calendar
              current={curdate}
              markedDates={{ [curdate]: { selected: true, selectedColor: "black" } }}
              onDayPress={(day) => setcurdate(day.dateString)}
            />
          </View>
        )}

        {/* 전화번호 */}
        <View style={[{ marginTop: 20 }, styles.bar1]}>
          <Text style={{ fontWeight: "600", left: 12 }}>전화번호</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            value={formphonenumber}
            onChangeText={handlephonenumber} // ✅ 연결
            style={styles.bar2_short}
            placeholder="전화번호"
            keyboardType="phone-pad"
            placeholderTextColor={"#797979"}
          />
          <TouchableOpacity onPress={sendphonenumber} style={styles.bar2_short_btn}>
            <Text>발송</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.bar2_short}
            placeholder="인증번호"
            placeholderTextColor={"#797979"}
            value={formauthorizenumber}
            onChangeText={handleauthorizenumber} // ✅ 연결
            keyboardType="number-pad"
          />
          {authorization && authorizecomplete ? (
            <TouchableOpacity disabled style={styles.bar2_short_btn2}>
              <Text>완료</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={sendauthorizenumber} style={styles.bar2_short_btn}>
              <Text>확인</Text>
            </TouchableOpacity>
          )}
        </View>
        {!authorization && (
          <View style={{ height: 20 }}>
            <Text style={{ fontSize: 12, color: "red" }}>남은 인증시간</Text>
          </View>
        )}

        {/* 아이디 */}
        <View style={[styles.bar1, { marginTop: 20 }]}>
          <Text style={{ fontWeight: "600", left: 12 }}>아이디</Text>
        </View>
        <TextInput
          placeholder="아이디"
          placeholderTextColor={"#797979"}
          style={styles.bar2}
          value={formid}
          onChangeText={handleid} // ✅ 연결
          autoCapitalize="none"
        />

        {/* 비밀번호 */}
        <View style={[styles.bar1, { marginTop: 20 }]}>
          <Text style={{ fontWeight: "600", left: 12 }}>비밀번호</Text>
        </View>
        <TextInput
          placeholder="비밀번호"
          placeholderTextColor={"#797979"}
          style={styles.bar2}
          value={formpassword}
          onChangeText={handlepassword} // ✅ 연결
          secureTextEntry
        />
        <TextInput
          placeholder="비밀번호 확인"
          placeholderTextColor={"#797979"}
          style={styles.bar2}
          value={formpassword2}
          onChangeText={handlepassword2} // ✅ 연결
          secureTextEntry
        />
        {passwordmsg && (
          <View style={{ height: 20 }}>
            <Text style={{ fontSize: 12, color: "red" }}>비밀번호가 일치하지 않습니다</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn2} onPress={signup}>
          <Text>회원가입</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50 },
  arrow: { position: "absolute", fontSize: 20, left: 10 },
  bar1: { height: 20, justifyContent: "center" },
  bar2: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "rgba(153, 153, 153, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  btn1: { width: "40%", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  calendaricon: { position: "absolute", right: 10 },
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