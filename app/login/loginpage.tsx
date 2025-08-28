import { router } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
const screenWidth = Dimensions.get("window").width;
import MainIcon from "@/assets/image/loginpageimg/main.png"
import kakaoIcon from "@/assets/image/loginpageimg/kakaoicon.png"
import naverIcon from "@/assets/image/loginpageimg/navericon.png"
import appleIcon from "@/assets/image/loginpageimg/appleicon.png"

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image source={MainIcon} style={{ marginTop: 76 }}></Image>
      <Text style={styles.title}>마이메이트에 오신걸 환영해요!</Text>
      <View style={styles.logintext}><Text>로그인</Text></View>
      <TextInput style={styles.inputbar} placeholder="ID" placeholderTextColor={"rgba(153, 153, 153, 1)"}></TextInput>
      <TextInput style={styles.inputbar} placeholder="비밀번호" placeholderTextColor={"rgba(153, 153, 153, 1)"}></TextInput>
      <TouchableOpacity style={styles.loginbtn}><Text>로그인</Text></TouchableOpacity>

      <View style={styles.middlebtn}>
        <TouchableOpacity><Text>아이디 찾기</Text></TouchableOpacity>
        <Text>|</Text>
        <TouchableOpacity><Text>비밀번호 찾기</Text></TouchableOpacity>
        <Text>|</Text>
        <TouchableOpacity><Text>회원가입</Text></TouchableOpacity>

      </View>

      <View style={styles.logocontainer}>
        <TouchableOpacity>
          <Image source={kakaoIcon}></Image>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={naverIcon}></Image>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={appleIcon}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: "column",
    alignItems: 'center',
    paddingHorizontal: "6%",
  },
  title: {
    fontWeight: 400,
    fontSize: 12,
    color: "rgba(121, 121, 121, 1)"
  },
  logintext: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    height: 30,
    marginTop: 30,
    left: 5
  },
  inputbar: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "rgba(153, 153, 153, 0.1)",
    width: "100%",
    borderRadius: 10,
    height: 48
  },
  loginbtn: {
    alignItems: "center",
    marginTop: 30,
    justifyContent:"center",
    backgroundColor: "rgba(255, 230, 0, 1)",
    width: "100%",
    borderRadius: 10,
    height: 48
  },
  middlebtn: {
    flexDirection: "row",
    marginTop: 15,
    width: 219,
    height: 20,
    textAlign: "center",
    fontSize: 12,
    justifyContent: "space-between",
    color: "rgba(121, 121, 121, 1)"
  },
  logocontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 228,
    marginTop: 40
  }
});