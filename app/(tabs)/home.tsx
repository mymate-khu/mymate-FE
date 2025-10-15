import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useCallback,useState } from "react";

import ChattingComponent from "@/app/home/home_chatting/Chattingcomponent";
import MateboardComponent from "@/app//home/home_mateboard/Mateboardcomponent";
import TodayPuzzleComponent from "../home/home_puzzle/TodayPuzzleComponent";

// 로컬 이미지 리소스
import HomeHeadercomponent from "@/app/home/home_header/HomeHeadercomponent";
import MateManagement from "../home/home_mate_manage/MateManagement";

export default function Home() {

  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);

  const handleChatScrollActive = useCallback((active: boolean) => {
    // active=true: 채팅이 스크롤 중 -> 부모 스크롤 잠금
    setOuterScrollEnabled(!active);
  }, []);

  
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        paddingHorizontal:"5%"
      }}
      nestedScrollEnabled // 👈 추가
      keyboardShouldPersistTaps="handled"
      scrollEnabled={outerScrollEnabled}
    >
      {/*맨위 마이페이지, 알림 */}
      <HomeHeadercomponent></HomeHeadercomponent>

      {/*로고 & 메이트관리 */}
      <MateManagement></MateManagement>

      {/*메이트보드 : 승원*/}
      <MateboardComponent></MateboardComponent>

      {/*투데이퍼즐  : 지민*/}
      
      <TodayPuzzleComponent />
      
       {/* 채팅 영역은 고정 높이 + 자식 스크롤만 동작 */}
      <View style={{ height: 560, marginBottom: 12 }}>
        <ChattingComponent
          fixedHeight={560}
          onScrollActive={handleChatScrollActive} // 👈 콜백 전달
        />
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
