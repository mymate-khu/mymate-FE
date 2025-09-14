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
      <Text style={styles.profileTextId}>ID : {userProfile.id}</Text>
      <Image source={line1} style={styles.line} />
    </View>
  );
};

export default function MyPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 마운트될 때 프로필 데이터를 불러오는 로직
  useEffect(() => {
    // 실제 API 호출을 시뮬레이션
    // 백엔드 통신 후 받은 데이터를 setUserProfile로 업데이트하면 됩니다.
    setTimeout(() => {
      const fetchedProfile = {
        profileImage: null, // 프로필 이미지가 없는 경우를 가정
        // profileImage: "https://placehold.co/100x100/A0C4FF/ffffff?text=User", // 프로필 이미지가 있는 경우를 가정
        name: "이름",
        id: "SZZYDE770",
      };
      setUserProfile(fetchedProfile);
      setIsLoading(false);
    }, 1500); // 1.5초 로딩 지연
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
