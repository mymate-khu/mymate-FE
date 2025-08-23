// app/_layout.tsx
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <SafeAreaProvider>
      {/* 상태바 스타일(선택) */}
      <StatusBar barStyle="dark-content" />
      
      {/* 상·좌·우 안전영역 적용. 하단 탭이 있으면 bottom은 제외 가능 */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
        <Slot /> 
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
