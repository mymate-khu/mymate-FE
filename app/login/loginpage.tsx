import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import { useState } from "react";
import { TokenReq } from "@/components/apis/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MainIcon from "@/assets/image/loginpageimg/main.png";
import kakaoIcon from "@/assets/image/loginpageimg/kakaoicon.png";
import naverIcon from "@/assets/image/loginpageimg/navericon.png";
import appleIcon from "@/assets/image/loginpageimg/appleicon.png";

const screenWidth = Dimensions.get("window").width;

export default function LoginScreen() {
  const [formid, setformid] = useState("");
  const [formpassword, setformpassword] = useState("");

  const loginapi = async () => {
    try {
      const res = await TokenReq.post("/api/auth/login", {
        userId: formid,
        passwordEncrypted: formpassword,
      });

      console.log("✅ 로그인 응답:", res.data);

      // 서버 응답 구조에 맞게 토큰 추출
      const accessToken = res.data?.data?.accessToken;
      const refreshToken = res.data?.data?.refreshToken;

      if (!accessToken) {
        console.warn("⚠️ accessToken이 응답에 없습니다");
        return;
      }

      // AsyncStorage에 저장 (문자열만 허용)
      await AsyncStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem("refreshToken", refreshToken);
      }

      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.error("❌ 로그인 실패");
      if (err.response) {
        console.error("status:", err.response.status);
        console.error("data:", err.response.data);
      } else {
        console.error(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={MainIcon} style={{ marginTop: 76 }} />

      <Text style={styles.title}>마이메이트에 오신걸 환영해요!</Text>

      <View style={styles.logintext}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>로그인</Text>
      </View>

      <TextInput
        style={styles.inputbar}
        placeholder="ID"
        placeholderTextColor={"rgba(153, 153, 153, 1)"}
        value={formid}
        onChangeText={setformid}
      />

      <TextInput
        style={styles.inputbar}
        placeholder="비밀번호"
        placeholderTextColor={"rgba(153, 153, 153, 1)"}
        secureTextEntry
        value={formpassword}
        onChangeText={setformpassword}
      />

      <TouchableOpacity style={styles.loginbtn} onPress={loginapi}>
        <Text>로그인</Text>
      </TouchableOpacity>

      <View style={styles.middlebtn}>
        <TouchableOpacity>
          <Text style={styles.middlebtnText}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.middlebtnText}> | </Text>
        <TouchableOpacity>
          <Text style={styles.middlebtnText}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.middlebtnText}> | </Text>
        <TouchableOpacity onPress={() => router.push("/login/signup1")}>
          <Text style={styles.middlebtnText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logocontainer}>
        <TouchableOpacity>
          <Image source={kakaoIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={naverIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={appleIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: "6%",
  },
  title: {
    fontWeight: "400",
    fontSize: 12,
    color: "rgba(121, 121, 121, 1)",
  },
  logintext: {
    width: "100%",
    height: 30,
    marginTop: 30,
    left: 5,
    justifyContent: "center",
  },
  inputbar: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "rgba(153, 153, 153, 0.1)",
    width: "100%",
    borderRadius: 10,
    height: 48,
  },
  loginbtn: {
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
    backgroundColor: "rgba(255, 230, 0, 1)",
    width: "100%",
    borderRadius: 10,
    height: 48,
  },
  middlebtn: {
    flexDirection: "row",
    marginTop: 15,
    width: 219,
    height: 20,
    justifyContent: "space-between",
  },
  middlebtnText: {
    fontSize: 12,
    color: "rgba(121, 121, 121, 1)",
  },
  logocontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 228,
    marginTop: 40,
  },
});
