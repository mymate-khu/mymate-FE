import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFonts } from 'expo-font';

type RoutePath = "/onboarding/onboarding1" | "/login" | "/home";

export default function Index() {

  const [fontsLoaded] = useFonts({
    PretendardSemiBold: require('../assets/fonts/Pretendard-SemiBold.otf'),
  });

  const [initialRoute, setInitialRoute] = useState<RoutePath | null>(null);

  useEffect(() => {
    const checkState = async () => {

      // ✅ 개발 중일 때만 주석 해제
        await AsyncStorage.clear();

      const onboarded = await AsyncStorage.getItem("onboardingCompleted");
      const token = await AsyncStorage.getItem("userToken");

      if (!onboarded) {
        setInitialRoute("/onboarding/onboarding1");
      } else if (!token) {
        setInitialRoute("/login");
      } else {
        setInitialRoute("/home");
      }

    };

    checkState();
  }, []);

  if (!fontsLoaded) {
    return null; // 또는 로딩 스피너
  }

  if (!initialRoute) {
    return (
      <View style={styles.splashContainer}>
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "NanumSquareNeo",
    fontSize: 40,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 60,
    letterSpacing: -1,
  },
});