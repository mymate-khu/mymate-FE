import { View,Text,TextInput,TouchableOpacity,SafeAreaView,StyleSheet,StatusBar,FlatList,useWindowDimensions,ScrollView } from "react-native";
import { router } from 'expo-router';

import SearchIcon from "@/assets/image/adjustmenticon/search_Icon.svg";
import AdjustIllustration from "@/assets/image/adjustmenticon/adjustment_Illustration.svg";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";
import CheckIcon from "@/assets/image/adjustmenticon/check_Icon.svg";
import ReceiptImage from "@/assets/image/adjustmenticon/receipt_image.svg";


export default function Adjustment() {
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1) 헤더 : 검색박스 + +버튼 */}
      <View style={s.header}>

        {/* 검색아이콘 + 입력창을 하나의 박스로 감싼다 */}
        <TouchableOpacity 
          style={s.searchBox} 
          activeOpacity={0.8}
          onPress={() => router.push("/adjustment_search")}
        >
          <SearchIcon style={s.searchIcon} />
          <TextInput
            placeholder="검색어를 입력하세요."
            placeholderTextColor="#767676"
            style={s.searchInput}
            editable={false}  // 입력 못하고 클릭만 가능 키보드 안뜨게끔
            pointerEvents="none" // 터치 이벤트는 부모(TouchableOpacity)로만 전달
          />
        </TouchableOpacity>

        {/* + 버튼 */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={s.addBtn}
          onPress={() => {
            // 파라미터 필요 없으면
            router.push('/adjustment_add');

            // 필요하면 이렇게 전달 가능
            // router.push({ pathname: '/adjustment_add', params: { from: 'adjustment' }});
          }}
        >
          <Text style={s.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>


      {/* 2) 인포 박스 */}
      <View style={s.infoBox}>

        {/* 왼쪽 : 텍스트 박스 */}
        <View style={s.infoTextBox}>
          <Text style={s.infoTitle}>정산 상태를 확인하고,{`\n`}지출 내역을 살펴보세요</Text>
          <Text style={s.infoSub}>누가 얼마 냈는지, 헷갈릴 틈 없게</Text>
        </View>

        {/* 오른쪽 : 이미지 박스 */}
        <View style={s.infoImageBox}>
          <AdjustIllustration width={115} height={113} />
        </View>
      </View>



      
      {/* 3) 미정산 박스 : 제목 + 카드박스 */}
      <View style={s.unpaidBox}>
        {/* 제목 */}
        <Text style={s.title}>아직 정산되지 않은 항목이 2건 있어요</Text>

        {/* 수평 스크롤 (캐로셀) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        ></ScrollView>

        {/* 카드 박스 */}
        <View style={s.unpaidCard}>
          {/* 아이콘 박스 */}
          <View style={s.iconBoxYellow}>
            <ShopbagIcon width={28} height={28} />
          </View>

          {/* 텍스트 박스 */}
          <View style={s.itemTextBox}>
            <Text style={s.itemTitle}>휴지</Text>
            <Text style={s.itemAmount}>-₩21,000</Text>
          </View>

          {/* 체크 박스 */}
          <View style={s.checkIconBox}>
            <CheckIcon width={24} height={24} />
          </View>
        </View>
      </View>



      {/* 4) 정산 박스 : 제목 + 카드박스 */}
      <View style={s.paidBox}>
        {/* 제목 */}
        <Text style={s.title}>정산내역</Text>

        {/* 노란색 카드 박스 */}
        <View style={s.paidCardYellow}>
          {/* 아이콘 박스 */}
          <View style={s.iconBoxYellow}>
            <ShopbagIcon width={28} height={28} />
          </View>

          {/* 이미지 박스 */}
          <ReceiptImage style={s.receiptImage} />


          {/* 텍스트 박스 */}
          <View style={s.itemTextBox}>
            <Text style={s.itemTitle}>휴지</Text>
            <Text style={s.itemAmount}>-₩21,000</Text>
          </View>

          {/* 더보기 버튼(카드 내부) */}
          <TouchableOpacity 
            activeOpacity={0.8}
            style={s.moreBtn}
            onPress={() => router.push("/adjustment_list")}
          >
            <Text style={s.moreBtnText}>더보기</Text>
          </TouchableOpacity>


        </View>
      </View>



      

    </SafeAreaView>
  );
}





const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  searchBox: {
    flex: 1,    // 남는 가로공간 전부 차지
    flexDirection: "row", // 아이콘과 입력창을 가로로 배치
    alignItems: "center", // 세로 가운데 정렬
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 8,          // 오른쪽 + 버튼과 간격
  },
  searchIcon: {
    width: 20,
    height: 20,
 
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: "#111",
  },                           
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE600",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    fontSize: 26,
    lineHeight: 26,
    color: "#111",
  },

  /* 인포 박스 */
  infoBox: {
    flexDirection: "row",        // 가로 배치
    justifyContent: "space-between", // 좌우 공간 균등 분배
    alignItems: "center",       // 세로 가운데 정렬
    backgroundColor: "#F0F0F0", // 연한 회색 
    height: 124, 
    borderRadius: 24,
    padding: 16,                // 안쪽 여백
    marginHorizontal: 15,       // 좌우 여백
    marginTop: 20,              // 위쪽 여백
  },
  infoTextBox: {
    flex: 1,                     // 남은 공간 다 차지
    marginHorizontal: 10,
    //backgroundColor: "#FFE000",
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: "600",
    //lineHeight: 25,
    color: "#000000",
  },
  infoSub: {
    fontSize: 13,
    color: "#797979",
    marginTop: 8,
  },
  infoImageBox: {
    width: 115,
    height: 113,
    justifyContent: "center",
    alignItems: "center", // 이미지 세로 가운데 정렬
    marginRight: 17,
    //backgroundColor: "#FFE600",
  },


  /* 미정산 박스 */
  unpaidBox: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    color: "#000",
  },
  unpaidCard: {
    width: 354,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE500",
    borderRadius: 16,
    padding: 16,
  },
  iconBoxYellow: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFD51C",
    alignItems: "center",
    justifyContent: "center",
    //marginRight: 12,
  },
  itemTextBox: {
    flex: 1,
    marginHorizontal: 16 // 남은 공간 전부 차지
  },
  itemTitle: {
    fontSize: 14,
    //fontWeight: "500",
    color: "#000",
  },
  itemAmount: {
    fontSize: 14,
    //fontWeight: "600",
    color: "#000",
    marginTop: 8,
  },
  checkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: "#FFD51C",
    alignItems: "center",
    justifyContent: "center",
  },

  /* 정산 박스 */
  paidBox: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  paidCardYellow: {
    width: 164,
    height: 320,
    //alignItems: "center",
    backgroundColor: "#FFE500",
    borderRadius: 16,
    padding: 16,
  },



  // 섹션 헤더(제목 + 더보기)
  paidHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  moreText: {
    fontSize: 16,
    color: "#9A9A9A",
  },

  // 공통 카드 베이스
  paidCardBase: {
    width: 320,             // 캐러셀 적용 전: 적당히 카드 폭 고정
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 14,        // (나중에 가로 스크롤 시) 카드간 간격
    // 그림자
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },

  /*// 색상 변형(노랑/보라)
  paidCardYellow: {
    backgroundColor: "#FFE300",
    ...StyleSheet.flatten(this?.paidCardBase ?? {}), // TS면 위에 베이스 합치지 말고 아래처럼 따로 정의해도 OK
  },
  paidCardPurple: {
    backgroundColor: "#D8B6FF",
    ...StyleSheet.flatten(this?.paidCardBase ?? {}),
  },
  */

  // 상단 아이콘 박스(색상별)
  iconBoxPurple: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: "#E7C9FF",
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  },

  // 영수증 이미지
  receiptImage: {
    width: "100%",
    aspectRatio: 1,      // 정사각형
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 12,
  },

  // 카드 내부 더보기 버튼
  moreBtn: {
    marginTop: 12,
    height: 28,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  moreBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111",
  },

});