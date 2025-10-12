import React, { useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";


// onboarding pages' assets
import puzzle from "../../assets/image/onboarding/onBoarding1_puz.png";
import MyMate from "../../assets/image/onboarding/MyMate.png";
import document from "../../assets/image/onboarding/onBoarding2_doc.png";
import calendar from "../../assets/image/onboarding/onBoarding3_cal.png";
import basket from "../../assets/image/onboarding/onBoarding4_bas.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const TOTAL_PAGES = 4; // 총 온보딩 페이지 수

// Onboarding Step 1 component
const OnboardingStep1 = () => (
  <View style={styles.pageContent}>
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
);

// Onboarding Step 2 component
const OnboardingStep2 = () => (
  <View style={styles.pageContent}>
    <View style={styles.docImageContainer}>
      <Image
        source={document}
        style={styles.docStyle}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.textTitle}>우리 집 생활 규칙을 한눈에</Text>
    <Text style={styles.textDetail}>
      청소, 규칙, 작은 약속까지 {"\n"} 우리 집 생활 규칙을 한눈에 정리하고{" "}
      {"\n"} 언제든 편하게 확인하세요.
    </Text>
  </View>
);

// Onboarding Step 3 component
const OnboardingStep3 = () => (
  <View style={styles.pageContent}>
    <View style={styles.calImageContainer}>
      <Image
        source={calendar}
        style={styles.calStyle}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.textTitle}>캘린더로 일정 공유</Text>
    <Text style={styles.textDetail}>
      캘린더에 서로의 일정과 할 일을 기록해{"\n"}오늘 할 일부터 귀가
      시간까지{"\n"}쉽게 확인할 수 있어요.
    </Text>
  </View>
);

// Onboarding Step 4 component
const OnboardingStep4 = () => (
  <View style={styles.pageContent}>
    <View style={styles.basImageContainer}>
      <Image source={basket} style={styles.basStyle} resizeMode="contain" />
    </View>
    <Text style={styles.textTitle}>비용 정산도 간편하게</Text>
    <Text style={styles.textDetail}>
      룸메이트와 나누는 생활비,{"\n"}말하기 애매했던 소액도{"\n"}
      정산 기능으로 간편하게 공유하세요.
    </Text>
  </View>
);

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerViewRef = useRef(null);

  const finishOnboarding = async () => {
    // 온보딩 완료 여부를 AsyncStorage에 저장
    await AsyncStorage.setItem("onboardingCompleted", "true");
    
    // 온보딩 스택을 제거하고 로그인 페이지로 이동
    router.dismissAll();
    router.replace("../login/loginpage");
  };

  // const goToNextPage = () => {
  //   if (currentPage < TOTAL_PAGES - 1) {
  //     pagerViewRef.current?.setPage(currentPage + 1);
  //   } else {
  //     finishOnboarding();
  //   }
  // };

  // const goToPrevPage = () => {
  //   if (currentPage > 0) {
  //     pagerViewRef.current?.setPage(currentPage - 1);
  //   }
  // };

  return (
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.topBar}>
    //     {currentPage > 0 && (
    //       <TouchableOpacity onPress={goToPrevPage}>
    //         <Text style={styles.textPrev}>이전</Text>
    //       </TouchableOpacity>
    //     )}
    //     <TouchableOpacity
    //       onPress={goToNextPage}
    //       style={{ marginLeft: currentPage === 0 ? "auto" : 0 }}
    //     >
    //       <Text style={styles.textNext}>
    //         {currentPage < TOTAL_PAGES - 1 ? "다음" : "시작하기"}
    //       </Text>
    //     </TouchableOpacity>
    //   </View>

    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={finishOnboarding}
          style={{ marginLeft: currentPage === 0 ? "auto" : 0 }}
        >
          <Text style={styles.textNext}>
            스킵하기
          </Text>
        </TouchableOpacity>
      </View>

      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key="1">
          <OnboardingStep1 />
        </View>
        <View key="2">
          <OnboardingStep2 />
        </View>
        <View key="3">
          <OnboardingStep3 />
        </View>
        <View key="4">
          <OnboardingStep4 />
        </View>
      </PagerView>

      <View style={styles.paginationDots}>
        {[...Array(TOTAL_PAGES)].map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentPage && styles.activeDot]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.joinbutton}
        onPress={() => router.push("/login/signup1")}
      >
        <Text style={styles.joinButtonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginbutton}
        onPress={() => router.push("login/loginpage")}
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
  pagerView: {
    flex: 1,
  },
  pageContent: {
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
  docImageContainer: {
    position: "relative",
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  docStyle: {
    width: 240,
    height: 240,
  },
  calImageContainer: {
    position: "relative",
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  calStyle: {
    width: 240,
    height: 240,
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
    marginTop: 30,
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
});
