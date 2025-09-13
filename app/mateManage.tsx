import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

// Note: Ensure these local assets are available at the specified paths.
import arrowBack from "../assets/image/mypage/arrow_back.png";
import line3 from "../assets/image/mypage/mypage_line3.png";
import profileImage from "../assets/image/home/home_profile_basic.png";
import plusBtn from "../assets/image/mateManage/plusBtn.png";
import NoBtn from "../assets/image/mateManage/noBtn.svg";
import DeleteBtn from "../assets/image/mateManage/deleteBtn.svg";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// SVG 컴포넌트 정의
const NoBtnComponent = (props) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M18 6L6 18M6 6L18 18" />
  </Svg>
  // viewBox="0 0 24 24": SVG 뷰포트의 좌표 시스템을 정의. (0, 0)에서 시작하여 너비와 높이가 각각 24인 영역

  // fill="none": 도형의 내부를 채우는 색상을 "없음"으로 설정

  // stroke="currentColor": 윤곽선(선)의 색상을 현재 텍스트 색상(currentColor)으로 지정

  // strokeWidth="2": 윤곽선의 두께를 2픽셀로 설정

  // strokeLinecap="round": 선의 끝을 둥글게 처리

  // strokeLinejoin="round": 선이 만나는 부분을 둥글게 처리

  // {...props}: 컴포넌트에 전달된 추가 속성을 모두 SVG 요소에 전달

  // <Path> 코드는 두 개의 대각선((18, 6)에서 (6, 18)까지와 (6, 6)에서 (18, 18)까지)을 그려서 "X"자 모양의 아이콘을 완성
);

const DeleteBtnComponent = (props) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#222221"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 6h18" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

// 수락 대기중인 메이트 항목 컴포넌트
const PendingMateItem = ({ name, id, onReject }) => {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.mateInfoContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileTextName}>{name}</Text>
          <Text style={styles.profileTextId}>{id}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onReject}>
        <NoBtnComponent style={styles.imageSize} />
      </TouchableOpacity>
    </View>
  );
};

// 현재 추가된 메이트 항목 컴포넌트
const CurrentMateItem = ({ name, id, onDelete }) => {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.mateInfoContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileTextName}>{name}</Text>
          <Text style={styles.profileTextId}>{id}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <DeleteBtnComponent style={styles.imageSize} />
      </TouchableOpacity>
    </View>
  );
};

export default function MateManage() {
  // 더미 데이터 (추후 API 통신으로 대체)
  const pendingMates = [{ name: "박민지", id: "SZZYDE770" }];

  const currentMates = [
    { name: "김희영", id: "SZZYDE770" },
    { name: "손민수", id: "SZZYDE770" },
    { name: "정하진", id: "SZZYDE770" },
  ];

  // API 호출을 시뮬레이션하는 더미 함수
  const handleReject = (mateId) => {
    console.log(`메이트 요청 거절: ${mateId}`);
    // 여기에 API 호출 로직 추가
  };

  const handleDelete = (mateId) => {
    console.log(`메이트 삭제: ${mateId}`);
    // 여기에 API 호출 로직 추가
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* 상단 섹션 */}
      <View style={styles.topSection}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Image source={arrowBack} style={styles.backHomeArrow} />
        </TouchableOpacity>
        <Text style={styles.myPageText}>나의 메이트 관리</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 수락 대기중인 메이트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>수락 대기 중</Text>
          <Image source={line3} style={styles.line3} />
          {pendingMates.map((mate, index) => (
            <PendingMateItem
              key={index}
              {...mate}
              onReject={() => handleReject(mate.id)}
            />
          ))}
        </View>

        {/* 현재 추가된 메이트 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>현재 추가된 메이트</Text>
          <Image source={line3} style={styles.line3} />
          {currentMates.map((mate, index) => (
            <CurrentMateItem
              key={index}
              {...mate}
              onDelete={() => handleDelete(mate.id)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.plusMateContainer}>
          <Image source={plusBtn} style={{ width: 40, height: 40 }} />
          <Text style={styles.plusMateText}>메이트 추가하기</Text>
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
    height: screenHeight * 0.09,
    paddingHorizontal: 15,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  myPageText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backHomeArrow: {
    width: 20,
    height: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitleText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#888",
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#E5E5E5",
  },
  mateInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  profileTextName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileTextId: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#f6f6f6ff', // 배경색 추가
    borderRadius: 30, // 둥근 모서리 추가
  },
  imageSize: {
    width: 24,
    height: 24,
  },
  line3: {
    width: "100%",
    height: 1,
    resizeMode: "stretch",
    tintColor: "#E5E5E5",
    marginBottom: 5,
  },
  plusMateContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
  },
  plusMateText: {
    fontSize: 16,
    color: "#222221",
    fontWeight: "500",
    marginLeft: 10,
  },
});
