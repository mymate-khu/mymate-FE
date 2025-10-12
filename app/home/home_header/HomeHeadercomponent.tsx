import {
  View,
  // ScrollView는 이 컴포넌트에서는 사용되지 않으므로 제거했습니다.
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
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 추가

// 로컬 이미지 리소스
import profileBasic from "@/assets/image/home/home_profile_basic.png";
import alarmBasic from "@/assets/image/home/home_alarm_basic.png";
import myPageArrow from "@/assets/image/home/home_arr_head.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const BASE_URL = "http://13.209.214.254:8080";

type User = { name: string; profileImage: string | null };

export default function HomeHeadercomponent() {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  // 로딩 상태: 토큰 로드 및 프로필 조회 중
  const [isLoading, setIsLoading] = useState(true); 
  // 토큰 상태: null = 없음, string = 로드 완료
  const [authToken, setAuthToken] = useState<string | null | undefined>(undefined); 

  // =========================================================================
  // 토큰 불러오기 및 설정
  // =========================================================================
  const loadAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setAuthToken(`Bearer ${token}`);
      } else {
        // 토큰이 없거나 만료된 경우 (로그인 필요)
        setAuthToken(null);
      }
    } catch (e) {
      console.error("토큰 로드 실패", e);
      setAuthToken(null);
    }
  };

  // =========================================================================
  // 사용자 프로필 데이터를 API에서 가져오는 함수
  // =========================================================================
  const fetchUserProfile = async (token: string) => {
    try {
      // Get My Profile 엔드포인트를 가정하고 호출합니다.
      const response = await fetch(`${BASE_URL}/member-controller/getMyProfile`, {
        method: 'GET',
        headers: {
          'Authorization': token, // 🌟 동적으로 로드된 토큰 사용
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // 401 Unauthorized 등 인증 실패 응답 처리
        if (response.status === 401) {
             Alert.alert("인증 만료", "다시 로그인 해주세요.");
             // router.replace("/login"); // 실제 앱에서는 로그인 화면으로 이동
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();

      if (jsonResponse.isSuccess && jsonResponse.data) {
        const data = jsonResponse.data;
        
        // API 응답 데이터 매핑: nickname을 name으로, profileImageUrl을 profileImage로 사용
        const fetchedProfile: User = {
          name: data.nickname || data.username || "사용자",
          profileImage: data.profileImageUrl || null,
        };
        
        setUserProfile(fetchedProfile);
      } else {
        // API에서 isSuccess가 false인 경우 처리
        Alert.alert("프로필 로드 오류", jsonResponse.message || "프로필을 불러오는데 실패했습니다.");
        // 실패 시 기본값 설정
        setUserProfile({ name: "알 수 없는 사용자", profileImage: null });
      }

    } catch (error) {
      console.error("홈 헤더 프로필 API 호출 중 오류 발생:", error);
      Alert.alert("네트워크 오류", "프로필 정보를 가져오는 데 실패했습니다.");
      // 오류 발생 시 기본값 설정
      setUserProfile({ name: "로딩 실패", profileImage: null });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. 컴포넌트 마운트 시 토큰 로드 시작
    loadAuthToken();
  }, []);

  useEffect(() => {
    // 2. 토큰 로드 상태에 따라 프로필 조회 실행
    if (authToken !== undefined) {
      if (authToken) {
        // 토큰이 성공적으로 로드된 경우 (토큰 문자열이 있음)
        fetchUserProfile(authToken);
      } else {
        // 토큰이 없거나 로드 실패 (null)이 확인된 경우
        setUserProfile({ name: "로그인", profileImage: null });
        setIsLoading(false);
      }
    }
  }, [authToken]);


  // =========================================================================
  // 렌더링 로직
  // =========================================================================

  // 로딩 상태 (authToken이 undefined인 초기 상태 + isLoading이 true인 상태)
  if (isLoading || authToken === undefined) { 
    return (
      <View style={[styles.topSection, { justifyContent: 'center' }]}>
        <ActivityIndicator size="small" color="#FFDB58" />
        <Text style={styles.loadingText}>프로필 로딩 중...</Text>
      </View>
    );
  }
  
  // userProfile이 로드되지 않았거나 (오류 상황) 또는 로그인 상태가 아닌 경우
  if (!userProfile) {
     // 이 경우, fetchUserProfile의 오류 처리 로직에서 이미 userProfile에 기본값을 할당했기 때문에 
     // 사실상 이곳에 도달하면 오류를 의미합니다. 안전하게 기본 UI를 표시합니다.
     const defaultProfile: User = { name: authToken ? "로딩 오류" : "로그인", profileImage: null };
     
     const profileImageSource = defaultProfile.profileImage
        ? { uri: defaultProfile.profileImage }
        : profileBasic;
     
     return (
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
     );
  }

  // 프로필 이미지가 있을 경우 해당 URL을, 없을 경우 기본 이미지를 사용
  const profileImageSource = userProfile.profileImage
    ? { uri: userProfile.profileImage }
    : profileBasic;

  return (
    <View style={styles.topSection}>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => router.push("../mypage")}
      >
        <Image source={profileImageSource} style={styles.profileImage} />
        <Text style={styles.profileText}>내 계정</Text> {/* 사용자 이름 대신 '내 계정' 유지 */}
        <Image source={myPageArrow} style={styles.myPageArrow} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.alarmContainer}
        onPress={() => router.push("../alarm")}
      >
        <Image source={alarmBasic} style={styles.alarmImage} />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  // 화면 전체 높이의 약 10%
  topSection: {
    height: screenHeight * 0.1,
    backgroundColor: "#f5f5f5", // 구역 시각화를 위한 임시 색상
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  // 화면 전체 높이의 약 40%
  puzzleSection: {
    height: screenHeight * 0.4,
    backgroundColor: "#fbd0d0ff", // 구역 시각화를 위한 임시 색상
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: 'center', // 세로 중앙 정렬
    paddingHorizontal: 7,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // 동그란 프로필 사진을 위해 추가
  },
  profileText: {
    fontSize: 16,
    marginLeft: 8, // left 대신 marginLeft 사용
  },
  myPageArrow: {
    width: 20,
    height: 20,
    marginLeft: 7, // left 대신 marginLeft 사용
  },
  alarmContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  alarmImage: {
    width: 40,
    height: 40,
    marginRight: 5, // right 대신 marginRight 사용
  },
  puzzleImage: {
    width: 188,
    height: 188,
    top: 30,
    left: 15,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
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
