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
import puzzle from "../../assets/image/onboarding/onBoarding1_puz.png";
import MyMate from "../../assets/image/onboarding/MyMate.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Step1() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push("/onboarding/onboarding2")}
        >
          <Text style={styles.textNext}>다음</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContentArea}>
        <View style={styles.puzzleImageContainer}>
          <Image
            source={puzzle}
            style={styles.puzzleStyle}
            resizeMode="contain"
          />
          <Image
            source={MyMate}
            style={styles.mymateStyle}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.textTitle}>룸메이트와 소통을 더 즐겁고 쉽게!</Text>
        <Text style={styles.textDetail}>
          퍼즐조각이 맞춰지듯, 룸메이트와의 소통도 {"\n"} MyMate로 더 즐겁고
          자연스러워져요.{" "}
        </Text>
      </View>

      <View style={styles.paginationDots}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <TouchableOpacity
        style={styles.joinbutton}
        onPress={() => router.push("/onboarding/onboarding2")}
      >
        <Text style={styles.joinButtonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginbutton}
        onPress={() => router.push("../login")}
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
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  mainContentArea: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: screenHeight * 0.05,
  },
  puzzleImageContainer: {
    position: "relative",
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  puzzleStyle: {
    width: 240,
    height: 240,
  },
  mymateStyle: {
    position: "absolute",
    width: 51,
    height: 30,
    top: 11.5,
    right: 24,
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
    gap: "10",
    flexDirection: "row", // ✅ 가로로 정렬
    justifyContent: "center", // 가운데 정렬 (원하면 space-between도 가능)
    alignItems: "center",
    position: "absolute",
    top: "5%",
    left: "6%",
    right: "6%", // ✅ 양옆 여백
    height: "10%",
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
    color: "#222221", // var(--label-normal)
    fontFamily: "PretendardSemiBold", // var(--typescale-display_l-family)
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 45, // 150% of 30px
    letterSpacing: -0.75,
  },

  nextbuttonText: {
    color: "#222221",
    fontSize: 16,
    fontWeight: "bold",
  },
});
