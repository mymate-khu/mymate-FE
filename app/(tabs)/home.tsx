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
import { useState, useEffect } from 'react';

// 로컬 이미지 리소스
import profileBasic from "../../assets/image/home/home_profile_basic.png";
import alarmBasic from "../../assets/image/home/home_alarm_basic.png";
import myPageArrow from "../../assets/image/home/home_arr_head.png";
import myMateArrow from "../../assets/image/home/home_arrow.png";
import puzzle from "../../assets/image/home/home_puzzle.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Home() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출을 시뮬레이션
    // 백엔드에서 사용자 정보를 가져오는 API를 호출하는 로직
    setTimeout(() => {
      // API 응답 데이터 (프로필 이미지가 있는 경우)
      const fetchedProfileWithImage = {
        name: "효진",
        profileImage: "https://placehold.co/40x40/A0C4FF/ffffff?text=User"
      };

      // API 응답 데이터 (프로필 이미지가 없는 경우)
      const fetchedProfileWithoutImage = {
        name: "효진",
        profileImage: null
      };
      
      // 프로필 이미지가 없는 경우를 가정하여 설정
      setUserProfile(fetchedProfileWithoutImage);
      // setUserProfile(fetchedProfileWithImage); // 프로필 이미지가 있는 경우 사용
      
      setIsLoading(false);
    }, 500); // 1.5초 로딩 지연
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFDB58" />
        <Text style={styles.loadingText}>프로필 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 프로필 이미지가 있을 경우 해당 URL을, 없을 경우 기본 이미지를 사용
  const profileImageSource = userProfile.profileImage ? { uri: userProfile.profileImage } : profileBasic;
  
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
      }}
    >
      {/*맨위 마이페이지, 알림 */}
      <View>
        <View style={styles.topSection}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("../mypage")}
          >
            <Image source={profileImageSource} style={styles.profileImage} />
            <Text style={styles.profileText}>내 계정</Text>
            <Image source={myPageArrow} style={styles.myPageArrow} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alarmContainer}
            onPress={() => router.push("../alarm")}
          >
            <Image source={alarmBasic} style={styles.alarmImage} />
          </TouchableOpacity>
        </View>
      </View>

      {/*로고 & 메이트관리 */}
      <View style={styles.puzzleSection}>
        <Image source={puzzle} style={styles.puzzleImage} />
        <View style={styles.textContainer}>
          <Text style={styles.helloText}>안녕하세요! {"\n"} {userProfile.name} 님!</Text>
          <Text style={styles.myMateText}>My Mate</Text>
        </View>
        <TouchableOpacity style={styles.myMateArrowContainer} onPress={() => router.push("../mateManage")}>
          <Image source={myMateArrow} style={styles.myMateArrow} />
        </TouchableOpacity>
      </View>

      {/*메이트보드 : 승원*/}
      <View></View>

      {/*투데이퍼즐 : 지민*/}
      <View></View>

      {/*채팅창 : 승원*/}
      <View></View>
    </ScrollView>
  );
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
