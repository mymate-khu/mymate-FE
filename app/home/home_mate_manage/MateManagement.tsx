import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";

// 🚨 TokenReq 인스턴스를 가져옵니다. (자동으로 토큰을 Authorization 헤더에 포함)
import { TokenReq } from "../../../components/apis/axiosInstance"; 

// 로컬 이미지 리소스
import myMateArrow from "@/assets/image/home/home_arrow.png";
import puzzle from "@/assets/image/home/home_puzzle.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

type User = { name: string;};

export default function MateManagement(){
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
      try {
        // 🌟 [수정] API 경로 앞에 '/api'를 추가하여 서버에서 컨트롤러로 정확히 매핑되도록 시도
        // (서버가 API 요청을 정적 리소스로 오해하는 문제 해결 시도)
        const response = await TokenReq.get('/api/profile/me');

        // Axios는 응답 본문을 .data에 담습니다.
        const jsonResponse = response.data; 
    
        if (jsonResponse.isSuccess && jsonResponse.data) {
          const data = jsonResponse.data;
          
          // API 응답 데이터 매핑: nickname을 name으로 사용
          const fetchedProfile: User = {
            name: data.nickname || data.username || "사용자",
          };
          
          setUserProfile(fetchedProfile);
        } else {
          // API에서 isSuccess가 false인 경우 처리
          Alert.alert("프로필 로드 오류", jsonResponse.message || "프로필을 불러오는데 실패했습니다.");
          // 실패 시 기본값 설정
          setUserProfile({ name: "알 수 없는 사용자"});
        }
    
      } catch (error: any) {
        // Axios 에러 처리: 네트워크 오류, 401, 500 등
        console.error("MateManagement 프로필 API 호출 중 오류 발생:", error);
        
        // 🚨 500 오류 시 서버에서 보낸 상세 에러 데이터를 콘솔에 출력
        if (error.response) {
            console.error(`서버 응답 상태: ${error.response.status}`);
            console.error("서버 상세 응답 데이터:", error.response.data);
        }

        // 오류 메시지 추출 (Axios 에러 구조를 따름)
        const errorMessage = error.response?.data?.message || error.message || "프로필 정보를 가져오는 데 실패했습니다.";
        
        Alert.alert("네트워크 오류", errorMessage);
        
        // 오류 발생 시 기본값 설정
        setUserProfile({ name: "로딩 실패"});
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      fetchUserProfile();
    }, []);
    
    if (isLoading || !userProfile) { // userProfile이 null일 때도 로딩 상태로 처리 (safety check)
      return (
        <View style={[styles.topSection, { justifyContent: 'center' }]}>
          <ActivityIndicator size="small" color="#FFDB58" />
          <Text style={styles.loadingText}>프로필 로딩 중...</Text>
        </View>
      );
    }
    return (
        <View style={styles.puzzleSection}>
          <Image source={puzzle} style={styles.puzzleImage} />
          <View style={styles.textContainer}>
            <Text style={styles.helloText}>안녕하세요! {"\n"}{userProfile.name} 님!</Text>
            <Text style={styles.myMateText}>My Mate</Text>
          </View>
          <TouchableOpacity style={styles.myMateArrowContainer} onPress={() => router.push("../mateManage")}>
            <Image source={myMateArrow} style={styles.myMateArrow} />
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#f5f5f5", // 구역 시각화를 위한 임시 색상
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  // 화면 전체 높이의 약 40%
  puzzleSection: {
    height: screenHeight * 0.4,
    backgroundColor: "#f5f5f5", // 구역 시각화를 위한 임시 색상
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
