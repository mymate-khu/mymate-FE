import {
  View,
  StyleSheet,
  BackHandler
} from "react-native";
import { useCallback, useState, useEffect } from "react";
import RefreshableScrollView from "@/components/refresh/RefreshableScrollView";

import ChattingComponent from "@/app/home/home_chatting/Chattingcomponent";
import MateboardComponent from "@/app//home/home_mateboard/Mateboardcomponent";
import HomeHeadercomponent from "@/app/home/home_header/HomeHeadercomponent";
import HomeMateOverview from "../home/home_mate_overview/HomeMateOverview";
import TodayPuzzleScreen from "../home/home_puzzle/TodayPuzzleScreen";

export default function Home() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
  const handleChatScrollActive = useCallback((active: boolean) => {
    setOuterScrollEnabled(!active); // 채팅 드래그 중엔 부모 스크롤 잠금
  }, []);

  // ✅ 새로고침 트리거(부모 -> 자식)
  const [refreshSeq, setRefreshSeq] = useState(0);

  return (
    <RefreshableScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        paddingHorizontal: "5%"
      }}
      contentContainerStyle={{ paddingBottom: 24, minHeight: "100%" }} // Android 당김 안정화
      overScrollMode="always"
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      scrollEnabled={outerScrollEnabled}
      // ✅ 당김 시 자식들이 감지할 수 있도록 시그널 증가
      onManualRefresh={async () => {
        setRefreshSeq((s) => s + 1);
      }}
    >
      {/* 맨위 마이페이지, 알림 */}
      <HomeHeadercomponent />

      {/* 로고 & 메이트관리 */}
      <HomeMateOverview refreshSignal={refreshSeq} />

      {/* 메이트보드 */}
      <MateboardComponent />

      {/* 투데이 퍼즐 */}
      <TodayPuzzleScreen refreshSignal={refreshSeq} />

      {/* 채팅: 내부 스크롤만 동작 */}
      <View style={{ height: 560, marginBottom: 12 }}>
        <ChattingComponent
          fixedHeight={560}
          onScrollActive={handleChatScrollActive}
          refreshSignal={refreshSeq}   // 필요 시 채팅 목록도 갱신
        />
      </View>
    </RefreshableScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
