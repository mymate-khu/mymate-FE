import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

// 로컬 이미지 리소스
import myMateArrow from "@/assets/image/home/home_arrow.png";
import puzzle from "@/assets/image/home/home_puzzle.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function MateManagement(){
    return <View style={styles.puzzleSection}>
        <Image source={puzzle} style={styles.puzzleImage} />
        <View style={styles.textContainer}>
          <Text style={styles.helloText}>안녕하세요! {"\n"} 효진 님!</Text>
          <Text style={styles.myMateText}>My Mate</Text>
        </View>
        <TouchableOpacity style={styles.myMateArrowContainer} onPress={() => router.push("../mateManage")}>
          <Image source={myMateArrow} style={styles.myMateArrow} />
        </TouchableOpacity>
      </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  // 화면 전체 높이의 약 10%
  topSection: {
    height: screenHeight * 0.1,
    backgroundColor: "#E5E5E5", // 구역 시각화를 위한 임시 색상
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  // 화면 전체 높이의 약 40%
  puzzleSection: {
    height: screenHeight * 0.4,
    backgroundColor: "#fbd0d0ff", // 구역 시각화를 위한 임시 색상
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 7,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // 동그란 프로필 사진을 위해 추가
  },
  profileText: {
    fontSize: 16,
    top:10,
    left:8
  },
  myPageArrow: {
    width: 20,
    height: 20,
    top:10.5,
    left:7
  },
  alarmContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
  alarmImage: {
    width: 40,
    height: 40,
    right:5
  },
  puzzleImage: {
    width: 188,
    height: 188,
    top:30,
    left:15
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1, // 남는 공간을 모두 차지
    marginLeft: 220, // 퍼즐 이미지와의 간격
    bottom: 120,
  },
  helloText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  myMateText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
  },
  myMateArrowContainer: {
    position: "absolute",
    right: 20,
    bottom: 50,
  },
  myMateArrow: {
    width: 35,
    height: 35,
  },
});