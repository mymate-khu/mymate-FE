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
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from 'react-native-svg';
import { useState, useEffect } from 'react';

// Note: Ensure these local assets are available at the specified paths.
import arrowBack from "../assets/image/mypage/arrow_back.png";
import profileImage from "../assets/image/home/home_profile_basic.png";
import profileEdit from "../assets/image/mypage/profileImageEdit.png";
import line1 from "../assets/image/mypage/mypage_line1.png";
import line_bold from "../assets/image/mypage/mypage_line2.png";
import line3 from "../assets/image/mypage/mypage_line3.png";
import detailArrow from "../assets/image/home/home_arr_head.png";
import UserImage from "../assets/image/mypage/User_01.svg";
import lockImage from "../assets/image/mypage/Lock.png";
import BellImage from "../assets/image/mypage/Bell.svg";
import FlagImage from "../assets/image/mypage/Flag.svg";
import ChatImage from "../assets/image/mypage/Chat_Conversation_Circle.svg";
import exitImage from "../assets/image/mypage/Exit.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// API 기본 URL 설정 (member-controller의 Get My Profile 엔드포인트를 가정합니다.)
const BASE_URL = "http://13.209.214.254:8080";

// 프로필 섹션을 별도 컴포넌트로 분리
const ProfileSection = ({ userProfile, onEdit }) => {
  const source = userProfile.profileImage ? { uri: userProfile.profileImage } : profileImage;
  return (
    <View style={styles.profileSection}>
      <View style={styles.profileContainer}>
        <Image source={source} style={styles.profileImage} />
        <TouchableOpacity style={styles.profileEditButton} onPress={onEdit}>
          <Image source={profileEdit} style={styles.profileEditImage} />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileTextName}>{userProfile.name}</Text>
      <Text style={styles.profileTextId}>{userProfile.id}</Text>
      <Image source={line1} style={styles.line} />
    </View>
  );
};

interface UserProfile {
  name: string;
  id: string;
  profileImage: string | null;
}

export default function MyPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async () => {
    try {
      // API 명세서에서 'Get My Profile'에 해당하는 정확한 URL로 대체해야 합니다.
      // 현재는 스웨거 주소와 응답 구조를 기반으로 유추하여 '/member-controller/getMyProfile'로 가정합니다.
      const response = await fetch(`${BASE_URL}/member-controller/getMyProfile`, {
        method: 'GET',
        headers: {
          // 인증 토큰이 필요하다면 여기에 'Authorization': 'Bearer YOUR_TOKEN' 추가
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();

      if (jsonResponse.isSuccess && jsonResponse.data) {
        const data = jsonResponse.data;
        
        // API 응답 데이터(data)를 프론트엔드 상태(userProfile)에 맞게 매핑
        const fetchedProfile = {
          // 서버 응답의 'nickname'을 'name'으로 사용
          name: data.nickname || data.username || "사용자",
          // 서버 응답의 'memberId'를 'id'로 사용하거나, 사용자 식별 ID가 있다면 그것을 사용
          id: data.memberId ? String(data.memberId) : "ID 정보 없음",
          // 서버 응답의 'profileImageUrl'을 사용
          profileImage: data.profileImageUrl || null,
        };
        
        setUserProfile(fetchedProfile);
      } else {
        // API에서 isSuccess가 false인 경우 처리
        Alert.alert("프로필 로드 오류", jsonResponse.message || "프로필을 불러오는데 실패했습니다.");
        // 기본값으로 설정
        setUserProfile({ name: "알 수 없는 사용자", id: "ID: ?", profileImage: null });
      }

    } catch (error) {
      console.error("프로필 API 호출 중 오류 발생:", error);
      Alert.alert("네트워크 오류", "서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      // 오류 발생 시 기본값으로 설정
      setUserProfile({ name: "로딩 실패", id: "ID: ERROR", profileImage: null });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    // 프로필 편집 버튼을 눌렀을 때 실행될 로직
    console.log("프로필 편집 버튼이 눌렸습니다.");
    // 여기에 프로필 편집 페이지로 이동하는 로직 등을 추가할 수 있습니다.
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* 상단 섹션 */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={arrowBack} style={styles.backHomeArrow} />
        </TouchableOpacity>
        <Text style={styles.myPageText}>마이페이지</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 프로필 섹션 */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFDB58" />
            <Text style={styles.loadingText}>프로필 정보를 불러오는 중...</Text>
          </View>
        ) : (
          <ProfileSection userProfile={userProfile} onEdit={handleEdit} />
        )}

        {/* 상세 메뉴 섹션 */}
        <View style={styles.detailSection}>
          <Text style={styles.divideSectionText}>나의 계정</Text>
          <Image source={line_bold} style={styles.lineBold} />
          
          <TouchableOpacity style={styles.detailContainer}>
            <View style={styles.detailItemLeft}>
              <UserImage width={24} height={24} />
              <Text style={styles.detailText}>회원 정보 수정</Text>
            </View>
            <Image source={detailArrow} style={styles.detailArrow} />
          </TouchableOpacity>
          <Image source={line3} style={styles.line3} />

          <TouchableOpacity style={styles.detailContainer}>
            <View style={styles.detailItemLeft}>
              <Image source={lockImage} style={styles.imageSize} />
              <Text style={styles.detailText}>비밀번호 변경</Text>
            </View>
            <Image source={detailArrow} style={styles.detailArrow} />
          </TouchableOpacity>
          <Image source={line3} style={styles.line3} />

          <TouchableOpacity style={styles.detailContainer}>
            <View style={styles.detailItemLeft}>
              <BellImage width={24} height={24} />
              <Text style={styles.detailText}>알림 설정</Text>
            </View>
            <Image source={detailArrow} style={styles.detailArrow} />
          </TouchableOpacity>
          <Image source={line3} style={styles.line3} />

          <Text style={[styles.divideSectionText, { marginTop: 20 }]}>고객센터</Text>
          <Image source={line_bold} style={styles.lineBold} />

          <TouchableOpacity style={styles.detailContainer}>
            <View style={styles.detailItemLeft}>
              <FlagImage width={24} height={24} />
              <Text style={styles.detailText}>공지사항</Text>
            </View>
            <Image source={detailArrow} style={styles.detailArrow} />
          </TouchableOpacity>
          <Image source={line3} style={styles.line3} />

          <TouchableOpacity style={styles.detailContainer}>
            <View style={styles.detailItemLeft}>
              <ChatImage width={24} height={24} />
              <Text style={styles.detailText}>1:1 문의</Text>
            </View>
            <Image source={detailArrow} style={styles.detailArrow} />
          </TouchableOpacity>
          <Image source={line3} style={styles.line3} />
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton}>
          <Image source={exitImage} style={styles.exitImage} />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: screenHeight * 0.08,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  myPageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backHomeArrow: {
    width: 20,
    height: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profileContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  profileEditImage: {
    width: 28,
    height: 28,
  },
  profileTextName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileTextId: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.25,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  divideSectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  detailSection: {
    paddingHorizontal: 20,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  detailItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginLeft: 15,
  },
  detailArrow: {
    width: 20,
    height: 20,
    tintColor: "#C0C0C0",
  },
  line: {
    width: '100%',
    height: 1,
    resizeMode: 'stretch',
    marginTop: 20,
  },
  lineBold: {
    width: '100%',
    height: 2,
    resizeMode: 'stretch',
    marginVertical: 15,
  },
  line3: {
    width: '100%',
    height: 1,
    resizeMode: 'stretch',
    tintColor: "#E5E5E5",
  },
  imageSize: {
    width: 24,
    height: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  exitImage: {
    width: 24,
    height: 24,
    tintColor: '#333',
  }
});
