import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import basket from "../../assets/image/onboarding/onBoarding4_bas.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Step4() {
  const navigation = useNavigation();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    
    router.dismissAll();                 // (선택) 중첩 스택까지 날리기
    router.replace("/login/loginpage");     // 파일 위치에 맞춘 경로
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.textPrev}>이전</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContentArea}>
        <View style={styles.basImageContainer}>
          <Image source={basket} style={styles.basStyle} resizeMode="contain" />
        </View>
        <Text style={styles.textTitle}>비용 정산도 간편하게</Text>
        <Text style={styles.textDetail}>
          룸메이트와 나누는 생활비,{"\n"}말하기 애매했던 소액도{"\n"}
          정산 기능으로 간편하게 공유하세요.
        </Text>
      </View>

      <View style={styles.paginationDots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      <TouchableOpacity
        style={styles.joinbutton}
        onPress={() => router.push("/onboarding/onboarding2")}
      >
        <Text style={styles.joinButtonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginbutton}
        onPress={() => router.push("/login/loginpage")}
        >
        <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  mainContentArea: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: screenHeight * 0.05,
  },
  basImageContainer: {
    position: "relative",
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  basStyle: {
    width: 240,
    height: 240,
  },
  textTitle: {
    fontSize: screenWidth * 0.065,
    color: "#222221",
    fontWeight: "bold",
    lineHeight: 35,
    letterSpacing: -0.7,
    marginTop: 20,
    textAlign: "center",
  },
  textDetail: {
    fontSize: screenWidth * 0.038,
    color: "#757575",
    fontWeight: "400",
    lineHeight: 22,
    textAlign: "center",
    marginTop: 15,
  },

  textNext: {
    color: "#222221",
    fontSize: 16,
    fontWeight: "bold",
  },
  textPrev: {
    color: "#222221",
    fontSize: 16,
    fontWeight: "bold",
  },

  joinbutton: {
    width: screenWidth * 0.85,
    height: 50,
    backgroundColor: "#ffd900ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "center",
  },
  joinButtonText: {
    color: "#222221",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginbutton: {
    marginBottom: 30,
    alignSelf: "center",
  },
  loginButtonText: {
    color: "#757575",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EBE9E6",
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: "#FFD700",
  },

  progressbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "5%",
    left: "6%",
    right: "6%",
    height: "10%",
  },
  bar: {
    width: "30%",
    height: 3,
    backgroundColor: "black",
    marginHorizontal: 3,
  },
  titlebar: {
    position: "absolute",
    top: "25%",
    left: "6%",
    right: "6%",
    height: "30%",
  },
  titelbarText: {
    fontSize: screenWidth * 0.09,
    color: "#222221",
    fontFamily: "NanumSquareNeo",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 45,
    letterSpacing: -0.75,
  },
  nextbutton: {
    position: "absolute",
    bottom: "10%",
    left: "6%",
    right: "6%",
    height: "10%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  nextbuttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
