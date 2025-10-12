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

import arrowBack from "../assets/image/mypage/arrow_back.png";
import line3 from "../assets/image/mypage/mypage_line3.png";
import addSchedule from "../assets/image/alarm/addSchedule.png";
import newComments from "../assets/image/alarm/newComments.png";
import adjustmentRequest from "../assets/image/alarm/adjustementRequest.png";
import mateRequest from "../assets/image/alarm/mateRequest.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// 알림 종류에 따른 아이콘, 텍스트 반환
const getAlarmContent = (type, sender) => {
  switch (type) {
    case '일정 추가':
      return {
        icon: addSchedule,
        title: '일정 추가',
        message: `${sender}님이 캘린더에 일정을 추가하셨습니다.`,
      };
    case '메이트 요청':
      return {
        icon: mateRequest,
        title: '메이트 요청',
        message: `${sender}님이 메이트 요청을 보냈습니다.`,
      };
    case '정산 요청':
      return {
        icon: adjustmentRequest,
        title: '정산 요청',
        message: `${sender}님이 새로운 정산을 등록하셨습니다.`,
      };
    case '새 댓글':
      return {
        icon: newComments,
        title: '새 댓글',
        message: `${sender}님이 댓글을 남기셨습니다.`,
      };
    default:
      return { icon: null, title: '알림', message: '새 알림이 도착했습니다.' };
  }
};

// 알림 항목 템플릿 컴포넌트
const AlarmItem = ({ type, sender, timeAgo, hasButtons }) => {
  const { icon, title, message } = getAlarmContent(type, sender);

  return (
    <View style={styles.detailContainer}>
      <View style={styles.alarmInfoContainer}>
        <Image source={icon} style={styles.alarmIconBackground} />
        <View style={styles.alarmTextContent}>
          <View style={styles.alarmTextWrapper}>
            <Text style={styles.alarmTextName}>{title}</Text>
            <Text style={styles.alarmTimeAgo}>{timeAgo}</Text>
          </View>
          <Text style={styles.alarmTextDetail}>{message}</Text>
        </View>
      </View>
      {hasButtons && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptText}>수락하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton}>
            <Text style={styles.rejectText}>거절하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


export default function Alarm() {
  // 더미 데이터 (추후 API 통신으로 대체)
  const newAlarms = [
    { type: '일정 추가', sender: '손민수', timeAgo: '4분 전', hasButtons: false },
    { type: '메이트 요청', sender: '박민지', timeAgo: '9분 전', hasButtons: true },
  ];

  const previousAlarms = [
    { type: '정산 요청', sender: '김희영', timeAgo: '2시간 전', hasButtons: false },
    { type: '새 댓글', sender: '손민수', timeAgo: '10시간 전', hasButtons: false },
    { type: '새 댓글', sender: '손민수', timeAgo: '1일 전', hasButtons: false },
    { type: '새 댓글', sender: '손민수', timeAgo: '1일 전', hasButtons: false },
    { type: '새 댓글', sender: '손민수', timeAgo: '1일 전', hasButtons: false },
    { type: '새 댓글', sender: '손민수', timeAgo: '2일 전', hasButtons: false },
    { type: '새 댓글', sender: '손민수', timeAgo: '2일 전', hasButtons: false },
  ];

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
        <Text style={styles.myPageText}>알림</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 새 알림 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>새 알림</Text>
          <Image source={line3} style={styles.line3} />
          {newAlarms.map((alarm, index) => (
            <AlarmItem key={index} {...alarm} />
          ))}
        </View>

        {/* 이전 알림 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>이전 알림</Text>
          <Image source={line3} style={styles.line3} />
          {previousAlarms.map((alarm, index) => (
            <AlarmItem key={index} {...alarm} />
          ))}
        </View>
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
    height: screenHeight * 0.06,
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: "#E5E5E5",
  },
  alarmInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  alarmIconBackground: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 7
  },
  alarmTextContent: {
    flex: 1,
  },
  alarmTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  alarmTextName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  alarmTextDetail: {
    fontSize: 12,
    color: "#888",
    marginTop: 7,
  },
  alarmTimeAgo: {
    fontSize: 10,
    color: "#888",
  },
  line3: {
    width: "100%",
    height: 1,
    resizeMode: "stretch",
    tintColor: "#E5E5E5",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#ffdb58',
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  acceptText: {
    color: '#222221',
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  rejectText: {
    color: '#888',
  },
});
