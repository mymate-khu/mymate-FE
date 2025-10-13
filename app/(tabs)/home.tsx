import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";

import ChattingComponent from "@/app/home/home_chatting/Chattingcomponent";
import MateboardComponent from "@/app//home/home_mateboard/Mateboardcomponent";
import TodayPuzzleComponent from "../home/home_puzzle/TodayPuzzleComponent";

// 로컬 이미지 리소스
import HomeHeadercomponent from "@/app/home/home_header/HomeHeadercomponent";
import HomeMateOverview from "../home/home_mate_overview/HomeMateOverview";

export default function Home() {

  
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        paddingHorizontal:"5%"
      }}
    >
      {/*맨위 마이페이지, 알림 */}
      <HomeHeadercomponent></HomeHeadercomponent>

      {/*로고 & 메이트관리 */}
      <HomeMateOverview></HomeMateOverview>

      {/*메이트보드 : 승원*/}
      <MateboardComponent></MateboardComponent>

      {/*투데이퍼즐  : 지민*/}
      
      <TodayPuzzleComponent />
      
      <ChattingComponent/>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
