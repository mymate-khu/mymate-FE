import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function Step4() {
  const navigation = useNavigation();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");

    router.dismissAll();                 // (선택) 중첩 스택까지 날리기
    router.replace("/login");     // 파일 위치에 맞춘 경로
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.titlebar}>
        <Text style={styles.titelbarText}>
          온보딩4
        </Text>
      </View>
      <TouchableOpacity style={styles.nextbutton} onPress={finishOnboarding}>
        <Text style={styles.nextbuttonText}>시작하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  progressbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "5%",
    left: "6%",
    right: "6%",
    height: "10%",
  },
  bar: {
    width: "30%",
    height: 3,
    backgroundColor: "black",
    marginHorizontal: 3,
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
    color: "#222221",
    fontFamily: "NanumSquareNeo",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 45,
    letterSpacing: -0.75,
  },
  nextbutton: {
    position: "absolute",
    bottom: "10%",
    left: "6%",
    right: "6%",
    height: "10%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  nextbuttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});