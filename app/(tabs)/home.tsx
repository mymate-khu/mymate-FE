import {View,ScrollView} from "react-native";
import ChattingComponent from "../home/home_chatting/Chattingcomponent";
import MateboardComponent from "../home/home_mateboard/Mateboardcomponent";

export default function Home(){
    return <ScrollView style={{ flex: 1, backgroundColor: 'white',flexDirection:"column",paddingHorizontal:"5%" }}>

        {/*맨위 마이페이지, 알림 : 정빈*/}
      <View>

      </View>


       {/*로고 & 메이트관리 : 정빈*/}

      <View>


      </View>

      {/*메이트보드 : 승원*/}

      <MateboardComponent></MateboardComponent>

      {/*투데이퍼즐  : 지민*/}

      <View>


      </View>


      {/*채팅창 : 승원*/}

      <View>
        <ChattingComponent/>

      </View>
    </ScrollView>
}